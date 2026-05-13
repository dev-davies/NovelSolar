import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto'
import { logger } from './logger'
import { getSupabaseAdminClient } from './supabaseAdmin'

const USER_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7 // 7 days
const USER_STATELESS_PREFIX = 'user_stateless_'

export interface UserSessionRecord {
  contactId: string
  email: string
  createdAt: number
  expiresAt: number
}

function getSessionSecret(): string {
  const config = useRuntimeConfig()
  const secret = config.authSessionSecret
  if (!secret) {
    throw createError({
      statusCode: 500,
      statusMessage: 'AUTH_SESSION_SECRET environment variable is not configured.',
    })
  }
  return String(secret)
}

function signValue(value: string, secret: string) {
  return createHmac('sha256', secret).update(value).digest('base64url')
}

function createStatelessSessionToken(record: UserSessionRecord) {
  const secret = getSessionSecret()
  const encodedPayload = Buffer.from(JSON.stringify(record)).toString('base64url')
  const signature = signValue(encodedPayload, secret)
  return `${USER_STATELESS_PREFIX}${encodedPayload}.${signature}`
}

function parseStatelessSessionToken(token: string): UserSessionRecord | null {
  if (!token.startsWith(USER_STATELESS_PREFIX)) return null

  const secret = getSessionSecret()
  const rawToken = token.slice(USER_STATELESS_PREFIX.length)
  const parts = rawToken.split('.')
  if (parts.length !== 2) return null

  const encodedPayload = parts[0]!
  const signature = parts[1]!
  const expectedSignature = signValue(encodedPayload, secret)
  const actualBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expectedSignature)

  if (actualBuffer.length !== expectedBuffer.length || !timingSafeEqual(actualBuffer, expectedBuffer)) {
    return null
  }

  try {
    const parsed = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8')) as UserSessionRecord
    if (!parsed?.contactId || !parsed?.email || !parsed?.expiresAt || !parsed?.createdAt) return null
    if (Date.now() > parsed.expiresAt) return null
    return parsed
  } catch {
    return null
  }
}

export async function createUserSession(params: { contactId: string; email: string }) {
  const token = `user_session_${randomUUID()}`
  const createdAt = Date.now()
  const expiresAt = createdAt + USER_SESSION_MAX_AGE_SECONDS * 1000

  const record: UserSessionRecord = {
    contactId: params.contactId,
    email: params.email,
    createdAt,
    expiresAt,
  }

  try {
    const supabase = getSupabaseAdminClient()
    const { error } = await supabase.from('user_sessions').insert({
      token,
      contact_id: record.contactId,
      email: record.email,
      created_at: record.createdAt,
      expires_at: record.expiresAt,
    })

    if (error) throw error

    return { token, maxAge: USER_SESSION_MAX_AGE_SECONDS }
  } catch (storageError: any) {
    logger.error('AUTH', 'User session storage failed. Using stateless fallback', {
      error: storageError?.message || storageError,
    })
    const statelessToken = createStatelessSessionToken(record)
    return { token: statelessToken, maxAge: USER_SESSION_MAX_AGE_SECONDS }
  }
}

export async function getUserSession(token?: string | null): Promise<UserSessionRecord | null> {
  if (!token) return null

  // Stateless tokens are self-contained — no DB lookup needed
  const statelessSession = parseStatelessSessionToken(token)
  if (statelessSession) return statelessSession

  try {
    const supabase = getSupabaseAdminClient()
    const { data, error } = await supabase
      .from('user_sessions')
      .select('contact_id, email, created_at, expires_at')
      .eq('token', token)
      .maybeSingle()

    if (error) {
      logger.error('AUTH', 'User session read failed', { error: error.message })
      return null
    }

    if (!data) return null

    if (Date.now() > data.expires_at) {
      // Clean up expired session in the background
      supabase
        .from('user_sessions')
        .delete()
        .eq('token', token)
        .then(() => {})
      return null
    }

    return {
      contactId: data.contact_id,
      email: data.email,
      createdAt: data.created_at,
      expiresAt: data.expires_at,
    }
  } catch (storageError: any) {
    logger.error('AUTH', 'User session read failed', { error: storageError?.message || storageError })
    return null
  }
}

export async function destroyUserSession(token?: string | null) {
  if (!token) return
  if (token.startsWith(USER_STATELESS_PREFIX)) return

  try {
    const supabase = getSupabaseAdminClient()
    await supabase.from('user_sessions').delete().eq('token', token)
  } catch (storageError: any) {
    logger.error('AUTH', 'User session destroy failed', { error: storageError?.message || storageError })
  }
}
