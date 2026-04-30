import { normalizeProperty } from '../../utils/normalizeProperty'

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { query, start } = body;
  const config = useRuntimeConfig();
  const nextStart = start || 0;

  // Security check handled by admin-auth server middleware
  const searchQuery = query?.trim() || '';

  try {
    const bitrixUrl = config.bitrixWebhookUrl;
    if (!bitrixUrl) {
      throw createError({ statusCode: 500, statusMessage: 'Bitrix not configured' });
    }

    const formattedBitrixUrl = (bitrixUrl as string).endsWith('/') ? bitrixUrl : `${bitrixUrl}/`;

    // Search products (all if query is empty)
    const response = await $fetch<any>(
      `${formattedBitrixUrl}crm.product.list`,
      {
        method: 'POST',
        body: {
          filter: searchQuery ? { '%NAME': searchQuery } : {}, 
          select: ['ID', 'NAME', 'PRICE', 'DESCRIPTION', 'DESCRIPTION_TYPE', 'MEASURE', 'ACTIVE', 'PROPERTY_102', 'PROPERTY_104', 'PROPERTY_112', 'PROPERTY_44', 'CURRENCY_ID', 'DETAIL_PICTURE', 'PREVIEW_PICTURE'],
          limit: 50,
          start: nextStart,
          order: { ID: 'DESC' },
        },
      }
    );

    // Provide the "bulletproof" Bitrix error catch 
    if (response.error) {
      console.error("Bitrix API Error:", response.error_description);
      throw new Error(response.error_description);
    }

    // Safely result mapping with fallback for images
    const products = (response.result || []).map((p: any) => {
      const cloudinaryUrl = normalizeProperty(p.PROPERTY_102);
      const legacyImageId = p.DETAIL_PICTURE || p.PREVIEW_PICTURE || normalizeProperty(p.PROPERTY_44);

      return {
        id: p.ID,
        name: p.NAME,
        price: p.PRICE,
        currency: p.CURRENCY_ID || 'NGN',
        description: p.DESCRIPTION,
        descriptionType: p.DESCRIPTION_TYPE,
        measure: p.MEASURE,
        isDisabled: p.ACTIVE === 'N',
        persistedMainImageUrl: cloudinaryUrl || '',
        // Priority 1: Cloudinary URL (PROPERTY_102), Priority 2: Bitrix Image Proxy
        imageUrl: cloudinaryUrl || (legacyImageId ? `/api/bitrix-image?url=${encodeURIComponent(`https://nisl.bitrix24.com/bitrix/admin/crm_product_show.php?ID=${p.ID}&fieldName=DETAIL_PICTURE`)}` : null),
        specs: typeof p.PROPERTY_104 === 'string' 
          ? JSON.parse(p.PROPERTY_104) 
          : (normalizeProperty(p.PROPERTY_104) || []),
        gallery: typeof p.PROPERTY_112 === 'string' 
          ? JSON.parse(p.PROPERTY_112) 
          : (normalizeProperty(p.PROPERTY_112) || []),
      };
    });

    return {
      success: true,
      products,
      next: response.next || null,
      total: response.total || 0,
      count: products.length,
    };
  } catch (error: any) {
    console.error('Search Route Error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to search Bitrix database.',
    });
  }
});
