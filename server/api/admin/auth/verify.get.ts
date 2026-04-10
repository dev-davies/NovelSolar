import { validateAdminSession } from '../../../utils/adminSession'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'admin_token')
  const isValid = await validateAdminSession(token)

  if (!isValid) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  return { success: true }
})
