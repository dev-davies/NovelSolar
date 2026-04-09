import { destroyUserSession } from '../../utils/userSession'

export default defineEventHandler(async (event) => {
  const authToken = getCookie(event, 'auth_token')
  await destroyUserSession(authToken)

  // Clear the auth_token cookie
  deleteCookie(event, 'auth_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/'
  });

  return { 
    success: true, 
    message: 'Logged out successfully' 
  };
});
