import { validateAdminSession } from '../utils/adminSession'

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event)
  
  // Only protect routes that start with /api/admin/
  // Exclude the login route so people can actually log in
  if (url.pathname.startsWith('/api/admin/') && !url.pathname.startsWith('/api/admin/auth/login')) {
    
    // Read the HttpOnly cookie
    const adminToken = getCookie(event, 'admin_token')

    const isValidSession = await validateAdminSession(adminToken)

    if (!isValidSession) {
      throw createError({ 
        statusCode: 401, 
        statusMessage: 'Unauthorized: Missing or expired admin session.' 
      })
    }
  }
})
