export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const query = getQuery(event);
  const rawUrl = query.url as string;

  if (!rawUrl) {
    throw createError({ statusCode: 400, statusMessage: 'Missing Bitrix URL parameter' });
  }

  try {
    // 1. Parse incoming url to extract IDs
    const urlParts = new URL(rawUrl);
    const productIdRaw = urlParts.searchParams.get('productId');
    const fieldNameRaw = urlParts.searchParams.get('fieldName');
    const fileIdRaw = urlParts.searchParams.get('fileId');

    if (!productIdRaw || !fieldNameRaw || !fileIdRaw) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid Bitrix URL format' });
    }

    // 2. Transform fieldName to camelCase (DETAIL_PICTURE -> detailPicture, PROPERTY_44 -> morePhoto)
    let fieldName = fieldNameRaw;
    if (fieldNameRaw === 'DETAIL_PICTURE') {
      fieldName = 'detailPicture';
    } else if (fieldNameRaw === 'PREVIEW_PICTURE') {
      fieldName = 'previewPicture';
    } else if (fieldNameRaw === 'PROPERTY_44') {
      fieldName = 'morePhoto';
    } else if (fieldNameRaw.includes('_')) {
      // General fallback for other snake_case fields
      fieldName = fieldNameRaw.toLowerCase().replace(/_([a-z])/g, (g) => g[1].toUpperCase());
    }

    // 3. Strictly parse as integers (Bitrix rejects strings for these fields)
    const productId = parseInt(productIdRaw, 10);
    const fileId = parseInt(fileIdRaw, 10);

    // 4. Normalize base webhook URL and append endpoint
    const baseUrl = config.bitrixWebhook.replace(/\/$/, '') + '/';
    const bitrixApiUrl = `${baseUrl}catalog.product.download`;

    // 5. POST request with FORM DATA (Bitrix Cloud REST often prefers this for fields)
    const formData = new URLSearchParams();
    formData.append('fields[productId]', productId.toString());
    formData.append('fields[fileId]', fileId.toString());
    formData.append('fields[fieldName]', fieldName);

    const response = await $fetch(bitrixApiUrl, {
      method: 'POST',
      body: formData,
      responseType: 'arrayBuffer'
    });

    // 6. Set proxy headers
    setHeaders(event, {
      'Content-Type': 'image/jpeg',
      'Cache-Control': 'public, max-age=604800, immutable',
      'Access-Control-Allow-Origin': '*'
    });

    return response;
  } catch (error: any) {
    let errorString = error.message;
    
    // Bitrix errors are returned in binary when responseType is arrayBuffer
    if (error.data) {
      try {
        errorString = Buffer.from(error.data).toString('utf-8');
      } catch (e) {
        errorString = `Binary error (status ${error.response?.status})`;
      }
    }
    
    console.error('Detailed Bitrix Rejection:', errorString);
    
    throw createError({ 
      statusCode: 502, 
      statusMessage: `Failed to fetch image from Bitrix: ${errorString}` 
    });
  }
});
