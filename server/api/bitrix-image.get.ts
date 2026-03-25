export default defineEventHandler(async (event) => {
  const url = getQuery(event).url as string;
  if (!url) {
    throw createError({ statusCode: 400, statusMessage: 'Missing url parameter' });
  }

  try {
    // 1. Parse productId and fieldName from the incoming Bitrix URL
    // Example URL: .../download.php?productId=640&fieldName=DETAIL_PICTURE...
    const urlObj = new URL(url);
    const productId = urlObj.searchParams.get('productId');
    const rawFieldName = urlObj.searchParams.get('fieldName');

    if (!productId || !rawFieldName) {
      console.warn('Could not parse productId or fieldName from URL:', url);
      throw createError({ statusCode: 400, statusMessage: 'Invalid Bitrix image URL' });
    }

    // 2. Map Bitrix internal names to REST API field names
    const fieldMapping: Record<string, string> = {
      'DETAIL_PICTURE': 'detailPicture',
      'PREVIEW_PICTURE': 'previewPicture',
      'PROPERTY_44': 'property44'
    };

    const fieldName = fieldMapping[rawFieldName] || rawFieldName;

    // 3. Get Webhook URL from environment variables
    const webhookUrl = process.env.BITRIX_WEBHOOK_URL;
    if (!webhookUrl) {
      throw createError({ statusCode: 500, statusMessage: 'Server configuration error: Webhook missing' });
    }

    const formattedWebhookUrl = webhookUrl.endsWith('/') ? webhookUrl : `${webhookUrl}/`;

    // 4. Use the strict catalog.product.download REST API
    const response = await $fetch(`${formattedWebhookUrl}catalog.product.download`, {
      method: 'POST',
      body: {
        fields: {
          productId,
          fieldName
        }
      },
      responseType: 'arrayBuffer'
    });

    // 5. Set headers and return the image buffer
    setHeaders(event, {
      'Content-Type': 'image/jpeg',
      'Cache-Control': 'public, max-age=604800, immutable'
    });

    return response;
  } catch (error: any) {
    console.error('Bitrix REST Image Download Error:', error.data || error.message || error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to download image via Bitrix REST API'
    });
  }
});