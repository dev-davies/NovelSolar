import { createClient } from '@supabase/supabase-js'
import { createAdminSession } from '../../../utils/adminSession'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ passcode?: string }>(event)

  if (!body?.passcode) {
    throw createError({ statusCode: 400, statusMessage: 'Passcode is required.' })
  }

  // Initialize Supabase directly with env vars (avoids #supabase/server import issues)
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing SUPABASE_URL or SUPABASE_KEY environment variables')
    throw createError({ statusCode: 500, statusMessage: 'Server configuration error.' })
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  // Query the admin_settings table for the admin_passcode
  const { data, error } = await supabase
    .from('admin_settings')
    .select('value')
    .eq('key', 'admin_passcode')
    .single()

  if (error || !data) {
    console.error('Supabase query error:', error?.message, '| Data:', data)
    throw createError({
      statusCode: 500,
      statusMessage: 'Server configuration error. Could not retrieve admin passcode from database.'
    })
  }

  // Verification — trim both sides to avoid whitespace mismatches
  const inputPasscode = body.passcode.trim()
  const dbPasscode = String(data.value).trim()

  if (inputPasscode !== dbPasscode) {
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
