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

export interface BitrixTokenRefreshResponse {
  access_token: string
  expires_in: number
  client_endpoint: string
  refresh_token: string
  domain: string
  server_endpoint: string
}

export async function refreshBitrixToken(domain: string, refreshToken: string): Promise<BitrixTokenRefreshResponse> {
  const config = useRuntimeConfig()
  
  if (!config.bitrixClientId || !config.bitrixClientSecret) {
    throw createError({ 
      statusCode: 500, 
      statusMessage: 'Server configuration error: Bitrix OAuth credentials are missing in runtime config.' 
    })
  }

  const response = await $fetch<BitrixTokenRefreshResponse>('https://oauth.bitrix.info/oauth/token/', {
    method: 'GET',
    query: {
      grant_type: 'refresh_token',
      client_id: config.bitrixClientId,
      client_secret: config.bitrixClientSecret,
      refresh_token: refreshToken
    }
  })

  return response
}
