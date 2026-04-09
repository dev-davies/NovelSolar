import nodemailer from 'nodemailer'

const RATE_LIMIT = {
  THROTTLE_MS: 2 * 60 * 1000,
  MAX_PER_HOUR: 5,
  HOUR_WINDOW_MS: 60 * 60 * 1000,
}

const OTP_TTL_SECONDS = 10 * 60
const FAILED_LOCK_SECONDS = 60 * 60

type RateLimitType = 'throttle' | 'hourly_limit_exceeded' | 'failed_attempts_exceeded'

function createRateLimitError(statusMessage: string, type: RateLimitType, retryAfter: number) {
  return createError({
    statusCode: 429,
    statusMessage,
    data: { type, retryAfter },
  })
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<{ email?: string }>(event)
    const rawEmail = body?.email ?? ''
    const email = rawEmail.trim().toLowerCase()
    const config = useRuntimeConfig()

    if (!email) {
      throw createError({ statusCode: 400, statusMessage: 'Email is required' })
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(email)) {
      throw createError({ statusCode: 400, statusMessage: 'Please enter a valid email address' })
    }

    const storage = useStorage('otp')
    const throttleKey = `otp:throttle:${email}`
    const attemptsKey = `otp:attempts:${email}`
    const failedKey = `otp:failed:${email}`
    const userCodeKey = `user:${email}`

    const failedAttempts = (await storage.getItem(failedKey) as { count: number } | null) || { count: 0 }
    if (failedAttempts.count >= 5) {
      throw createRateLimitError(
        'Too many failed attempts. Please try again in 1 hour.',
        'failed_attempts_exceeded',
        FAILED_LOCK_SECONDS
      )
    }

    const lastRequest = await storage.getItem(throttleKey) as { timestamp: number } | null
    if (lastRequest && (Date.now() - lastRequest.timestamp) < RATE_LIMIT.THROTTLE_MS) {
      const retryAfter = Math.ceil((RATE_LIMIT.THROTTLE_MS - (Date.now() - lastRequest.timestamp)) / 1000)
      throw createRateLimitError(
        `Please wait ${retryAfter} seconds before requesting another code.`,
        'throttle',
        retryAfter
      )
    }

    const attempts = (await storage.getItem(attemptsKey) as { count: number, resetTime: number } | null) || {
      count: 0,
      resetTime: Date.now() + RATE_LIMIT.HOUR_WINDOW_MS,
    }

    if (Date.now() > attempts.resetTime) {
      attempts.count = 0
      attempts.resetTime = Date.now() + RATE_LIMIT.HOUR_WINDOW_MS
    }

    if (attempts.count >= RATE_LIMIT.MAX_PER_HOUR) {
      const retryAfter = Math.max(1, Math.ceil((attempts.resetTime - Date.now()) / 1000))
      const minutesRemaining = Math.ceil(retryAfter / 60)
      throw createRateLimitError(
        `Too many OTP requests. Please try again in ${minutesRemaining} minutes.`,
        'hourly_limit_exceeded',
        retryAfter
      )
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = Date.now() + (OTP_TTL_SECONDS * 1000)

    await storage.setItem(userCodeKey, { code: otpCode, expiresAt }, { ttl: OTP_TTL_SECONDS })
    await storage.setItem(throttleKey, { timestamp: Date.now() }, { ttl: Math.ceil(RATE_LIMIT.THROTTLE_MS / 1000) })
    await storage.setItem(
      attemptsKey,
      { count: attempts.count + 1, resetTime: attempts.resetTime },
      { ttl: Math.ceil(RATE_LIMIT.HOUR_WINDOW_MS / 1000) }
    )

    if (config.smtpUser && config.smtpPass) {
      const transporter = nodemailer.createTransport({
        pool: true,
        host: config.smtpHost,
        port: Number(config.smtpPort) || 587,
        secure: false,
        auth: {
          user: config.smtpUser,
          pass: config.smtpPass,
        },
        tls: { rejectUnauthorized: false },
      })

      await transporter.sendMail({
        from: config.smtpFrom,
        to: email,
        subject: 'Your Novel Solar Login Code',
        html: `<p>Your code is: <strong>${otpCode}</strong></p>`,
      })
    } else {
      console.log(`[DEV] OTP for ${email}: ${otpCode}`)
    }

    return { success: true, message: 'OTP sent successfully' }
  } catch (error: any) {
    if (error?.statusCode && error?.statusMessage) {
      throw error
    }

    console.error('[AUTH] Send OTP error:', error?.data || error?.message || error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to send verification code. Please try again.',
    })
  }
})
