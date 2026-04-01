

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
          select: ["ID", "NAME", "PRICE", "QUANTITY", "CURRENCY_ID", "SECTION_ID", "PROPERTY_102", "PROPERTY_104", "PROPERTY_112", "DETAIL_PICTURE", "PREVIEW_PICTURE", "PROPERTY_44"]
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

  // ─── Normalize properties and return ───
  // PROPERTY_102 contains Cloudinary image URLs directly from crm.product.list,
  // so no secondary batch fetch is needed.
  return allProducts.map(product => ({
    ...product,
    DETAIL_PICTURE: product.DETAIL_PICTURE || null,
    PREVIEW_PICTURE: product.PREVIEW_PICTURE || null,
    PROPERTY_44: normalizeProperty(product.PROPERTY_44),
    PROPERTY_102: normalizeProperty(product.PROPERTY_102),
    PROPERTY_104: normalizeProperty(product.PROPERTY_104),
    PROPERTY_112: normalizeProperty(product.PROPERTY_112),
  }));
});
