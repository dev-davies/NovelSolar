import { serverSupabaseServiceRole } from '#supabase/server'
import { logger } from '../../utils/logger'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const token = body?.token
  const password = body?.password

  if (!token || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Token and password are required' })
  }

  if (password.length < 8) {
    throw createError({ statusCode: 400, statusMessage: 'Password must be at least 8 characters' })
  }

  const supabase = serverSupabaseServiceRole(event)

  try {
    // 1. Re-validate the token securely
    const { data: invitation, error: inviteError } = await supabase
      .from('dealer_invitations')
      .select('*')
      .eq('token', token)
      .single()

    if (inviteError || !invitation || invitation.used || new Date(invitation.expires_at) < new Date()) {
      throw createError({ statusCode: 400, statusMessage: 'Link Expired or Invalid' })
    }

    // 2. Provision the authentication account smoothly without email verification
    const { data: userData, error: createError } = await supabase.auth.admin.createUser({
      email: invitation.email,
      password: password,
      email_confirm: true, // Verified via secure token automatically
    })

    if (createError) throw createError

    const userId = userData.user.id

    // 3. Upsert the specialized dealer profile explicitly bypassing defaults
    const { error: profileError } = await supabase.from('profiles').upsert({
      user_id: userId,
      role: 'dealer',
      dealer_status: 'approved',
    })

    if (profileError) throw profileError

    // 4. Burn the token cleanly to prevent reuse
    const { error: updateError } = await supabase.from('dealer_invitations').update({ used: true }).eq('token', token)

    if (updateError) throw updateError

    return { success: true, email: invitation.email }
  } catch (err: unknown) {
    const error = err as { statusCode?: number; statusMessage?: string; message?: string }
    logger.error('Dealer Create API', 'Account creation failed', { error })
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || 'Internal server error',
    })
  }
})
