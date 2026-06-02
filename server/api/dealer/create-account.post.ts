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

  const supabase = await serverSupabaseServiceRole(event)

  try {
    // 1. Re-validate the token securely
    const { data: invitation, error: inviteError } = await supabase
      .from('dealer_invitations')
      .select('*')
      .eq('token', token)
      .single()

    if (
      inviteError ||
      !invitation ||
      (invitation as any).used ||
      new Date((invitation as any).expires_at) < new Date()
    ) {
      throw createError({ statusCode: 400, statusMessage: 'Link Expired or Invalid' })
    }

    // 2. Provision the authentication account smoothly without email verification
    const { data: userData, error: authError } = await supabase.auth.admin.createUser({
      email: (invitation as any).email,
      password: password,
      email_confirm: true, // Verified via secure token automatically
    })

    if (authError) throw authError

    const userId = userData.user.id

    // 3. Upsert the specialized dealer profile explicitly bypassing defaults
    const { error: profileError } = await supabase.from('profiles').upsert({
      user_id: userId,
      role: 'dealer',
      dealer_status: 'approved',
    } as any)

    if (profileError) throw profileError

    // 4. Burn the token cleanly to prevent reuse
    const { error: updateError } = await supabase
      .from('dealer_invitations')
      .update({ used: true } as any)
      .eq('token', token)

    if (updateError) throw updateError

    return { success: true, email: (invitation as any).email }
  } catch (err: unknown) {
    const error = err as { statusCode?: number; statusMessage?: string; message?: string }
    logger.error('Dealer Create API', 'Account creation failed', { error })
    throw createError({
      statusCode: 400,
      statusMessage: error.message || error.statusMessage || 'Internal server error',
    })
  }
})
