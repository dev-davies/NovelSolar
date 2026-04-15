// Use memory storage for session persistence across requests
const ADMIN_SESSION_STORAGE = 'adminSessions'
const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 // 24 hours

interface AdminSessionRecord {
  userId?: string
  email?: string | null
  createdAt: number
  expiresAt: number
}

export async function createAdminSession(user?: { userId?: string, email?: string | null }) {
  const token = `admin_session_${globalThis.crypto.randomUUID()}`
  const createdAt = Date.now()
  const expiresAt = createdAt + (ADMIN_SESSION_MAX_AGE_SECONDS * 1000)

  await useStorage(ADMIN_SESSION_STORAGE).setItem<AdminSessionRecord>(
    token,
    {
      userId: user?.userId,
      email: user?.email ?? null,
      createdAt,
      expiresAt
    },
    { ttl: ADMIN_SESSION_MAX_AGE_SECONDS }
  )

  return { token, maxAge: ADMIN_SESSION_MAX_AGE_SECONDS }
}

export async function getAdminSession(token?: string | null) {
  if (!token) return null

  const storage = useStorage(ADMIN_SESSION_STORAGE)
  const session = await storage.getItem<AdminSessionRecord | null>(token)
  
  if (!session) return null

  if (Date.now() > session.expiresAt) {
    await storage.removeItem(token)
    return null
  }

  return session
}

export async function validateAdminSession(token?: string | null) {
  const session = await getAdminSession(token)
  return !!session
}

export async function destroyAdminSession(token?: string | null) {
  if (!token) return
  await useStorage(ADMIN_SESSION_STORAGE).removeItem(token)
}
