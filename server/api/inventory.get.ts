export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  
  const allProducts: any[] = [];

  try {
    let start = 0;
    let hasMore = true;

    while (hasMore) {
      const url = start > 0 
        ? `${config.bitrixWebhook}crm.product.list?start=${start}`
        : `${config.bitrixWebhook}crm.product.list`;

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

    return allProducts;
  } catch (error) {
    console.error('Error fetching inventory batch:', error);
    // Gracefully return whatever products we successfully retrieved so far
    return allProducts;
  }
});
