export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { productId, productName } = body;
  const config = useRuntimeConfig();

  // Security check handled by admin-auth server middleware

  if (!productId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Product ID is required',
    });
  }

  try {
    const bitrixUrl = config.bitrixWebhookUrl;
    if (!bitrixUrl) {
      throw createError({ statusCode: 500, statusMessage: 'Bitrix not configured' });
    }

    const formattedBitrixUrl = (bitrixUrl as string).endsWith('/') ? bitrixUrl : `${bitrixUrl}/`;

    // Delete product from Bitrix
    const deleteResponse = await $fetch<{ result: boolean }>(
      `${formattedBitrixUrl}crm.product.delete`,
      {
        method: 'POST',
        body: {
          id: productId,
        },
      }
    );

    if (!deleteResponse.result) {
      throw new Error('Delete failed in Bitrix');
    }

    console.log(`[DELETE] Product ${productId} (${productName}) deleted successfully`);

    return {
      success: true,
      message: `Product "${productName}" has been permanently deleted`,
      productId,
    };
  } catch (error) {
    console.error('[DELETE] Error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: error instanceof Error ? error.message : 'Failed to delete product',
    });
  }
});
