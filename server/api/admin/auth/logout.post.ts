export default defineEventHandler(async (event) => {
  const sessionId = getCookie(event, 'admin_session');

  if (sessionId) {
    // Invalidate session in storage
    const storage = useStorage('cache');
    await storage.removeItem(`admin:session:${sessionId}`);
  }

  // Clear both cookies
  deleteCookie(event, 'admin_session', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });

  deleteCookie(event, 'admin_auth_status', {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });

  return { 
    success: true, 
    message: 'Admin logged out successfully' 
  };
});
