export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const query = getQuery(event);
  
  if (!query.id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Product ID is required',
    });
  }

  try {
    const response = await $fetch<{ result: any }>(`${config.bitrixWebhook}crm.product.get`, {
      method: 'POST',
      body: {
        id: query.id,
        select: ["ID", "NAME", "PRICE", "CURRENCY_ID", "QUANTITY", "DETAIL_PICTURE", "PREVIEW_PICTURE", "DESCRIPTION"]
      }
    });

    return response.result;
  } catch (error) {
    console.error(`Error fetching product ${query.id}:`, error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch product from CRM',
    });
  }
});
