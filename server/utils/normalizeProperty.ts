/**
 * Normalize Bitrix custom properties that come back as arrays
 * Bitrix returns custom properties (PROPERTY_*) as arrays: [{ value: "..." }]
 * This extracts the actual value from that structure
 */
export function normalizeProperty(val: any): any {
  if (!val) return null;
  if (Array.isArray(val)) {
    if (val.length === 0) return null;
    const firstItem = val[0];
    if (firstItem === null || firstItem === undefined) return null;
    return firstItem.value ?? firstItem ?? null;
  }
  return val;
}
