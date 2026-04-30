import { getCookie } from 'h3'
import { getSupabaseAdminClient } from './supabaseAdmin'

interface BitrixContext {
  baseUrl: string
  authId?: string
  domain?: string
}

export async function getBitrixContext(event: any): Promise<BitrixContext> {
  const config = useRuntimeConfig()
  const fallbackUrl = config.bitrixWebhookUrl
  
  const sessionId = getCookie(event, 'bitrix_session')
  
  if (sessionId) {
    const supabase = getSupabaseAdminClient()
    const { data: session, error } = await (supabase as any)
      .from('auth_sessions')
      .select('auth_id, domain')
      .eq('id', sessionId)
      .single()
      
    if (!error && session && session.auth_id && session.domain) {
      return {
        baseUrl: `https://${session.domain}/rest/`,
        authId: session.auth_id,
        domain: session.domain
      }
    }
  }
  
  return {
    baseUrl: fallbackUrl
  }
}

export async function fetchWithBitrixContext<T>(event: any, endpoint: string, options: any = {}): Promise<T> {
  const context = await getBitrixContext(event)
  
  if (!context.baseUrl) {
    throw createError({ 
      statusCode: 500, 
      statusMessage: 'Server configuration error: Bitrix Webhook URL is missing.' 
    })
  }

  // Ensure the base URL ends with a slash
  const baseUrl = context.baseUrl.replace(/\/$/, '') + '/'
  const url = `${baseUrl}${endpoint}`
  
  // If we're using dynamic auth, append the auth_id to query params
  if (context.authId) {
    options.query = { ...options.query, auth: context.authId }
  }
  
  return $fetch<T>(url, options)
}
