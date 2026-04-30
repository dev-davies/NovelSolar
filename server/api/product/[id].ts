import { normalizeProperty } from '../../utils/normalizeProperty'
import { fetchWithBitrixContext } from '../../utils/bitrixAuth'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');

  try {
    const response = await fetchWithBitrixContext<{ result?: any }>(event, `crm.product.get?id=${id}`);
    const product = response.result || null;
    
    if (product) {
      if (product.ACTIVE === 'N') {
        throw createError({ statusCode: 404, statusMessage: 'Product not found' });
      }

      product.PROPERTY_102 = normalizeProperty(product.PROPERTY_102);
      product.PROPERTY_104 = normalizeProperty(product.PROPERTY_104);
      product.PROPERTY_112 = normalizeProperty(product.PROPERTY_112);
    }
    
    return product;
  } catch (error) {
    console.error('Bitrix API Error:', error);
    throw createError({ statusCode: 404, statusMessage: 'Product not found' });
  }
});
