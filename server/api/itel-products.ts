

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  // Normalize the webhook URL: ensure it doesn't end with a trailing slash to prevent double-slashes
  const baseUrl = config.bitrixWebhook.replace(/\/$/, '') + '/';
  
  if (!baseUrl) {
    console.error('Bitrix Webhook URL is missing from runtime config.');
    throw createError({ 
      statusCode: 500, 
      statusMessage: 'Server configuration error: Bitrix Webhook URL is missing.' 
    })
  }

  const query = getQuery(event)
  const brand = (query.brand as string || 'itel').toLowerCase()

  const itelProducts: any[] = [];

  try {
    // ─── PHASE 1: Fetch products matching the dynamic brand (IDs and basic metadata) ───
    const listResponse = await $fetch<{ result?: any[] }>(`${baseUrl}crm.product.list`, {
      query: {
        'filter[%NAME]': brand,
        'select[]': ['ID', 'NAME', 'PRICE', 'QUANTITY', 'CURRENCY_ID', 'SECTION_ID', 'PROPERTY_102', 'PROPERTY_104', 'PROPERTY_112', 'DETAIL_PICTURE', 'PREVIEW_PICTURE', 'PROPERTY_44']
      }
    });
    
    if (listResponse.result && Array.isArray(listResponse.result)) {
      itelProducts.push(...listResponse.result);
    }
  } catch (error) {
    console.error('Bitrix API Error in /api/itel-products list phase:', error);
    return [];
  }

  // ─── Normalize properties and return ───
  // PROPERTY_102 contains Cloudinary image URLs directly from crm.product.list,
  // so no secondary batch fetch is needed.
  return itelProducts.map(product => ({
    ...product,
    DETAIL_PICTURE: product.DETAIL_PICTURE || null,
    PREVIEW_PICTURE: product.PREVIEW_PICTURE || null,
    PROPERTY_44: normalizeProperty(product.PROPERTY_44),
    PROPERTY_102: normalizeProperty(product.PROPERTY_102),
    PROPERTY_104: normalizeProperty(product.PROPERTY_104),
    PROPERTY_112: normalizeProperty(product.PROPERTY_112),
  }));
});
