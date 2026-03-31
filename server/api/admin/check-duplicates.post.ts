export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { productNames, adminPasscode } = body;
  const config = useRuntimeConfig();

  // Security: Validate Admin Passcode
  const actualPasscode = process.env.ADMIN_UPLOAD_PASSCODE;
  if (!adminPasscode || adminPasscode !== actualPasscode) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: Invalid Passcode',
    });
  }

  if (!productNames || productNames.length === 0) {
    return { duplicates: [] };
  }

  try {
    const bitrixUrl = config.bitrixWebhookUrl || config.public.bitrixWebhookUrl || config.bitrixWebhook;
    if (!bitrixUrl) {
      console.warn('[DUPLICATE CHECK] Bitrix URL not configured');
      return { duplicates: [] };
    }

    const formattedBitrixUrl = (bitrixUrl as string).endsWith('/') ? bitrixUrl : `${bitrixUrl}/`;

    // Query Bitrix CRM for products matching any of the provided names
    const duplicates: string[] = [];

    for (const name of productNames) {
      try {
        const response = await $fetch<{ result: any[] }>(
          `${formattedBitrixUrl}crm.product.list`,
          {
            method: 'POST',
            body: {
              filter: { NAME: name },
              select: ['ID', 'NAME'],
              limit: 1,
            },
          }
        );

        if (response.result && response.result.length > 0) {
          duplicates.push(name);
        }
      } catch (error) {
        console.error(`[DUPLICATE CHECK] Error checking product "${name}":`, error);
        // Continue checking other products even if one fails
      }
    }

    return {
      duplicates,
      count: duplicates.length,
      message:
        duplicates.length > 0
          ? `Found ${duplicates.length} duplicate(s): ${duplicates.join(', ')}`
          : 'No duplicates found',
    };
  } catch (error) {
    console.error('[DUPLICATE CHECK] Error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to check for duplicates',
    });
  }
});
