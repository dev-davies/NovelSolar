export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  // Using the key defined in nuxt.config.ts
  const baseUrl = config.bitrixWebhook;
  
  if (!baseUrl) {
    console.error('Bitrix Webhook URL is missing from runtime config.');
    throw createError({ 
      statusCode: 500, 
      statusMessage: 'Server configuration error: Bitrix Webhook URL is missing.' 
    })
  }

  try {
    // Fetch only itel products directly from Bitrix
    // The % symbol in [%NAME] is a Bitrix wildcard filter (contains)
    const response = await $fetch(`${baseUrl}crm.product.list`, {
      query: {
        'filter[%NAME]': 'itel'
      }
    });
    
    // Bitrix returns results in a .result array
    return response.result || [];
  } catch (error) {
    console.error('Bitrix API Error in /api/itel-products:', error);
    return [];
  }
});
