/**
 * Normalize Bitrix custom properties that come back as arrays
 * Bitrix returns custom properties (PROPERTY_*) as arrays: [{ value: "..." }]
 * This extracts the actual value from that structure
 */
export function normalizeProperty(val: any): any {
  if (!val) return null;
  if (Array.isArray(val) && val.length > 0) {
    return val[0].value || val[0];
  }
  return val;
}
