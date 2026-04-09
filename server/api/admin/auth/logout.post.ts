import { destroyAdminSession } from '../../../utils/adminSession'

export default defineEventHandler(async (event) => {
  const adminToken = getCookie(event, 'admin_token')
  await destroyAdminSession(adminToken)

  // Delete the secure cookie by setting its maxAge to 0
  deleteCookie(event, 'admin_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/'
  })

  return { success: true, message: 'Logged out successfully.' }
})
