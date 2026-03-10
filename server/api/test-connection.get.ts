export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  
  try {
    const response = await $fetch(`${config.bitrixWebhook}crm.product.list`, {
      method: 'POST',
      body: {
        limit: 5,
        select: ["ID", "NAME", "PRICE", "QUANTITY", "CURRENCY_ID"]
      }
    });

    return {
      success: true,
      products: response.result
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to connect to Bitrix24'
    };
  }
});
