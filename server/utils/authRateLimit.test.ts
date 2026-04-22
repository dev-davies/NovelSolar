import { describe, it, expect, vi, beforeEach } from 'vitest'

// In-memory store to simulate Nitro's useStorage
const store = new Map<string, any>()

// Mock Nitro auto-imports
vi.stubGlobal('useStorage', () => ({
  getItem: vi.fn(async (key: string) => store.get(key) ?? null),
  setItem: vi.fn(async (key: string, value: any) => { store.set(key, value) }),
}))

vi.stubGlobal('createError', (opts: { statusCode: number; statusMessage: string }) => {
  const err = new Error(opts.statusMessage) as any
  err.statusCode = opts.statusCode
  return err
})

// Import after mocks are in place
import { enforceAuthRateLimit } from './authRateLimit'

function makeEvent(ip = '127.0.0.1', path = '/api/admin/auth/login') {
  return {
    path,
    node: {
      req: {
        headers: { 'x-forwarded-for': ip },
        socket: { remoteAddress: ip },
      },
    },
  } as any
}

describe('enforceAuthRateLimit', () => {
  beforeEach(() => {
    store.clear()
  })

  it('allows requests under the limit', async () => {
    const event = makeEvent()
    // 5 attempts should all succeed (default maxAttempts = 5)
    for (let i = 0; i < 5; i++) {
      await expect(enforceAuthRateLimit(event)).resolves.toBeUndefined()
    }
  })

  it('blocks the 6th attempt from the same IP', async () => {
    const event = makeEvent()
    for (let i = 0; i < 5; i++) {
      await enforceAuthRateLimit(event)
    }
    await expect(enforceAuthRateLimit(event)).rejects.toThrow('Too many attempts')
  })

  it('returns a 429 status code when blocked', async () => {
    const event = makeEvent()
    for (let i = 0; i < 5; i++) {
      await enforceAuthRateLimit(event)
    }
    try {
      await enforceAuthRateLimit(event)
      expect.fail('should have thrown')
    } catch (err: any) {
      expect(err.statusCode).toBe(429)
    }
  })

  it('tracks different IPs independently', async () => {
    const eventA = makeEvent('10.0.0.1')
    const eventB = makeEvent('10.0.0.2')

    // Exhaust IP A
    for (let i = 0; i < 5; i++) {
      await enforceAuthRateLimit(eventA)
    }

    // IP B should still be allowed
    await expect(enforceAuthRateLimit(eventB)).resolves.toBeUndefined()
  })

  it('tracks different endpoints independently', async () => {
    const loginEvent = makeEvent('10.0.0.1', '/api/admin/auth/login')
    const resetEvent = makeEvent('10.0.0.1', '/api/admin/auth/request-password-reset')

    // Exhaust login
    for (let i = 0; i < 5; i++) {
      await enforceAuthRateLimit(loginEvent)
    }

    // Password reset should still be allowed for the same IP
    await expect(enforceAuthRateLimit(resetEvent)).resolves.toBeUndefined()
  })

  it('respects custom maxAttempts', async () => {
    const event = makeEvent()
    const opts = { maxAttempts: 2 }

    await enforceAuthRateLimit(event, opts)
    await enforceAuthRateLimit(event, opts)
    await expect(enforceAuthRateLimit(event, opts)).rejects.toThrow('Too many attempts')
  })
})
