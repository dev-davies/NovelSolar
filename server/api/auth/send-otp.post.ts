import nodemailer from 'nodemailer';

const RATE_LIMIT = {
  THROTTLE_MS: 2 * 60 * 1000, 
  MAX_PER_HOUR: 5, 
  HOUR_WINDOW_MS: 60 * 60 * 1000, 
};

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { email } = body;
    const config = useRuntimeConfig();

    if (!email) {
      throw createError({ statusCode: 400, statusMessage: 'Email is required' });
    }

    const storage = useStorage('otp');
    const throttleKey = `otp:throttle:${email}`;
    const attemptsKey = `otp:attempts:${email}`;
    const failedKey = `otp:failed:${email}`;

    const failedAttempts = (await storage.getItem(failedKey) as { count: number } | null) || { count: 0 };
    if (failedAttempts.count >= 5) {
      throw createError({
        statusCode: 429,
        statusMessage: 'Too many failed attempts. Please try again in 1 hour.',
      });
    }

    const lastRequest = await storage.getItem(throttleKey) as { timestamp: number } | null;
    if (lastRequest && Date.now() - lastRequest.timestamp < RATE_LIMIT.THROTTLE_MS) {
      const secondsRemaining = Math.ceil((RATE_LIMIT.THROTTLE_MS - (Date.now() - lastRequest.timestamp)) / 1000);
      throw createError({
        statusCode: 429,
        statusMessage: `Please wait ${secondsRemaining} seconds before requesting another code.`,
      });
    }

    const attempts = (await storage.getItem(attemptsKey) as { count: number; resetTime: number } | null) || {
      count: 0,
      resetTime: Date.now() + RATE_LIMIT.HOUR_WINDOW_MS
    };

    if (Date.now() > attempts.resetTime) {
      attempts.count = 0;
      attempts.resetTime = Date.now() + RATE_LIMIT.HOUR_WINDOW_MS;
    }

    if (attempts.count >= RATE_LIMIT.MAX_PER_HOUR) {
      const minutesRemaining = Math.ceil((attempts.resetTime - Date.now()) / 60000);
      throw createError({
        statusCode: 429,
        statusMessage: `Too many OTP requests. Please try again in ${minutesRemaining} minutes.`,
      });
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000;

    await storage.setItem(`user:${email}`, { code: otpCode, expiresAt: expiresAt });
    await storage.setItem(throttleKey, { timestamp: Date.now() }, { ttl: RATE_LIMIT.THROTTLE_MS / 1000 });
    await storage.setItem(attemptsKey, { count: attempts.count + 1, resetTime: attempts.resetTime }, { ttl: RATE_LIMIT.HOUR_WINDOW_MS / 1000 });

    if (config.smtpUser && config.smtpPass) {
      const transporter = nodemailer.createTransport({
        pool: true,
        host: config.smtpHost,
        port: Number(config.smtpPort) || 587,
        secure: false, 
        auth: { user: config.smtpUser, pass: config.smtpPass },
        tls: { rejectUnauthorized: false }
      });

      const mailOptions = {
        from: config.smtpFrom,
        to: email,
        subject: 'Your Novel Solar Login Code',
        html: `<p>Your code is: <strong>${otpCode}</strong></p>`
      };

      await transporter.sendMail(mailOptions);
    } else {
      console.log(`[DEV] OTP for ${email}: ${otpCode}`);
    }

    return { success: true, message: 'OTP sent successfully' };
    
  } catch (error: any) {
    // THIS CATCHES THE FATAL CRASH AND SENDS THE REAL ERROR TO YOUR