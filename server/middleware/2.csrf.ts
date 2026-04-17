import { randomUUID } from 'crypto';

export default defineEventHandler((event) => {
  // Only apply CSRF protection to explicit internal API routes
  if (!event.path.startsWith('/api/')) return;
  
  // Exclude bitrix callbacks, webhooks, or open APIs that don't originate from a browser session
  if (event.path.startsWith('/api/bitrix/') || event.path.includes('webhook')) return;

  const method = event.method.toUpperCase();

  if (method === 'GET' || method === 'HEAD') {
    // Distribute token on safe fetching methods
    let token = getCookie(event, 'csrf-token');
    if (!token) {
      token = randomUUID();
      setCookie(event, 'csrf-token', token, {
        httpOnly: false, // Explicitly false so the JS client-side fetch interceptor can read it
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
      });
    }
  } else {
    // Mutating requests must matching header and cookie to prevent forgery
    const headerToken = getHeader(event, 'x-csrf-token');
    const cookieToken = getCookie(event, 'csrf-token');

    if (!headerToken || !cookieToken || headerToken !== cookieToken) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Invalid or missing CSRF security token. Please refresh the page.',
      });
    }
  }
});
