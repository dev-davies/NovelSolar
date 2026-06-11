/**
 * Normalize Bitrix custom properties that come back as arrays
 * Bitrix returns custom properties (PROPERTY_*) as arrays: [{ value: "..." }]
 * This extracts the actual value from that structure
 */
export function normalizeProperty(val: any): any {
  if (!val) return null
  if (Array.isArray(val)) {
    if (val.length === 0) return null
    const firstItem = val[0]
    if (firstItem === null || firstItem === undefined) return null
    return firstItem.value ?? firstItem ?? null
  }
  if (typeof val === 'object' && val !== null) {
    if ('value' in val) {
      return val.value ?? null
    }
    // Handle Bitrix objects with numerical/random keys e.g., { "1234": "150000" }
    const values = Object.values(val)
    if (values.length > 0) {
      const firstVal = values[0]
      if (firstVal && typeof firstVal === 'object' && 'value' in firstVal) {
        return firstVal.value ?? null
      }
      return firstVal ?? null
    }
    return null
  }
  return val
}
