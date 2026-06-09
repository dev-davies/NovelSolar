import { serverSupabaseServiceRole } from '#supabase/server'
import { logger } from '../../utils/logger'

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseServiceRole(event)

  try {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('user_id, email, first_name, last_name, role, dealer_status, created_at')
      .eq('role', 'deleted')
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return { success: true, customers: (profiles as any[])?.map((p) => ({ ...p, id: p.user_id })) || [] }
  } catch (err: unknown) {
    const error = err as { message?: string }
    logger.error('Admin Customers API', 'Failed to fetch trashed customers', { error })
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to fetch trashed customers',
    })
  }
})
