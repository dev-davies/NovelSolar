import nodemailer from 'nodemailer';

const RATE_LIMIT = {
  THROTTLE_MS: 2 * 60 * 1000, // 2 minutes between requests
  MAX_PER_HOUR: 5, // Max 5 OTPs per hour
  HOUR_WINDOW_MS: 60 * 60 * 1000, // 1 hour
};

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email } = body;
  const config = useRuntimeConfig();

  if (!email) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email is required',
    });
  }

  // 1. Rate limiting checks - switching to 'otp' storage for persistence across restarts
  const storage = useStorage('otp');
  const throttleKey = `otp:throttle:${email}`;
  const attemptsKey = `otp:attempts:${email}`;
  const failedKey = `otp:failed:${email}`;

  // Check for too many failed verification attempts
  const failedAttempts = (await storage.getItem(failedKey) as { count: number } | null) || { count: 0 };
  if (failedAttempts.count >= 5) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Too many failed attempts. Please try again in 1 hour.',
      data: {
        type: 'failed_attempts_exceeded',
        retryAfter: 3600,
        message: 'Account temporarily locked due to too many failed attempts'
      }
    });
  }

  // Check throttle (minimum time between requests)
  const lastRequest = await storage.getItem(throttleKey) as { timestamp: number } | null;
  if (lastRequest && Date.now() - lastRequest.timestamp < RATE_LIMIT.THROTTLE_MS) {
    const secondsRemaining = Math.ceil((RATE_LIMIT.THROTTLE_MS - (Date.now() - lastRequest.timestamp)) / 1000);
    throw createError({
      statusCode: 429,
      statusMessage: `Please wait ${secondsRemaining} seconds before requesting another code.`,
      data: {
        type: 'throttle',
        retryAfter: secondsRemaining,
        message: 'Please wait before requesting another code'
      }
    });
  }

  // Check hourly limit
  const attempts = (await storage.getItem(attemptsKey) as { count: number; resetTime: number } | null) || {
    count: 0,
    resetTime: Date.now() + RATE_LIMIT.HOUR_WINDOW_MS
  };

  // Reset if hour window has passed
  if (Date.now() > attempts.resetTime) {
    attempts.count = 0;
    attempts.resetTime = Date.now() + RATE_LIMIT.HOUR_WINDOW_MS;
  }

  if (attempts.count >= RATE_LIMIT.MAX_PER_HOUR) {
    const minutesRemaining = Math.ceil((attempts.resetTime - Date.now()) / 60000);
    throw createError({
      statusCode: 429,
      statusMessage: `Too many OTP requests. Please try again in ${minutesRemaining} minutes.`,
      data: {
        type: 'hourly_limit_exceeded',
        retryAfter: Math.ceil((attempts.resetTime - Date.now()) / 1000),
        resetTime: attempts.resetTime,
        message: 'Too many requests in the last hour'
      }
    });
  }

  // 2. Generate a random 6-digit numeric string
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Expiration time: 10 minutes from now
  const expiresAt = Date.now() + 10 * 60 * 1000;

  // 3. Save OTP in Nitro storage (persistent KV)
  await storage.setItem(`user:${email}`, { 
    code: otpCode, 
    expiresAt: expiresAt 
  });

  // 4. Update rate limiting trackers
  await storage.setItem(throttleKey, { timestamp: Date.now() }, { ttl: RATE_LIMIT.THROTTLE_MS / 1000 });
  await storage.setItem(attemptsKey, { 
    count: attempts.count + 1, 
    resetTime: attempts.resetTime 
  }, { ttl: RATE_LIMIT.HOUR_WINDOW_MS / 1000 });

  // 5. SMTP configuration
  if (config.smtpUser && config.smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        pool: true,
        host: config.smtpHost,
        port: Number(config.smtpPort) || 587,
        secure: false, 
        auth: { 
          user: config.smtpUser, 
          pass: config.smtpPass 
        },
        tls: {
          rejectUnauthorized: false 
        }
      });

      const mailOptions = {
        from: config.smtpFrom,
        to: email,
        subject: 'Your Novel Solar Login Code',
        html: `
          <div style="font-family: sans-serif; text-align: center; padding: 40px; background-color: #fcf9f8; color: #1c1b1b;">
            <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 12px; border-top: 4px solid #a9001d; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
              <h2 style="font-size: 24px; font-weight: 800; margin-bottom: 24px;">Your Login Code</h2>
              <p style="color: #525252; margin-bottom: 32px;">Please use the following 6-digit code to complete your login. This code will expire in 10 minutes.</p>
              <div style="font-size: 48px; font-weight: 900; letter-spacing: 12px; color: #a9001d; background-color: #ffe7e5; padding: 20px; border-radius: 8px; display: inline-block;">
                ${otpCode}
              </div>
              <p style="color: #94a3b8; font-size: 12px; margin-top: 32px;">If you didn't request this code, you can safely ignore this email.</p>
            </div>
            <p style="margin-top: 24px; color: #94a3b8; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em;">© ${new Date().getFullYear()} Novel Solar. Precision energy solutions.</p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('OTP Email Error:', error);
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to send OTP email',
      });
    }
  } else {
    // Development fallback
    console.log(`[DEV] OTP for ${email}: ${otpCode}`);
  }

  return { success: true, message: 'OTP sent successfully' };
});
