import { describe, it, expect } from 'vitest'
import { createOtpChallengeToken, createOtpCodeHash, parseOtpChallengeToken } from './otpChallenge'

describe('otpChallenge', () => {
  const secret = 'test-secret-key'
  
  describe('createOtpCodeHash', () => {
    it('generates consistent hash for same input', () => {
      const hash1 = createOtpCodeHash('test@example.com', '123456', secret)
      const hash2 = createOtpCodeHash('test@example.com', '123456', secret)
      expect(hash1).toBe(hash2)
    })

    it('generates different hash for different emails', () => {
      const hash1 = createOtpCodeHash('user1@example.com', '123456', secret)
      const hash2 = createOtpCodeHash('user2@example.com', '123456', secret)
      expect(hash1).not.toBe(hash2)
    })

    it('generates different hash for different codes', () => {
      const hash1 = createOtpCodeHash('test@example.com', '111111', secret)
      const hash2 = createOtpCodeHash('test@example.com', '222222', secret)
      expect(hash1).not.toBe(hash2)
    })
  })

  describe('createOtpChallengeToken', () => {
    it('creates valid token with payload', () => {
      const payload = {
        email: 'test@example.com',
        codeHash: 'hash123',
        expiresAt: Date.now() + 3600000
      }
      const token = createOtpChallengeToken(payload, secret)
      expect(token).toContain('.')
      expect(token.split('.').length).toBe(2)
    })
  })

  describe('parseOtpChallengeToken', () => {
    it('parses valid token correctly', () => {
      const payload = {
        email: 'test@example.com',
        codeHash: 'hash123',
        expiresAt: Date.now() + 3600000
      }
      const token = createOtpChallengeToken(payload, secret)
      const parsed = parseOtpChallengeToken(token, secret)
      
      expect(parsed).not.toBeNull()
      expect(parsed?.email).toBe('test@example.com')
      expect(parsed?.codeHash).toBe('hash123')
    })

    it('returns null for invalid token', () => {
      const result = parseOtpChallengeToken('invalid-token', secret)
      expect(result).toBeNull()
    })

    it('returns null for empty token', () => {
      const result = parseOtpChallengeToken('', secret)
      expect(result).toBeNull()
    })

    it('returns null for wrong secret', () => {
      const payload = {
        email: 'test@example.com',
        codeHash: 'hash123',
        expiresAt: Date.now() + 3600000
      }
      const token = createOtpChallengeToken(payload, secret)
      const parsed = parseOtpChallengeToken(token, 'wrong-secret')
      expect(parsed).toBeNull()
    })

    it('returns null for malformed token', () => {
      const result = parseOtpChallengeToken('abc.def.ghi', secret)
      expect(result).toBeNull()
    })
  })
})