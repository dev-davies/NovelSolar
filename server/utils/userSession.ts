import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto'

const USER_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7 // 7 days
const USER_SESSION_STORAGE = 'userSessions'
const USER_STATELESS_PREFIX = 'user_stateless_'

export interface UserSessionRecord {
  contactId: string
  email: string
  createdAt: number
  expiresAt: number
}

function getSessionSecret() {
  const config = useRuntimeConfig()
  return String(
    config.authSessionSecret
    || config.otpSecret
    || config.smtpPass
    || 'novel-solar-session-secret'
  )
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

  const [encodedPayload, signature] = parts
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

export async function createUserSession(params: { contactId: string, email: string }) {
  const token = `user_session_${randomUUID()}`
  const createdAt = Date.now()
  const expiresAt = createdAt + (USER_SESSION_MAX_AGE_SECONDS * 1000)

  const record: UserSessionRecord = {
    contactId: params.contactId,
    email: params.email,
    createdAt,
    expiresAt,
  }

  try {
    await useStorage(USER_SESSION_STORAGE).setItem<UserSessionRecord>(
      token,
      record,
      { ttl: USER_SESSION_MAX_AGE_SECONDS }
    )

    return { token, maxAge: USER_SESSION_MAX_AGE_SECONDS }
  } catch (storageError: any) {
    console.error('[AUTH] User session storage failed. Using stateless fallback:', storageError?.message || storageError)
    const statelessToken = createStatelessSessionToken(record)
    return { token: statelessToken, maxAge: USER_SESSION_MAX_AGE_SECONDS }
  }
}

export async function getUserSession(token?: string | null) {
  if (!token) return null

  const statelessSession = parseStatelessSessionToken(token)
  if (statelessSession) return statelessSession

  const storage = useStorage(USER_SESSION_STORAGE)
  let session: UserSessionRecord | null = null

  try {
    session = await storage.getItem<UserSessionRecord | null>(token)
  } catch (storageError: any) {
    console.error('[AUTH] User session read failed:', storageError?.message || storageError)
    return null
  }

  if (!session) return null

  if (Date.now() > session.expiresAt) {
    try {
      await storage.removeItem(token)
    } catch (storageError: any) {
      console.error('[AUTH] User session cleanup failed:', storageError?.message || storageError)
    }
    return null
  }

  return session
}

export async function destroyUserSession(token?: string | null) {
  if (!token) return
  if (token.startsWith(USER_STATELESS_PREFIX)) return

  try {
    await useStorage(USER_SESSION_STORAGE).removeItem(token)
  } catch (storageError: any) {
    console.error('[AUTH] User session destroy failed:', storageError?.message || storageError)
  }
}
