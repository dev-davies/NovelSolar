import { serverSupabaseServiceRole } from '#supabase/server'
import { logger } from '../../utils/logger'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const customerId = body.customerId

  if (!customerId) {
    throw createError({ statusCode: 400, statusMessage: 'Customer ID is required' })
  }

  const supabase = await serverSupabaseServiceRole(event)

  try {
    const { error } = await supabase
      .from('profiles')
      .update({ role: 'deleted' } as never)
      .eq('user_id', customerId)

    if (error) throw error

    logger.info('Admin API', `Customer ${customerId} moved to trash.`)

    return { success: true }
  } catch (err: unknown) {
    const error = err as { statusCode?: number; statusMessage?: string; message?: string }
    logger.error('Admin API', 'Failed to trash customer', { error })
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || 'Internal server error',
    })
  }
})
