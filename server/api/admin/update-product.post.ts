export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { productId, productName, productPrice, productDescription, productSpecs } = body;
  const config = useRuntimeConfig();

  // Security check handled by admin-auth server middleware

  if (!productId || !productName || !productPrice) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields: ID, Name, Price',
    });
  }

  try {
    const bitrixUrl = config.bitrixWebhookUrl;
    if (!bitrixUrl) {
      throw createError({ statusCode: 500, statusMessage: 'Bitrix not configured' });
    }

    const formattedBitrixUrl = (bitrixUrl as string).endsWith('/') ? bitrixUrl : `${bitrixUrl}/`;

    // Update product in Bitrix
    const updateResponse = await $fetch<{ result: any }>(
      `${formattedBitrixUrl}crm.product.update`,
      {
        method: 'POST',
        body: {
          id: productId,
          fields: {
            NAME: productName,
            PRICE: productPrice,
            DESCRIPTION: productDescription || '',
            DESCRIPTION_TYPE: 'html',
            PROPERTY_104: productSpecs ? JSON.stringify(productSpecs) : '[]',
          },
        },
      }
    );

    if (!updateResponse.result) {
      throw new Error('Update failed in Bitrix');
    }

    return {
      success: true,
      message: `Product "${productName}" updated successfully`,
      productId: updateResponse.result,
    };
  } catch (error) {
    console.error('[UPDATE] Error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: error instanceof Error ? error.message : 'Failed to update product',
    });
  }
});
