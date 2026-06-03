import { logger } from '../utils/logger'

import { serverSupabaseUser, serverSupabaseServiceRole } from '#supabase/server'
import { normalizeProperty } from '../utils/normalizeProperty'
import { resolveIsDealerFromEvent } from '../utils/dealerCheck'

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

  const isDealer = await resolveIsDealerFromEvent(event)

  interface MappedProduct {
    ID: string | number
    NAME: string | undefined
    PRICE: string | number | undefined
    imageUrl: string | null
    PROPERTY_102: string | null
    PROPERTY_104: string | null
    PROPERTY_112: string | null
    dealerPrice?: number
    [key: string]: unknown
  }

  let allProducts: BitrixInventoryProduct[] = []

  const storage = useStorage('cache')
  const cacheKey = 'inventory-bitrix-products'
  const cachedData = await storage.getItem<{ data: BitrixInventoryProduct[]; expiresAt: number }>(cacheKey)

  if (cachedData && cachedData.expiresAt > Date.now()) {
    allProducts = cachedData.data
  } else {
    // ─── PHASE 1: Paginate through crm.product.list to get all product metadata ───
    try {
      let start = 0
      let hasMore = true

      // Timeout for the entire fetch loop to prevent indefinite hanging
      const abortController = new AbortController()
      const timeoutId = setTimeout(() => abortController.abort(), 15000) // 15 seconds

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
            signal: abortController.signal,
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
      clearTimeout(timeoutId)

      // Store in cache for 5 minutes
      await storage.setItem(cacheKey, { data: allProducts, expiresAt: Date.now() + 300 * 1000 })
    } catch (error) {
      logger.error('Inventory', 'Error fetching list or timeout reached', { error })
      // Fallback to expired cache if available and fetch failed
      if (cachedData) {
        allProducts = cachedData.data
      } else {
        return []
      }
    }
  }

  // PROPERTY_102 contains Cloudinary image URLs directly from crm.product.list,
  // so no secondary batch fetch is needed.
  return allProducts.map((product) => {
    const productObj: MappedProduct = {
      ...product,
      ID: product.ID as string | number,
      NAME: product.NAME,
      PRICE: product.PRICE,
      ACTIVE: product.ACTIVE,
      DETAIL_PICTURE: product.DETAIL_PICTURE || null,
      PREVIEW_PICTURE: product.PREVIEW_PICTURE || null,
      imageUrl: null, // Will be overridden by client usually or set here if desired
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
