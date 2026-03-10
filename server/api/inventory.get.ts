export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  
  try {
    const response = await $fetch<{ result: any[] }>(`${config.bitrixWebhook}crm.product.list`, {
      method: 'POST',
      body: {
        limit: 8,
        select: ["ID", "NAME", "PRICE", "QUANTITY", "CURRENCY_ID"]
      }
    });

    return response.result;
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return [];
  }
});
