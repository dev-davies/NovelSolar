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
    const { data: invitation, error } = await supabase
      .from('dealer_invitations')
      .select('*')
      .eq('token', token)
      .single()

    if (error || !invitation) {
      throw createError({ statusCode: 400, statusMessage: 'Link Expired or Invalid' })
    }

    if (invitation.used) {
      throw createError({ statusCode: 400, statusMessage: 'Link Expired or Invalid' })
    }

    if (new Date(invitation.expires_at) < new Date()) {
      throw createError({ statusCode: 400, statusMessage: 'Link Expired or Invalid' })
    }

    return { success: true, valid: true, email: invitation.email }
  } catch (err: unknown) {
    const error = err as { statusCode?: number; statusMessage?: string; message?: string }
    logger.error('Dealer Verify API', 'Token verification failed', { error })
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal server error',
    })
  }
})
