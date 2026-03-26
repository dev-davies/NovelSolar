export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const id = getRouterParam(event, 'id');
  const baseUrl = config.bitrixWebhook;

  if (!baseUrl) {
    throw createError({ statusCode: 500, statusMessage: 'Bitrix Webhook URL missing in configuration.' });
  }

  try {
    const response = await $fetch<{ result?: any }>(`${baseUrl}crm.product.get?id=${id}`);
    const product = response.result || null;
    
    if (product) {
      const normalizeProperty = (val: any) => {
        if (!val) return null;
        if (Array.isArray(val) && val.length > 0) {
          return val[0].value || val[0];
        }
        return val;
      };

      product.PROPERTY_102 = normalizeProperty(product.PROPERTY_102);
      product.PROPERTY_104 = normalizeProperty(product.PROPERTY_104);
      product.PROPERTY_112 = normalizeProperty(product.PROPERTY_112);
    }
    
    return product;
  } catch (error) {
    console.error('Bitrix API Error:', error);
    throw createError({ statusCode: 404, statusMessage: 'Product not found' });
  }
});
