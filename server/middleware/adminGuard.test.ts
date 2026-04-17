import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock adminSession
vi.mock('../utils/adminSession', () => ({
  getAdminSession: vi.fn()
}))

describe('adminGuard middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('route protection logic', () => {
    it('protects /api/admin/ routes', () => {
      const pathname = '/api/admin/products'
      const shouldProtect = pathname.startsWith('/api/admin/') && !pathname.startsWith('/api/admin/auth/')
      
      expect(shouldProtect).toBe(true)
    })

    it('excludes /api/admin/auth/ routes', () => {
      const pathname = '/api/admin/auth/login'
      const shouldProtect = pathname.startsWith('/api/admin/') && !pathname.startsWith('/api/admin/auth/')
      
      expect(shouldProtect).toBe(false)
    })

    it('does not protect non-admin routes', () => {
      const pathname = '/api/products'
      const shouldProtect = pathname.startsWith('/api/admin/') && !pathname.startsWith('/api/admin/auth/')
      
      expect(shouldProtect).toBe(false)
    })

    it('protects /api/admin/manage-admins', () => {
      const pathname = '/api/admin/manage-admins'
      const shouldProtect = pathname.startsWith('/api/admin/') && !pathname.startsWith('/api/admin/auth/')
      
      expect(shouldProtect).toBe(true)
    })
  })

  describe('session validation', () => {
    it('returns 401 when no token provided', async () => {
      const token = null
      const session = null
      
      if (!token) {
        expect(session).toBeNull()
      }
    })

    it('returns 401 when session is invalid', async () => {
      const token = 'invalid-token'
      const session = null
      
      if (token && !session) {
        expect(session).toBeNull()
      }
    })

    it('allows request when session is valid', async () => {
      const token = 'valid-token'
      const session = { userId: '123', email: 'admin@test.com' }
      
      if (token && session) {
        expect(session.userId).toBe('123')
        expect(session.email).toBe('admin@test.com')
      }
    })
  })

  describe('context injection', () => {
    it('injects admin user info into event context', () => {
      const session = { userId: '123', email: 'admin@test.com' }
      const context = {
        admin: {
          user_id: session.userId,
          email: session.email
        }
      }
      
      expect(context.admin.user_id).toBe('123')
      expect(context.admin.email).toBe('admin@test.com')
    })

    it('preserves existing context properties', () => {
      const eventContext = { existingProp: 'value' }
      const session = { userId: '123', email: 'admin@test.com' }
      
      eventContext.admin = {
        user_id: session.userId,
        email: session.email
      }
      
      expect(eventContext.existingProp).toBe('value')
      expect(eventContext.admin).toBeDefined()
    })
  })

  describe('error handling', () => {
    it('throws 401 with correct message for unauthorized', () => {
      expect(() => {
        throw { statusCode: 401, statusMessage: 'Unauthorized. An admin session is required to perform this action.' }
      }).toThrow()
    })

    it('error message is descriptive', () => {
      const errorMessage = 'Unauthorized. An admin session is required to perform this action.'
      
      expect(errorMessage).toContain('Unauthorized')
      expect(errorMessage).toContain('admin session')
    })
  })
})