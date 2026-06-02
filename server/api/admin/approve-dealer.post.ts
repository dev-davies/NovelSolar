import { serverSupabaseServiceRole } from '#supabase/server'
import nodemailer from 'nodemailer'
import { logger } from '../../utils/logger'
import crypto from 'node:crypto'

export default defineEventHandler(async (event) => {
  // Security check is handled globally by server/middleware/admin-auth.ts for /api/admin/* routes

  const body = await readBody(event)
  const applicationId = body?.applicationId

  if (!applicationId) {
    throw createError({ statusCode: 400, statusMessage: 'Missing applicationId' })
  }

  const supabase = serverSupabaseServiceRole(event)

  try {
    // 1. Fetch the application to get the email
    const { data: appData, error: fetchError } = await supabase
      .from('dealer_applications')
      .select('email, business_name, contact_name, status')
      .eq('id', applicationId)
      .single()

    if (fetchError || !appData) {
      throw createError({ statusCode: 404, statusMessage: 'Application not found' })
    }

    if (appData.status === 'approved') {
      throw createError({ statusCode: 400, statusMessage: 'Application is already approved' })
    }

    // 2. Update status to 'approved'
    const { error: updateError } = await supabase
      .from('dealer_applications')
      .update({ status: 'approved' })
      .eq('id', applicationId)

    if (updateError) throw updateError

    // 3. Generate secure, unique token & expiration (3 days from now)
    const token = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()

    // 4. Insert into dealer_invitations
    const { error: inviteError } = await supabase.from('dealer_invitations').insert({
      email: appData.email,
      token: token,
      expires_at: expiresAt,
      used: false,
    })

    if (inviteError) throw inviteError

    // 5. Send approval email
    const config = useRuntimeConfig()
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

      const domain = config.public.baseUrl ? config.public.baseUrl.replace(/\/$/, '') : 'https://novelsolar.ng'
      const setupLink = `${domain}/dealer/setup-account?token=${token}`

      const emailHtml = `
        <div style="font-family: sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #002888;">Congratulations! Your Application is Approved</h2>
          <p>Hello ${appData.contact_name},</p>
          <p>We are thrilled to welcome <strong>${appData.business_name}</strong> to the NovelSolar Authorized Dealer Network!</p>
          <p>To access your wholesale pricing, resources, and complete your registration, please set up your account password using the secure link below:</p>
          <div style="margin: 30px 0; text-align: center;">
            <a href="${setupLink}" style="background-color: #002888; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Set Up My Account</a>
          </div>
          <p style="color: #d32f2f; font-weight: bold;">Important: This setup link will expire in exactly 3 days and can only be used once.</p>
          <p>If you have any questions, please reply to this email or contact our support team.</p>
          <p>Best regards,<br>The NovelSolar Team</p>
        </div>
      `

      await transporter
        .sendMail({
          from: config.smtpFrom,
          to: appData.email,
          subject: 'Welcome to NovelSolar! Set up your Dealer Account',
          html: emailHtml,
        })
        .catch((e) => logger.error('Dealer Approval API', 'Email send failed', { error: e }))
    }

    return { success: true, message: 'Dealer approved and invitation sent' }
  } catch (err: unknown) {
    const error = err as { statusCode?: number; statusMessage?: string; message?: string }
    logger.error('Dealer Approval API', 'Error approving dealer', { error })
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || 'Internal server error',
    })
  }
})
