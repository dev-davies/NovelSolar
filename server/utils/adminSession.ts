// Use memory storage for session persistence across requests
const ADMIN_SESSION_STORAGE = 'adminSessions'
const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 // 24 hours

interface AdminSessionRecord {
  createdAt: number
  expiresAt: number
}

export async function createAdminSession() {
  const token = `admin_session_${globalThis.crypto.randomUUID()}`
  const createdAt = Date.now()
  const expiresAt = createdAt + (ADMIN_SESSION_MAX_AGE_SECONDS * 1000)

  await useStorage(ADMIN_SESSION_STORAGE).setItem<AdminSessionRecord>(
    token,
    { createdAt, expiresAt },
    { ttl: ADMIN_SESSION_MAX_AGE_SECONDS }
  )

  return { token, maxAge: ADMIN_SESSION_MAX_AGE_SECONDS }
}

export async function validateAdminSession(token?: string | null) {
  if (!token) return false

  const storage = useStorage(ADMIN_SESSION_STORAGE)
  const session = await storage.getItem<AdminSessionRecord | null>(token)
  
  if (!session) return false

  if (Date.now() > session.expiresAt) {
    await storage.removeItem(token)
    return false
  }

  return true
}

export async function destroyAdminSession(token?: string | null) {
  if (!token) return
  await useStorage(ADMIN_SESSION_STORAGE).removeItem(token)
}
