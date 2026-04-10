import { createAdminSession } from '../../../utils/adminSession'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ passcode?: string }>(event)
  const config = useRuntimeConfig(event)
  const validPasscode = config.adminUploadPasscode

  if (!validPasscode) {
    console.error('CRITICAL: ADMIN_UPLOAD_PASSCODE is missing from server configuration.')
    throw createError({ statusCode: 500, statusMessage: 'Server configuration error.' })
  }

  if (!body?.passcode) {
    throw createError({ statusCode: 400, statusMessage: 'Passcode is required.' })
  }

  if (body.passcode !== validPasscode) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid passcode.' })
  }

  // Create server-side session and set cookie token reference
  const session = await createAdminSession()

  setCookie(event, 'admin_token', session.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: session.maxAge,
    path: '/'
  })

  return { success: true, message: 'Authentication successful.' }
})
