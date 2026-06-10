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
      .select('user_id, email, onboarding_token_expires')
      .eq('onboarding_token', token)
      .single()

    const profile = profileData as any

    if (error || !profile) {
      throw createError({ statusCode: 400, statusMessage: 'Link Expired or Invalid' })
    }

    if (new Date(profile.onboarding_token_expires) < new Date()) {
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
