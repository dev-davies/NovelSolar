import { serverSupabaseClient } from '#supabase/server'
import { createAdminSession } from '../../../utils/adminSession'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ passcode?: string }>(event)
  
  if (!body?.passcode) {
    throw createError({ statusCode: 400, statusMessage: 'Passcode is required.' })
  }

  const supabase = await serverSupabaseClient(event)

  // Query the admin_settings table for the admin_passcode
  const { data, error } = await supabase
    .from('admin_settings')
    .select('value')
    .eq('key', 'admin_passcode')
    .single()

  if (error || !data) {
    console.error('Database check failed:', error?.message || 'admin_passcode key not found')
    throw createError({ 
      statusCode: 500, 
      statusMessage: 'Server configuration error. Admin passcode not found in database.' 
    })
  }

  // Verification
  if (body.passcode !== data.value) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid passcode.' })
  }

  // Session Creation
  try {
    const session = await createAdminSession()

    setCookie(event, 'admin_token', session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: session.maxAge,
      path: '/'
    })

    return { success: true, message: 'Authentication successful.' }
  } catch (error: any) {
    console.error('Session creation failed:', error.message)
    throw createError({ 
      statusCode: 500, 
      statusMessage: `Session creation failed: ${error.message || 'Unknown error'}.` 
    })
  }
})
