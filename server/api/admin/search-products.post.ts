export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { query } = body;
  const config = useRuntimeConfig();

  // Security check handled by admin-auth server middleware

  if (!query || query.trim().length < 2) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Search query must be at least 2 characters',
    });
  }

  try {
    const bitrixUrl = config.bitrixWebhookUrl || config.public.bitrixWebhookUrl || config.bitrixWebhook;
    if (!bitrixUrl) {
      throw createError({ statusCode: 500, statusMessage: 'Bitrix not configured' });
    }

    const formattedBitrixUrl = (bitrixUrl as string).endsWith('/') ? bitrixUrl : `${bitrixUrl}/`;

    // Search products by name (partial match)
    const response = await $fetch<{ result: any[] }>(
      `${formattedBitrixUrl}crm.product.list`,
      {
        method: 'POST',
        body: {
          filter: { '%NAME': query }, // % for partial matching
          select: ['ID', 'NAME', 'PRICE', 'DESCRIPTION', 'DESCRIPTION_TYPE', 'MEASURE', 'PROPERTY_102', 'PROPERTY_104', 'PROPERTY_112', 'CURRENCY_ID'],
          limit: 50,
          order: { NAME: 'ASC' },
        },
      }
    );

    const products = response.result || [];

    return {
      success: true,
      products: products.map((p: any) => ({
        id: p.ID,
        name: p.NAME,
        price: p.PRICE,
        currency: p.CURRENCY_ID || 'NGN',
        description: p.DESCRIPTION,
        descriptionType: p.DESCRIPTION_TYPE,
        measure: p.MEASURE,
        imageUrl: p.PROPERTY_102,
        specs: p.PROPERTY_104 ? JSON.parse(p.PROPERTY_104) : [],
        gallery: p.PROPERTY_112 ? JSON.parse(p.PROPERTY_112) : [],
      })),
      count: products.length,
    };
  } catch (error) {
    console.error('[SEARCH] Error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to search products',
    });
  }
});
