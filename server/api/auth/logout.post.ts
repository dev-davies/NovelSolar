export default defineEventHandler(async (event) => {
  // Clear the auth_token cookie
  deleteCookie(event, 'auth_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });

  return { 
    success: true, 
    message: 'Logged out successfully' 
  };
});
