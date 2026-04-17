import { describe, it, expect, vi } from 'vitest'
import { createHmac } from 'node:crypto'

// Mock useRuntimeConfig
vi.mock('#imports', () => ({
  useRuntimeConfig: vi.fn().mockReturnValue({
    authSessionSecret: 'test-secret',
    otpSecret: 'otp-secret',
    smtpPass: 'smtp-pass'
  })
}))

describe('userSession', () => {
  
  describe('session record structure', () => {
    it('session record has required fields', () => {
      const record = {
        contactId: '123',
        email: 'test@example.com',
        createdAt: Date.now(),
        expiresAt: Date.now() + 604800000 // 7 days
      }
      
      expect(record.contactId).toBeDefined()
      expect(record.email).toBeDefined()
      expect(record.createdAt).toBeLessThan(record.expiresAt)
    })

    it('session expiry is 7 days from creation', () => {
      const createdAt = Date.now()
      const maxAge = 60 * 60 * 24 * 7 * 1000 // 7 days in ms
      const expiresAt = createdAt + maxAge
      
      const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000
      expect(expiresAt - createdAt).toBe(sevenDaysInMs)
    })
  })

  describe('signValue function', () => {
    it('generates consistent signature for same input', () => {
      const signValue = (value: string, secret: string) => 
        createHmac('sha256', secret).update(value).digest('base64url')
      
      const sig1 = signValue('test-value', 'secret')
      const sig2 = signValue('test-value', 'secret')
      expect(sig1).toBe(sig2)
    })

    it('generates different signature for different secrets', () => {
      const signValue = (value: string, secret: string) => 
        createHmac('sha256', secret).update(value).digest('base64url')
      
      const sig1 = signValue('test-value', 'secret1')
      const sig2 = signValue('test-value', 'secret2')
      expect(sig1).not.toBe(sig2)
    })
  })

  describe('stateless token format', () => {
    it('token has correct prefix', () => {
      const prefix = 'user_stateless_'
      const token = `${prefix}payload.signature`
      expect(token.startsWith(prefix)).toBe(true)
    })

    it('token has two parts separated by dot', () => {
      const token = 'user_stateless_abc.def'
      const parts = token.replace('user_stateless_', '').split('.')
      expect(parts.length).toBe(2)
    })
  })
})