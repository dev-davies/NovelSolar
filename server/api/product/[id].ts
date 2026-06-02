import { logger } from '../../utils/logger'
import { serverSupabaseUser, serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  let isDealer = false
  try {
    const user = await serverSupabaseUser(event)
    if (user) {
      const supabase = await serverSupabaseServiceRole(event)
      const { data: profile } = (await supabase
        .from('profiles')
        .select('role, dealer_status')
        .eq('user_id', user.id)
        .single()) as { data: { role: string; dealer_status: string } | null }

      if (profile && profile.role === 'dealer' && profile.dealer_status === 'approved') {
        isDealer = true
      }
    }
  } catch (err) {
    // Ignore errors for unauthenticated users
  }

  try {
    interface BitrixProduct {
      ACTIVE?: string
      PROPERTY_116?: unknown
      PROPERTY_102?: unknown
      PROPERTY_104?: unknown
      PROPERTY_112?: unknown
      dealerPrice?: number
      [key: string]: unknown
    }
    const response = await fetchWithBitrixContext<{ result?: BitrixProduct }>(event, `crm.product.get?id=${id}`)
    const product = response.result || null

    if (product) {
      if (product.ACTIVE === 'N') {
        throw createError({ statusCode: 404, statusMessage: 'Product not found' })
      }

      product.PROPERTY_102 = normalizeProperty(product.PROPERTY_102)
      product.PROPERTY_104 = normalizeProperty(product.PROPERTY_104)
      product.PROPERTY_112 = normalizeProperty(product.PROPERTY_112)

      const rawDealerPrice = normalizeProperty(product.PROPERTY_116)
      if (isDealer && rawDealerPrice !== undefined && rawDealerPrice !== null) {
        product.dealerPrice = Number(rawDealerPrice)
      }

      // Always strip the raw PROPERTY_116 so it doesn't leak
      delete product.PROPERTY_116
    }

    return product
  } catch (error) {
    logger.error('Product', 'Bitrix API error', { error })
    throw createError({ statusCode: 404, statusMessage: 'Product not found' })
  }
})
