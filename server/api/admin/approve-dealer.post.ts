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

  const supabase = await serverSupabaseServiceRole(event)

  try {
    // 1. Fetch the application to get the email
    const { data: appData, error: fetchError } = (await supabase
      .from('dealer_applications')
      .select('email, business_name, contact_name, status')
      .eq('id', applicationId)
      .single()) as { data: any; error: any }

    if (fetchError || !appData) {
      throw createError({ statusCode: 404, statusMessage: 'Application not found' })
    }

    if (appData.status === 'approved') {
      throw createError({ statusCode: 400, statusMessage: 'Application is already approved' })
    }

    // 2. Update status to 'approved'
    const { error: updateError } = await supabase
      .from('dealer_applications')
      .update({ status: 'approved' } as any)
      .eq('id', applicationId)

    if (updateError) throw updateError

    // 3. Check if user exists & provision
    let userId: string | null = null

    const { data: newUser, error: authError } = await supabase.auth.admin.createUser({
      email: appData.email,
      email_confirm: true,
    })

    if (authError) {
      if (authError.message.toLowerCase().includes('already')) {
        // User exists. Fetch their ID securely
        const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
          type: 'magiclink',
          email: appData.email,
        })
        if (linkError || !linkData?.user?.id) throw authError
        userId = linkData.user.id
      } else {
        throw authError
      }
    } else {
      userId = newUser.user.id
    }

    if (!userId) {
      throw createError({ statusCode: 400, statusMessage: 'Failed to provision user ID' })
    }

    // 4. Upsert the profile
    const { error: profileError } = await supabase.from('profiles').upsert({
      user_id: userId,
      role: 'dealer',
      dealer_status: 'approved',
    } as any)

    if (profileError) throw profileError

    // 5. Send approval email (passwordless version)
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
      const setupLink = `${domain}/login`

      const emailHtml = `
        <div style="font-family: sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #002888;">Congratulations! Your Application is Approved</h2>
          <p>Hello ${appData.contact_name},</p>
          <p>We are thrilled to welcome <strong>${appData.business_name}</strong> to the NovelSolar Authorized Dealer Network!</p>
          <p>Your wholesale pricing account has been activated. You can now log into our storefront using your email address (no password required):</p>
          <div style="margin: 30px 0; text-align: center;">
            <a href="${setupLink}" style="background-color: #002888; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Log In to Your Account</a>
          </div>
          <p>If you have any questions, please reply to this email or contact our support team.</p>
          <p>Best regards,<br>The NovelSolar Team</p>
        </div>
      `

      await transporter
        .sendMail({
          from: config.smtpFrom,
          to: appData.email,
          subject: 'Welcome to NovelSolar! Your Dealer Account is Ready',
          html: emailHtml,
        })
        .catch((e) => logger.error('Dealer Approval API', 'Email send failed', { error: e }))
    }

    return { success: true, message: 'Dealer approved and email sent' }
  } catch (err: unknown) {
    const error = err as { statusCode?: number; statusMessage?: string; message?: string }
    logger.error('Dealer Approval API', 'Error approving dealer', { error })
    throw createError({
      statusCode: error.statusCode || 400,
      statusMessage: error.message || error.statusMessage || 'Internal server error',
    })
  }
})
