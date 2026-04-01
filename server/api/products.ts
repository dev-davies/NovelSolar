
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const webhookUrl = config.bitrixWebhookUrl
  if (!webhookUrl) {
    console.error('BITRIX_WEBHOOK_URL not configured')
    throw createError({ statusCode: 500, statusMessage: 'Server configuration error' })
  }
  const normalizedBitrixUrl = webhookUrl.endsWith('/') ? webhookUrl : `${webhookUrl}/`

  const query = getQuery(event)
  const searchTerm = (query.q as string || '').trim().toLowerCase()
  const brandFilter = (query.brand as string || '').trim()
  const startFrom = parseInt((query.start as string) || '0')

  try {
    // Build filter: brand OR search OR all
    let filters: Record<string, any> = { '>0': 'ID' }

    if (brandFilter) {
      filters = { PROPERTY_102: brandFilter }
    } else if (searchTerm) {
      filters = {
        '?NAME': searchTerm,
      }
    }

    const params = new URLSearchParams({
      order: { ID: 'DESC' },
      select: ['ID', 'NAME', 'PRICE', 'CURRENCY_ID', 'DESCRIPTION', 'QUANTITY', 'PREVIEW_PICTURE', 'DETAIL_PICTURE', 'PROPERTY_44', 'PROPERTY_102', 'PROPERTY_104', 'PROPERTY_112'],
      start: startFrom.toString(),
    })

    const response = await $fetch(`${normalizedBitrixUrl}crm.product.list`, {
      method: 'GET',
      query: params as Record<string, string>,
    })

    if (!response?.result?.products) {
      console.warn('No products returned from Bitrix')
      return {
        products: [],
        next: null,
        total: response?.total || 0,
        count: 0,
      }
    }

    const products = response.result.products.map((product: any) => {
      let imageUrl = null

      // Image fallback chain: Cloudinary → Bitrix legacy → proxy → placeholder
      const cloudinaryUrl = normalizeProperty(product.PROPERTY_102)
      if (cloudinaryUrl) {
        imageUrl = cloudinaryUrl
      } else {
        const bitrixImage = normalizeProperty(product.PROPERTY_44) || 
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
        imageUrl: imageUrl || '/placeholder-product.png',
        PROPERTY_102: normalizeProperty(product.PROPERTY_102), // Cloudinary URL
        PROPERTY_104: normalizeProperty(product.PROPERTY_104), // Specs
        PROPERTY_112: normalizeProperty(product.PROPERTY_112), // Gallery
      }
    })

    const nextStart = startFrom + 50 < (response?.total || 0) ? startFrom + 50 : null

    return {
      products,
      next: nextStart,
      total: response?.total || 0,
      count: products.length,
    }
  } catch (error) {
    console.error('Products API error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch products',
    })
  }
})
