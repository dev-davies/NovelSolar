import { serverSupabaseServiceRole } from '#supabase/server'
import { logger } from '../../utils/logger'

export default defineEventHandler(async (event) => {
  const supabase = serverSupabaseServiceRole(event)

  try {
    // Get all applications
    const { data: applications, error: appError } = await supabase
      .from('dealer_applications')
      .select('*')
      .order('created_at', { ascending: false })

    if (appError) throw createError({ statusCode: 500, statusMessage: appError.message })

    return { success: true, dealers: applications }
  } catch (err: unknown) {
    const error = err as { statusCode?: number; statusMessage?: string; message?: string }
    logger.error('Admin API', 'Error fetching dealers', { error })
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || 'Internal server error',
    })
  }
})
