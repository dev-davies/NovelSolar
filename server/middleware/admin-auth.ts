export default defineEventHandler(async (event) => {
  // Only intercept requests going to /api/admin/
  const path = getRequestURL(event).pathname;
  if (!path.startsWith('/api/admin/')) {
    return;
  }

  // Skip auth check for the auth routes themselves
  if (path.startsWith('/api/admin/auth/')) {
    return;
  }

  // Retrieve HTTP-only cookie
  const sessionId = getCookie(event, 'admin_session');

  if (!sessionId) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: Missing Admin Session',
    });
  }

  // Check if session exists in Nitro storage cache
  const storage = useStorage('cache');
  const session = await storage.getItem(`admin:session:${sessionId}`);

  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: Invalid or Expired Session',
    });
  }
  
  // Extend session optionally by re-setting the cache, but 24hr is fine.
});
