// Utility to escape potentially dangerous HTML characters
const escapeHtml = (unsafe: string) => {
  if (typeof unsafe !== 'string') return unsafe;
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

/**
 * Recursively deep-sanitizes an object, array, or string.
 * This ensures that before saving payloads to the database or passing API data,
 * no malicious script payloads get processed.
 */
export const sanitizePayload = (payload: any): any => {
  if (typeof payload === 'string') {
    return escapeHtml(payload);
  }

  if (Array.isArray(payload)) {
    return payload.map(item => sanitizePayload(item));
  }

  if (payload !== null && typeof payload === 'object') {
    const sanitizedObj: Record<string, any> = {};
    for (const [key, value] of Object.entries(payload)) {
      sanitizedObj[key] = sanitizePayload(value);
    }
    return sanitizedObj;
  }

  return payload;
};
