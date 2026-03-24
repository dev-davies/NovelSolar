/**
 * Resolves a Bitrix24 product image field to an absolute Bitrix URL.
 * This URL is then typically passed to our local /api/bitrix-image proxy.
 */
export function getBitrixImageUrl(imageField: any): string | null {
  if (!imageField) return null;

  let url = '';

  // 1. Handle Object Format (result.DETAIL_PICTURE = { showUrl: "..." })
  if (imageField.showUrl) {
    url = imageField.showUrl;
  } 
  // 2. Handle Property Format (PROPERTY_44 = [ { value: { showUrl: "..." } } ])
  else if (Array.isArray(imageField) && imageField[0]?.value?.showUrl) {
    url = imageField[0].value.showUrl;
  }
  // 3. Handle direct nested value
  else if (imageField.value?.showUrl) {
    url = imageField.value.showUrl;
  }
  // 4. Handle simple string/number (not common for showUrl)
  else if (typeof imageField === 'string' && imageField.startsWith('/')) {
    url = imageField;
  }

  if (!url) return null;

  // Prefix with the portal domain to ensure it's absolute before proxying
  const portalUrl = 'https://nisl.bitrix24.com';
  return url.startsWith('http') ? url : `${portalUrl}${url}`;
}