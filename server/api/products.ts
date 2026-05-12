import { logger } from '../utils/logger'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const searchTerm = ((query.q as string) || '').trim().toLowerCase()
  const brandFilter = ((query.brand as string) || '').trim()
  const parsedStart = Number.parseInt((query.start as string) || '0', 10)
  const startFrom = Number.isFinite(parsedStart) && parsedStart > 0 ? parsedStart : 0
  const PAGE_SIZE = 50

  try {
    // Build filter: brand + search (if provided) or all products
    const filters: Record<string, string> = {}
    filters.ACTIVE = 'Y'
    if (brandFilter && searchTerm) {
      filters['%NAME'] = `${brandFilter} ${searchTerm}`.trim()
    } else if (brandFilter) {
      filters['%NAME'] = brandFilter
    } else if (searchTerm) {
      filters['?NAME'] = searchTerm
    }

    interface BitrixProduct {
      ID?: string | number
      NAME?: string
      PRICE?: string | number
      CURRENCY_ID?: string
      DESCRIPTION?: unknown
      QUANTITY?: string | number
      ACTIVE?: string
      PROPERTY_102?: unknown
      PROPERTY_104?: unknown
      PROPERTY_112?: unknown
      PROPERTY_44?: unknown
      PREVIEW_PICTURE?: unknown
      DETAIL_PICTURE?: unknown
      [key: string]: unknown
    }

    const response = await fetchWithBitrixContext<{
      result?: BitrixProduct[] | { products?: BitrixProduct[] }
      total?: number
      next?: number
      error?: string
      error_description?: string
    }>(event, 'crm.product.list', {
      method: 'POST',
      body: {
        filter: filters,
        select: [
          'ID',
          'NAME',
          'PRICE',
          'CURRENCY_ID',
          'DESCRIPTION',
          'QUANTITY',
          'ACTIVE',
          'PREVIEW_PICTURE',
          'DETAIL_PICTURE',
          'PROPERTY_44',
          'PROPERTY_102',
          'PROPERTY_104',
          'PROPERTY_112',
        ],
        order: { ID: 'DESC' },
        start: startFrom,
        limit: PAGE_SIZE,
      },
    })

    if (response?.error) {
      throw new Error(response.error_description || response.error)
    }

    const bitrixProducts = Array.isArray(response?.result)
      ? response.result
      : Array.isArray(response?.result?.products)
        ? response.result.products
        : []

    if (bitrixProducts.length === 0) {
      logger.warn('Products', 'No products returned from Bitrix')
      return {
        products: [],
        next: null,
        total: response?.total || 0,
        count: 0,
      }
    }

    const products = bitrixProducts.map((product: BitrixProduct) => {
      let imageUrl = null

      // Image fallback chain: Cloudinary -> Bitrix legacy -> proxy -> placeholder
      const cloudinaryUrl = normalizeProperty(product.PROPERTY_102)
      if (cloudinaryUrl) {
        imageUrl = cloudinaryUrl
      } else {
        const bitrixImage =
          normalizeProperty(product.PROPERTY_44) ||
          normalizeProperty(product.PREVIEW_PICTURE) ||
          normalizeProperty(product.DETAIL_PICTURE)

        if (bitrixImage) {
          imageUrl = `/api/bitrix-image?url=${encodeURIComponent(bitrixImage)}`
        }
      }

      return {
        ID: product.ID,
        NAME: product.NAME,
        PRICE: product.PRICE,
        CURRENCY_ID: product.CURRENCY_ID,
        DESCRIPTION: normalizeProperty(product.DESCRIPTION) || '',
        QUANTITY: product.QUANTITY,
        ACTIVE: product.ACTIVE,
        imageUrl: imageUrl || '/images/placeholder.png',
        PROPERTY_102: normalizeProperty(product.PROPERTY_102), // Cloudinary URL
        PROPERTY_104: normalizeProperty(product.PROPERTY_104), // Specs
        PROPERTY_112: normalizeProperty(product.PROPERTY_112), // Gallery
      }
    })

    const nextStart =
      typeof response?.next === 'number'
        ? response.next
        : startFrom + PAGE_SIZE < (response?.total || 0)
          ? startFrom + PAGE_SIZE
          : null

    return {
      products,
      next: nextStart,
      total: response?.total || 0,
      count: products.length,
    }
  } catch (error) {
    logger.error('Products', 'API error', { error })
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch products',
    })
  }
})
