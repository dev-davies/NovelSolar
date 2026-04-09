import { randomUUID } from 'node:crypto'

const USER_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7 // 7 days
const USER_SESSION_STORAGE = 'userSessions'

export interface UserSessionRecord {
  contactId: string
  email: string
  createdAt: number
  expiresAt: number
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

  await useStorage(USER_SESSION_STORAGE).setItem<UserSessionRecord>(
    token,
    record,
    { ttl: USER_SESSION_MAX_AGE_SECONDS }
  )

  return { token, maxAge: USER_SESSION_MAX_AGE_SECONDS }
}

export async function getUserSession(token?: string | null) {
  if (!token) return null

  const storage = useStorage(USER_SESSION_STORAGE)
  const session = await storage.getItem<UserSessionRecord | null>(token)
  if (!session) return null

  if (Date.now() > session.expiresAt) {
    await storage.removeItem(token)
    return null
  }

  return session
}

export async function destroyUserSession(token?: string | null) {
  if (!token) return
  await useStorage(USER_SESSION_STORAGE).removeItem(token)
}
