

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
        'select[]': ['ID', 'NAME', 'PRICE', 'QUANTITY', 'CURRENCY_ID', 'SECTION_ID', 'PROPERTY_102', 'PROPERTY_104', 'PROPERTY_112']
      }
    });
    
    if (listResponse.result && Array.isArray(listResponse.result)) {
      itelProducts.push(...listResponse.result);
    }
  } catch (error) {
    console.error('Bitrix API Error in /api/itel-products list phase:', error);
    return [];
  }

  if (itelProducts.length === 0) return [];

  // ─── PHASE 2: Batch-fetch full product detail (with images) in chunks of 50 ───
  const BATCH_SIZE = 50;
  const imageMap: Record<string, { DETAIL_PICTURE?: any; PREVIEW_PICTURE?: any; PROPERTY_44?: any; PROPERTY_102?: any; PROPERTY_104?: any; PROPERTY_112?: any }> = {};

  try {
    for (let i = 0; i < itelProducts.length; i += BATCH_SIZE) {
      const chunk = itelProducts.slice(i, i + BATCH_SIZE);
      const cmd: Record<string, string> = {};
      
      for (const product of chunk) {
        cmd[`p_${product.ID}`] = `crm.product.get?id=${product.ID}`;
      }

      const batchResponse = await $fetch<{
        result: {
          result: Record<string, any>;
          result_error: Record<string, any>;
        }
      }>(`${baseUrl}batch`, {
        method: 'POST',
        body: { halt: 0, cmd }
      });

      const results = batchResponse?.result?.result ?? {};
      const errors = batchResponse?.result?.result_error ?? {};

      if (Object.keys(errors).length > 0) {
        console.warn('[BATCH itel] Some products failed to fetch details:', errors);
      }

      for (const [key, productDetail] of Object.entries(results)) {
        const id = key.replace('p_', '');
        imageMap[id] = {
          DETAIL_PICTURE: productDetail?.DETAIL_PICTURE ?? null,
          PREVIEW_PICTURE: productDetail?.PREVIEW_PICTURE ?? null,
          PROPERTY_44: productDetail?.PROPERTY_44 ?? null,
          PROPERTY_102: productDetail?.PROPERTY_102 ?? null,
          PROPERTY_104: productDetail?.PROPERTY_104 ?? null,
          PROPERTY_112: productDetail?.PROPERTY_112 ?? null,
        };
      }
    }
  } catch (error) {
    console.error('Error batch-fetching itel product images:', error);
    return itelProducts;
  }

  // ─── PHASE 3: Merge image data back onto itel product list ───
  return itelProducts.map(product => {
    const p = {
      ...product,
      DETAIL_PICTURE: imageMap[product.ID]?.DETAIL_PICTURE ?? null,
      PREVIEW_PICTURE: imageMap[product.ID]?.PREVIEW_PICTURE ?? null,
      PROPERTY_44: imageMap[product.ID]?.PROPERTY_44 ?? null,
      PROPERTY_102: normalizeProperty(imageMap[product.ID]?.PROPERTY_102 ?? product.PROPERTY_102),
      PROPERTY_104: normalizeProperty(imageMap[product.ID]?.PROPERTY_104 ?? product.PROPERTY_104),
      PROPERTY_112: normalizeProperty(imageMap[product.ID]?.PROPERTY_112 ?? product.PROPERTY_112),
    };
    return p;
  });
});
