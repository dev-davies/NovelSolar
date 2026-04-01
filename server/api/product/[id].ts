

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const id = getRouterParam(event, 'id');
  const webhookUrl = config.bitrixWebhookUrl;

  if (!webhookUrl) {
    throw createError({ statusCode: 500, statusMessage: 'Bitrix Webhook URL missing in configuration.' });
  }

  const normalizedBitrixUrl = webhookUrl.endsWith('/') ? webhookUrl : `${webhookUrl}/`;

  try {
    const response = await $fetch<{ result?: any }>(`${normalizedBitrixUrl}crm.product.get?id=${id}`);
    const product = response.result || null;
    
    if (product) {
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
