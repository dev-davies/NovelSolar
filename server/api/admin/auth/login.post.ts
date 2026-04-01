export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const validPasscode = process.env.ADMIN_UPLOAD_PASSCODE

  if (!validPasscode) {
    console.error('CRITICAL: ADMIN_UPLOAD_PASSCODE is missing from .env file.')
    throw createError({ statusCode: 500, statusMessage: 'Server configuration error.' })
  }

  if (body.passcode !== validPasscode) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid passcode.' })
  }

  // Generate a secure session token
  const sessionToken = `admin_session_${Date.now()}_${Math.random().toString(36).substring(7)}`

  // Set an HttpOnly, Secure cookie that expires in 2 hours (7200 seconds)
  setCookie(event, 'admin_token', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7200,
    path: '/'
  })

  return { success: true, message: 'Authentication successful.' }
})