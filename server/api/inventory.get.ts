export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  
  // Normalize the webhook URL: ensure it doesn't end with a trailing slash to prevent double-slashes
  const baseUrl = config.bitrixWebhook.replace(/\/$/, '') + '/';
  
  const allProducts: any[] = [];

  // ─── PHASE 1: Paginate through crm.product.list to get all product metadata ───
  try {
    let start = 0;
    let hasMore = true;

    while (hasMore) {
      const url = `${baseUrl}crm.product.list${start > 0 ? `?start=${start}` : ''}`;

      const response = await $fetch<{ result: any[], next?: number }>(url, {
        method: 'POST',
        body: {
          limit: 50,
          select: ["ID", "NAME", "PRICE", "QUANTITY", "CURRENCY_ID", "SECTION_ID"]
        }
      });

      if (response.result && Array.isArray(response.result)) {
        allProducts.push(...response.result);
      }

      if (response.next) {
        start = response.next;
      } else {
        hasMore = false;
      }
    }
  } catch (error) {
    console.error('Error fetching inventory list:', error);
    return allProducts;
  }

  if (allProducts.length === 0) return [];

  // ─── PHASE 2: Batch-fetch full product detail (with images) in chunks of 50 ───
  // Bitrix24 batch API allows up to 50 calls per request
  const BATCH_SIZE = 50;
  const imageMap: Record<string, { DETAIL_PICTURE?: any; PREVIEW_PICTURE?: any; PROPERTY_44?: any }> = {};

  try {
    for (let i = 0; i < allProducts.length; i += BATCH_SIZE) {
      const chunk = allProducts.slice(i, i + BATCH_SIZE);

      // Build the batch cmd object: { "p_123": "crm.product.get?id=123", ... }
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
        console.warn('[BATCH] Some products failed to fetch details:', errors);
      }

      for (const [key, productDetail] of Object.entries(results)) {
        const id = key.replace('p_', '');
        imageMap[id] = {
          DETAIL_PICTURE: productDetail?.DETAIL_PICTURE ?? null,
          PREVIEW_PICTURE: productDetail?.PREVIEW_PICTURE ?? null,
          // PROPERTY_44 is the "More Photo" custom property — the actual image store
          PROPERTY_44: productDetail?.PROPERTY_44 ?? null,
        };
      }
    }
  } catch (error) {
    // If batch fails, return list without images rather than crashing
    console.error('Error batch-fetching product images:', error);
    return allProducts;
  }

  // ─── PHASE 3: Merge image data back onto product list ───
  return allProducts.map(product => ({
    ...product,
    DETAIL_PICTURE: imageMap[product.ID]?.DETAIL_PICTURE ?? null,
    PREVIEW_PICTURE: imageMap[product.ID]?.PREVIEW_PICTURE ?? null,
    PROPERTY_44: imageMap[product.ID]?.PROPERTY_44 ?? null,
  }));
});
