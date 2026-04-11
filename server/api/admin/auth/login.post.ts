import { createAdminSession } from '../../../utils/adminSession'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ passcode?: string }>(event)

  if (!body?.passcode) {
    throw createError({ statusCode: 400, statusMessage: 'Passcode is required.' })
  }

  // Read the admin passcode directly from the server environment variable.
  // This is more secure than a DB lookup — the secret never leaves the server.
  const adminPasscode = process.env.ADMIN_UPLOAD_PASSCODE

  if (!adminPasscode) {
    console.error('ADMIN_UPLOAD_PASSCODE environment variable is not set.')
    throw createError({ statusCode: 500, statusMessage: 'Server configuration error.' })
  }

  // Trim both sides to avoid whitespace mismatches
  if (body.passcode.trim() !== adminPasscode.trim()) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid passcode.' })
  }

  // Session Creation
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

