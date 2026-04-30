import { readBody, sendRedirect, setCookie, createError } from 'h3'
import { getSupabaseAdminClient } from '../../utils/supabaseAdmin'

export default defineEventHandler(async (event) => {
  if (event.method !== 'POST') {
    throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' })
  }

  const body = await readBody(event)
  
  const member_id = body?.member_id
  const AUTH_ID = body?.AUTH_ID
  const REFRESH_ID = body?.REFRESH_ID
  const DOMAIN = body?.DOMAIN

  if (!AUTH_ID || !DOMAIN) {
    throw createError({ statusCode: 400, statusMessage: 'Missing Bitrix24 authentication tokens' })
  }

  try {
    // 1. Fetch user profile to get bitrix_user_id and check admin status
    const userResponse = await $fetch<any>(`https://${DOMAIN}/rest/user.current?auth=${AUTH_ID}`)
    
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

    // 2. Store credentials in Supabase auth_sessions
    const supabase = getSupabaseAdminClient()
    
    const { data: existingSession } = await (supabase as any)
      .from('auth_sessions')
      .select('id')
      .eq('member_id', member_id || '')
      .eq('bitrix_user_id', bitrixUserId || '')
      .single()
      
    let sessionId: string
    
    if (existingSession?.id) {
      // Update
      const { data, error } = await (supabase as any)
        .from('auth_sessions')
        .update({
          domain: DOMAIN,
          auth_id: AUTH_ID,
          refresh_id: REFRESH_ID,
          expires_at: expiresAt.toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', existingSession.id)
        .select('id')
        .single()
        
      if (error) throw error
      sessionId = data.id
    } else {
      // Insert
      const { data, error } = await (supabase as any)
        .from('auth_sessions')
        .insert({
          bitrix_user_id: bitrixUserId || '',
          member_id: member_id || '',
          domain: DOMAIN,
          auth_id: AUTH_ID,
          refresh_id: REFRESH_ID,
          expires_at: expiresAt.toISOString()
        })
        .select('id')
        .single()
        
      if (error) throw error
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
    
  } catch (error: any) {
    console.error('Bitrix24 Auth Handler Error:', error)
    throw createError({ 
      statusCode: 500, 
      statusMessage: 'Authentication failed',
      data: error.message
    })
  }
})
