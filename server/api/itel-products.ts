import { normalizeProperty } from '../utils/normalizeProperty'
import { fetchWithBitrixContext } from '../utils/bitrixAuth'

export default defineEventHandler(async (event) => {

  const query = getQuery(event)
  const brand = (query.brand as string || 'itel').toLowerCase()

  const itelProducts: any[] = [];

  try {
    // ─── PHASE 1: Fetch products matching the dynamic brand (IDs and basic metadata) ───
    const listResponse = await fetchWithBitrixContext<{ result?: any[] }>(event, 'crm.product.list', {
      query: {
        'filter[%NAME]': brand,
        'filter[ACTIVE]': 'Y',
        'select[]': ['ID', 'NAME', 'PRICE', 'QUANTITY', 'CURRENCY_ID', 'SECTION_ID', 'ACTIVE', 'PROPERTY_102', 'PROPERTY_104', 'PROPERTY_112', 'DETAIL_PICTURE', 'PREVIEW_PICTURE', 'PROPERTY_44']
      }
    });
    
    if (listResponse.result && Array.isArray(listResponse.result)) {
      itelProducts.push(...listResponse.result);
    }
  } catch (error) {
    console.error('Bitrix API Error in /api/itel-products list phase:', error);
    return [];
  }

  // ─── Normalize properties and return ───
  // PROPERTY_102 contains Cloudinary image URLs directly from crm.product.list,
  // so no secondary batch fetch is needed.
  return itelProducts.map(product => ({
    ...product,
    ACTIVE: product.ACTIVE,
    DETAIL_PICTURE: product.DETAIL_PICTURE || null,
    PREVIEW_PICTURE: product.PREVIEW_PICTURE || null,
    PROPERTY_44: normalizeProperty(product.PROPERTY_44),
    PROPERTY_102: normalizeProperty(product.PROPERTY_102),
    PROPERTY_104: normalizeProperty(product.PROPERTY_104),
    PROPERTY_112: normalizeProperty(product.PROPERTY_112),
  }));
});
