import { createAdminSession } from '../../../utils/adminSession'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ email?: string, password?: string, passcode?: string }>(event)

  if (body?.email && body?.password) {
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseAnonKey = process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Supabase authentication environment variables are not configured.')
      throw createError({ statusCode: 500, statusMessage: 'Server configuration error.' })
    }

    const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: supabaseAnonKey
      },
      body: JSON.stringify({
        email: body.email.trim(),
        password: body.password
      })
    })

    if (!response.ok) {
      const error = await response.json().catch(() => null)
      throw createError({
        statusCode: 401,
        statusMessage: error?.msg || error?.error_description || 'Invalid email or password.'
      })
    }
  } else if (body?.passcode) {
    // Backward-compatible fallback for environments still using a shared admin passcode.
    const adminPasscode = process.env.ADMIN_UPLOAD_PASSCODE

    if (!adminPasscode) {
      console.error('ADMIN_UPLOAD_PASSCODE environment variable is not set.')
      throw createError({ statusCode: 500, statusMessage: 'Server configuration error.' })
    }

    if (body.passcode.trim() !== adminPasscode.trim()) {
      throw createError({ statusCode: 401, statusMessage: 'Invalid passcode.' })
    }
  } else {
    throw createError({ statusCode: 400, statusMessage: 'Email and password are required.' })
  }

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
