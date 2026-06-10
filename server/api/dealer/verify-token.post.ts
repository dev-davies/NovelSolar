import { serverSupabaseServiceRole } from '#supabase/server'
import { logger } from '../../utils/logger'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const token = body?.token

  if (!token) {
    throw createError({ statusCode: 400, statusMessage: 'Token is required' })
  }

  const supabase = serverSupabaseServiceRole(event)

  try {
    const { data: profileData, error } = await supabase
      .from('profiles')
      .select('user_id, email, token_expires_at')
      .eq('onboarding_token', token)
      .single()

    const profile = profileData as any

    if (error || !profile) {
      throw createError({ statusCode: 400, statusMessage: 'Link Expired or Invalid' })
    }

    if (new Date(profile.token_expires_at) < new Date()) {
      throw createError({ statusCode: 400, statusMessage: 'Link Expired or Invalid' })
    }

    return { success: true, valid: true, email: profile.email }
  } catch (err: unknown) {
    const error = err as { statusCode?: number; statusMessage?: string; message?: string }
    logger.error('Dealer Verify API', 'Token verification failed', { error })
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal server error',
    })
  }
})
