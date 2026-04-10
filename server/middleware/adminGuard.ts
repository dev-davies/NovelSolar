import { validateAdminSession } from '../utils/adminSession'

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event)
  
  // Only protect routes that start with /api/admin/
  // Exclude auth routes (like login) so people can actually authenticate
  if (url.pathname.startsWith('/api/admin/') && !url.pathname.startsWith('/api/admin/auth/')) {
    const token = getCookie(event, 'admin_token')
    const isValid = await validateAdminSession(token)

    if (!isValid) {
      throw createError({ 
        statusCode: 401, 
        statusMessage: 'Unauthorized. An admin session is required to perform this action.' 
      })
    }
  }
})
