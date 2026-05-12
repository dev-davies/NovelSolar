import { logger } from '../../utils/logger'

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
    logger.error('Product', 'Bitrix API error', { error });
    throw createError({ statusCode: 404, statusMessage: 'Product not found' });
  }
});
