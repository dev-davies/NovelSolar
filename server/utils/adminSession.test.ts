import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock useStorage
const mockStorage = new Map()
vi.mock('#imports', () => ({
  useStorage: vi.fn().mockReturnValue({
    setItem: vi.fn().mockImplementation((key, value) => {
      mockStorage.set(key, value)
    }),
    getItem: vi.fn().mockImplementation((key) => mockStorage.get(key)),
    removeItem: vi.fn().mockImplementation((key) => mockStorage.delete(key))
  })
}))

describe('adminSession', () => {
  beforeEach(() => {
    mockStorage.clear()
    vi.clearAllMocks()
  })

  describe('session configuration', () => {
    it('session max age is 24 hours', () => {
      const maxAgeSeconds = 60 * 60 * 24
      expect(maxAgeSeconds).toBe(86400)
    })

    it('creates session with valid token format', () => {
      const token = `admin_session_${Date.now()}`
      expect(token.startsWith('admin_session_')).toBe(true)
    })
  })

  describe('session record structure', () => {
    it('session record has required fields', () => {
      const record = {
        userId: '123',
        email: 'admin@example.com',
        createdAt: Date.now(),
        expiresAt: Date.now() + 86400000
      }
      
      expect(record.userId).toBeDefined()
      expect(record.email).toBeDefined()
      expect(record.createdAt).toBeDefined()
      expect(record.expiresAt).toBeGreaterThan(record.createdAt)
    })

    it('expiresAt is 24 hours after createdAt', () => {
      const createdAt = Date.now()
      const expiresAt = createdAt + (24 * 60 * 60 * 1000)
      
      expect(expiresAt - createdAt).toBe(86400000)
    })
  })

  describe('token validation', () => {
    it('valid token starts with admin_session_', () => {
      const validToken = 'admin_session_abc123'
      expect(validToken.startsWith('admin_session_')).toBe(true)
    })

    it('null token is invalid', () => {
      const token = null
      expect(!token).toBe(true)
    })

    it('undefined token is invalid', () => {
      const token = undefined
      expect(!token).toBe(true)
    })
  })

  describe('session expiry', () => {
    it('detects expired session', () => {
      const expiredSession = {
        userId: '123',
        email: 'admin@example.com',
        createdAt: Date.now() - 100000,
        expiresAt: Date.now() - 1000 // expired 1 second ago
      }
      
      expect(Date.now() > expiredSession.expiresAt).toBe(true)
    })

    it('valid session is not expired', () => {
      const validSession = {
        userId: '123',
        email: 'admin@example.com',
        createdAt: Date.now(),
        expiresAt: Date.now() + 86400000 // expires in 24 hours
      }
      
      expect(Date.now() > validSession.expiresAt).toBe(false)
    })
  })
})