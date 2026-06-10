import { logger } from '../../../utils/logger'
import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ email?: string; password?: string }>(event)
  const config = useRuntimeConfig()

  if (!body?.email || !body?.password) {
    throw createError({ statusCode: 400, statusMessage: 'Email and password are required.' })
  }

  const supabaseUrl = config.public.supabaseUrl
  const supabaseAnonKey = config.public.supabaseAnonKey

  if (!supabaseUrl || !supabaseAnonKey) {
    logger.error('Dealer Login', 'Supabase authentication environment variables are not configured')
    throw createError({ statusCode: 500, statusMessage: 'Server configuration error.' })
  }

  const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
    },
    body: JSON.stringify({
      email: body.email.trim(),
      password: body.password,
    }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => null)
    throw createError({
      statusCode: 401,
      statusMessage: error?.msg || error?.error_description || 'Invalid email or password.',
    })
  }

  const authPayload = await response.json().catch(() => null)
  const userId = authPayload?.user?.id

  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid email or password.',
    })
  }

  const supabaseService = await serverSupabaseServiceRole(event)
  const { data: profile, error: profileError } = await supabaseService
    .from('profiles')
    .select('role, dealer_status')
    .eq('user_id', userId)
    .single()

  if (profileError || !profile || profile.role !== 'dealer' || profile.dealer_status !== 'approved') {
    throw createError({
      statusCode: 403,
      statusMessage: 'This account does not have active dealer access.',
    })
  }

  return {
    success: true,
    session: {
      access_token: authPayload.access_token,
      refresh_token: authPayload.refresh_token,
    },
  }
})
