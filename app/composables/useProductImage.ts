export function useProductImage() {
  /**
   * Get the best available product image URL with fallback chain:
   * 1. Cloudinary URL (PROPERTY_102) - preferred, clean URLs
   * 2. Bitrix legacy fields (PROPERTY_44, PREVIEW_PICTURE, DETAIL_PICTURE) - legacy support
   * 3. Placeholder image - fallback
   */
  const getProductImage = (product: any): string => {
    if (!product) return '/images/placeholder.png';

    // 1. Look for our new Cloudinary slot
    const cloudinaryField = product.PROPERTY_102;
    if (cloudinaryField) {
      // Bitrix often returns custom strings inside an array of objects
      if (Array.isArray(cloudinaryField) && cloudinaryField.length > 0) {
        return cloudinaryField[0].value;
      }
      // Just in case it returns it as a direct string
      if (typeof cloudinaryField === 'string') {
        return cloudinaryField;
      }
    }

    // 2. Fallback to older Bitrix image proxy logic
    const legacyField = product.PROPERTY_44 || product.PREVIEW_PICTURE || product.DETAIL_PICTURE;
    if (legacyField) {
      const relativeUrl = legacyField.showUrl || legacyField.downloadUrl;
      if (relativeUrl) {
        const fullBitrixUrl = `https://nisl.bitrix24.com${relativeUrl}`;
        return `/api/bitrix-image?url=${encodeURIComponent(fullBitrixUrl)}`;
      }
      if (typeof legacyField === 'string' && legacyField.startsWith('http')) {
        return legacyField;
      }
    }

    // 3. Fallback if no picture is available
    return '/images/placeholder.png';
  };

  return { getProductImage };
}
