export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const id = getRouterParam(event, 'id');
  const baseUrl = config.bitrixWebhook;

  if (!baseUrl) {
    throw createError({ statusCode: 500, statusMessage: 'Bitrix Webhook URL missing in configuration.' });
  }

  try {
    const response = await $fetch(`${baseUrl}crm.product.get?id=${id}`);
    return response.result || null;
  } catch (error) {
    console.error('Bitrix API Error:', error);
    throw createError({ statusCode: 404, statusMessage: 'Product not found' });
  }
});
