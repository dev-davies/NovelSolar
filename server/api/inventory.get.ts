import { logger } from '../utils/logger'

import { serverSupabaseUser, serverSupabaseServiceRole } from '#supabase/server'
import { normalizeProperty } from '../utils/normalizeProperty'

export default defineEventHandler(async (event) => {
  interface BitrixInventoryProduct {
    ID?: string | number
    NAME?: string
    PRICE?: string | number
    PROPERTY_116?: unknown
    QUANTITY?: string | number
    CURRENCY_ID?: string
    SECTION_ID?: string | number
    ACTIVE?: string
    PROPERTY_102?: unknown
    PROPERTY_104?: unknown
    PROPERTY_112?: unknown
    DETAIL_PICTURE?: unknown
    PREVIEW_PICTURE?: unknown
    PROPERTY_44?: unknown
    [key: string]: unknown
  }

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
    // Ignore unauthenticated
  }

  const allProducts: BitrixInventoryProduct[] = []

    // ─── PHASE 1: Paginate through crm.product.list to get all product metadata ───
    try {
      let start = 0
      let hasMore = true

      while (hasMore) {
        const endpoint = `crm.product.list${start > 0 ? `?start=${start}` : ''}`

        const response = await fetchWithBitrixContext<{ result: BitrixInventoryProduct[]; next?: number }>(
          event,
          endpoint,
          {
            method: 'POST',
            body: {
              limit: 50,
              filter: { ACTIVE: 'Y' },
              select: [
                'ID',
                'NAME',
                'PRICE',
                'QUANTITY',
                'CURRENCY_ID',
                'SECTION_ID',
                'ACTIVE',
                'PROPERTY_102',
                'PROPERTY_104',
                'PROPERTY_112',
                'PROPERTY_116',
                'DETAIL_PICTURE',
                'PREVIEW_PICTURE',
                'PROPERTY_44',
              ],
            },
          },
        )

        if (response.result && Array.isArray(response.result)) {
          allProducts.push(...response.result)
        }

        if (response.next) {
          start = response.next
        } else {
          hasMore = false
        }
      }
    } catch (error) {
      logger.error('Inventory', 'Error fetching list', { error })
      return allProducts
    }

  // PROPERTY_102 contains Cloudinary image URLs directly from crm.product.list,
  // so no secondary batch fetch is needed.
  return allProducts.map((product) => {
    const productObj: any = {
      ...product,
      ACTIVE: product.ACTIVE,
      DETAIL_PICTURE: product.DETAIL_PICTURE || null,
      PREVIEW_PICTURE: product.PREVIEW_PICTURE || null,
      PROPERTY_44: normalizeProperty(product.PROPERTY_44),
      PROPERTY_102: normalizeProperty(product.PROPERTY_102),
      PROPERTY_104: normalizeProperty(product.PROPERTY_104),
      PROPERTY_112: normalizeProperty(product.PROPERTY_112),
    }

    const rawDealerPrice = normalizeProperty(product.PROPERTY_116)
    if (isDealer && rawDealerPrice !== undefined && rawDealerPrice !== null) {
      productObj.dealerPrice = Number(rawDealerPrice)
    }

    delete productObj.PROPERTY_116
    return productObj
  })
})
