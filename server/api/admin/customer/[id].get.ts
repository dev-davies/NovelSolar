import { serverSupabaseServiceRole } from '#supabase/server'
import { logger } from '../../../utils/logger'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Customer ID is required' })
  }

  const supabase = await serverSupabaseServiceRole(event)

  try {
    // Fetch profile
    const { data: profile, error: profileError } = await supabase.from('profiles').select('*').eq('id', id).single()

    if (profileError || !profile) {
      throw createError({ statusCode: 404, statusMessage: 'Customer not found' })
    }

    // Fetch orders (Note: Currently NovelSolar checkout sends orders to Bitrix CRM.
    // This queries the Supabase orders table in case future webhooks populate it).
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', id)
      .order('created_at', { ascending: false })

    if (ordersError) {
      logger.warn('Admin Customer API', 'Failed to fetch orders for customer', { error: ordersError })
    }

    return {
      success: true,
      customer: profile,
      orders: orders || [],
    }
  } catch (err: unknown) {
    const error = err as { statusCode?: number; statusMessage?: string; message?: string }
    logger.error('Admin Customer API', 'Failed to fetch customer details', { error })
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || 'Internal server error',
    })
  }
})
