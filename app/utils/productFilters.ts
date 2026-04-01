const serviceKeywords = ['audit', 'installation', 'repair', 'maintenance']

export const isServiceProduct = (product: { NAME?: string; name?: string } | null | undefined) => {
  const title = (product?.NAME || product?.name || '').toLowerCase()
  return serviceKeywords.some(keyword => title.includes(keyword))
}

export const excludeServiceProducts = <T extends { NAME?: string; name?: string }>(products: T[] = []) => {
  return products.filter(product => !isServiceProduct(product))
}
