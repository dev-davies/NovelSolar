import { createHmac, timingSafeEqual } from 'node:crypto'

export const OTP_CHALLENGE_COOKIE = 'otp_challenge'

export interface OtpChallengePayload {
  email: string
  codeHash: string
  expiresAt: number
}

function signValue(value: string, secret: string) {
  return createHmac('sha256', secret).update(value).digest('base64url')
}

export function createOtpChallengeToken(payload: OtpChallengePayload, secret: string) {
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const signature = signValue(encodedPayload, secret)
  return `${encodedPayload}.${signature}`
}

export function createOtpCodeHash(email: string, code: string, secret: string) {
  return signValue(`${email}:${code}`, secret)
}

export function parseOtpChallengeToken(token: string, secret: string): OtpChallengePayload | null {
  if (!token || !secret) return null

  const parts = token.split('.')
  if (parts.length !== 2) return null

  const [encodedPayload, signature] = parts
  const expectedSignature = signValue(encodedPayload, secret)

  const actualBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expectedSignature)
  if (actualBuffer.length !== expectedBuffer.length || !timingSafeEqual(actualBuffer, expectedBuffer)) {
    return null
  }

  try {
    const decoded = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8')) as OtpChallengePayload
    if (!decoded.email || !decoded.codeHash || !decoded.expiresAt) return null
    return decoded
  } catch {
    return null
  }
}
