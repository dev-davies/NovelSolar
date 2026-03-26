/**
 * Resolves a Bitrix24 product image field to an absolute Bitrix URL.
 * This URL is then typically passed to our local /api/bitrix-image proxy.
 */
export function getBitrixImageUrl(imageField: any): string | null {
  if (!imageField) return null;

  // 1. If it's already an absolute URL (like Cloudinary), return it directly
  if (typeof imageField === 'string' && imageField.startsWith('http')) {
    return imageField;
  }

  let url = '';

  // 2. Handle Object Format (result.DETAIL_PICTURE = { showUrl: "..." })
  if (typeof imageField === 'object' && imageField !== null && imageField.showUrl) {
    url = imageField.showUrl;
  } 
  // 3. Handle Property Format (PROPERTY_44 = [ { value: { showUrl: "..." } } ])
  // 3a. Handle direct value (PROPERTY_102 = [ { value: "https://..." } ])
  else if (Array.isArray(imageField) && imageField.length > 0) {
    const first = imageField[0];
    if (first?.value?.showUrl) {
      url = first.value.showUrl;
    } else if (typeof first?.value === 'string') {
      url = first.value;
    } else if (typeof first === 'string') {
      url = first;
    }
  }
  // 4. Handle direct nested value
  else if (typeof imageField === 'object' && imageField !== null && imageField.value?.showUrl) {
    url = imageField.value.showUrl;
  }
  // 5. Case for direct string from Cloudinary stored in an object
  else if (typeof imageField === 'object' && imageField !== null && typeof imageField.value === 'string') {
    url = imageField.value;
  }
  // 6. Handle simple string (relative path or direct URL)
  else if (typeof imageField === 'string') {
    url = imageField;
  }


  if (!url) return null;

  // Prefix with the portal domain to ensure it's absolute before proxying
  const portalUrl = 'https://nisl.bitrix24.com';
  return url.startsWith('http') ? url : `${portalUrl}${url}`;
}