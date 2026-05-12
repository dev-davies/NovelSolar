import { readBody, sendRedirect, setCookie, createError } from 'h3'
import { getSupabaseAdminClient } from '../../utils/supabaseAdmin'
import { verifyBitrixApplicationToken } from '../../utils/bitrixWebhookVerify'
import { logger } from '../../utils/logger'

interface BitrixUserCurrentResponse {
  result?: {
    ID?: string | number
    ADMIN?: boolean | string
    [key: string]: unknown
  }
  error?: string | boolean
  error_description?: string
}

interface AuthSessionRow {
  id: string
}

interface AuthSessionUpdate {
  domain: string
  auth_id: string
  refresh_id?: string
  expires_at: string
  updated_at?: string
}

interface AuthSessionInsert extends AuthSessionUpdate {
  bitrix_user_id: string
  member_id: string
}

export default defineEventHandler(async (event) => {
  if (event.method !== 'POST') {
    throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' })
  }

  const body = await readBody(event)

  // Defence-in-depth: verify Bitrix application_token before processing.
  // This endpoint is exempt from CSRF and admin guards, so the token is the
  // only proof that the request originated from our Bitrix24 portal.
  const { bitrixApplicationToken } = useRuntimeConfig()
  const tokenCheck = verifyBitrixApplicationToken(body ?? {}, bitrixApplicationToken as string)
  if (!tokenCheck.valid) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden: invalid Bitrix application token' })
  }
  
  const member_id = body?.member_id
  const AUTH_ID = body?.AUTH_ID
  const REFRESH_ID = body?.REFRESH_ID
  const DOMAIN = body?.DOMAIN

  if (!AUTH_ID || !DOMAIN) {
    throw createError({ statusCode: 400, statusMessage: 'Missing Bitrix24 authentication tokens' })
  }

  try {
    // 1. Fetch user profile to get bitrix_user_id and check admin status
    const userResponse = await $fetch<BitrixUserCurrentResponse>(`https://${DOMAIN}/rest/user.current?auth=${AUTH_ID}`)
    
    if (!userResponse || !userResponse.result) {
      throw new Error('Failed to retrieve user profile from Bitrix24')
    }
    
    const bitrixUserId = userResponse.result.ID?.toString()
    // Bitrix24 returns ADMIN as a boolean or string depending on context, usually boolean true/false in REST
    const isAdmin = userResponse.result.ADMIN === true || userResponse.result.ADMIN === 'Y'
    
    // Calculate expiration if provided (usually in seconds from now)
    const expiresAt = new Date()
    const authExpires = parseInt(body.AUTH_EXPIRES || '3600', 10)
    expiresAt.setSeconds(expiresAt.getSeconds() + authExpires)

    // 2. Store credentials in Supabase auth_sessions.
    // `supabase` is untyped (no Database generic configured) so we narrow the
    // returned shape per query rather than casting the whole client.
    const supabase = getSupabaseAdminClient()
    const authSessions = supabase.from('auth_sessions')

    const { data: existingSession } = await authSessions
      .select('id')
      .eq('member_id', member_id || '')
      .eq('bitrix_user_id', bitrixUserId || '')
      .single<AuthSessionRow>()

    let sessionId: string

    if (existingSession?.id) {
      // Update
      const updatePayload: AuthSessionUpdate = {
        domain: DOMAIN,
        auth_id: AUTH_ID,
        refresh_id: REFRESH_ID,
        expires_at: expiresAt.toISOString(),
        updated_at: new Date().toISOString()
      }
      const { data, error } = await supabase
        .from('auth_sessions')
        .update(updatePayload as never)
        .eq('id', existingSession.id)
        .select('id')
        .single<AuthSessionRow>()

      if (error) throw error
      if (!data) throw new Error('Supabase returned no row after update')
      sessionId = data.id
    } else {
      // Insert
      const insertPayload: AuthSessionInsert = {
        bitrix_user_id: bitrixUserId || '',
        member_id: member_id || '',
        domain: DOMAIN,
        auth_id: AUTH_ID,
        refresh_id: REFRESH_ID,
        expires_at: expiresAt.toISOString()
      }
      const { data, error } = await supabase
        .from('auth_sessions')
        .insert(insertPayload as never)
        .select('id')
        .single<AuthSessionRow>()

      if (error) throw error
      if (!data) throw new Error('Supabase returned no row after insert')
      sessionId = data.id
    }

    // 3. Set cookie
    setCookie(event, 'bitrix_session', sessionId, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: authExpires
    })

    // 4. Redirect based on permissions
    const redirectUrl = isAdmin ? '/admin' : '/'
    return sendRedirect(event, redirectUrl)
    
  } catch (error) {
    logger.error('Bitrix Auth', 'Handler error', { error })
    throw createError({
      statusCode: 500,
      statusMessage: 'Authentication failed',
      data: error instanceof Error ? error.message : String(error)
    })
  }
})
