export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { productId, productName, adminPasscode } = body;
  const config = useRuntimeConfig();

  // Security: Validate Admin Passcode
  const actualPasscode = process.env.ADMIN_UPLOAD_PASSCODE;
  if (!adminPasscode || adminPasscode !== actualPasscode) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: Invalid Passcode',
    });
  }

  if (!productId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Product ID is required',
    });
  }

  try {
    const bitrixUrl = config.bitrixWebhookUrl || config.public.bitrixWebhookUrl || config.bitrixWebhook;
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
