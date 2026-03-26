import nodemailer from 'nodemailer';

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

  // 1. Generate a random 6-digit numeric string
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // 2. Save OTP in Nitro storage (expires in 10 minutes)
  await useStorage('cache').setItem(`otp:${email}`, { 
    code: otp, 
    expires: Date.now() + 10 * 60 * 1000 
  });

  // 3. SMTP configuration (copied from checkout handler)
  if (config.smtpUser && config.smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        pool: true,
        host: config.smtpHost,
        port: Number(config.smtpPort) || 587,
        secure: false, // Must be false for port 587
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
                ${otp}
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
    // Development fallback if SMTP is not configured
    console.log(`[DEV] OTP for ${email}: ${otp}`);
  }

  return { success: true, message: 'OTP sent successfully' };
});
