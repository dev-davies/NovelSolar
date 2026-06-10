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
    const { data: profileData, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('onboarding_token', token)
      .single()

    const profile = profileData as any

    if (fetchError || !profile || !profile.token_expires_at || new Date(profile.token_expires_at) < new Date()) {
      throw createError({ statusCode: 400, statusMessage: 'Link Expired or Invalid' })
    }

    // 2. Update the authentication account password securely
    const { error: authError } = await supabase.auth.admin.updateUserById(profile.user_id, {
      password: password,
      email_confirm: true,
    })

    if (authError) throw authError

    // 3. Burn the token cleanly to prevent reuse in the profiles table
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ onboarding_token: null, token_expires_at: null } as never)
      .eq('user_id', profile.user_id)

    if (updateError) throw updateError

    return { success: true, email: profile.email }
  } catch (err: unknown) {
    const error = err as { statusCode?: number; statusMessage?: string; message?: string }
    logger.error('Dealer Create API', 'Account creation failed', { error })
    throw createError({
      statusCode: 400,
      statusMessage: error.message || error.statusMessage || 'Internal server error',
    })
  }
})
