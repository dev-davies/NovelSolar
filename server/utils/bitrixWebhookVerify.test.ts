import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock logger to avoid side effects and allow assertion
vi.mock('../utils/logger', () => ({
  logger: {
    warn: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
  }
}))

import { verifyBitrixApplicationToken } from '../utils/bitrixWebhookVerify'
import { logger } from '../utils/logger'

describe('verifyBitrixApplicationToken', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('allows requests and warns when token is not configured', () => {
    const result = verifyBitrixApplicationToken({ AUTH_ID: 'abc' }, undefined)

    expect(result.valid).toBe(true)
    expect(result.reason).toBe('unconfigured')
    expect(logger.warn).toHaveBeenCalledWith(
      'Bitrix Webhook',
      expect.stringContaining('not configured')
    )
  })

  it('also treats empty string as unconfigured', () => {
    const result = verifyBitrixApplicationToken({ AUTH_ID: 'abc' }, '')

    expect(result.valid).toBe(true)
    expect(result.reason).toBe('unconfigured')
  })

  it('rejects requests missing application_token when secret is configured', () => {
    const result = verifyBitrixApplicationToken({ AUTH_ID: 'abc' }, 'my-secret-token')

    expect(result.valid).toBe(false)
    expect(result.reason).toBe('missing_token')
  })

  it('rejects requests with wrong application_token (flat)', () => {
    const result = verifyBitrixApplicationToken(
      { AUTH_ID: 'abc', application_token: 'wrong-token' },
      'my-secret-token'
    )

    expect(result.valid).toBe(false)
    expect(result.reason).toBe('token_mismatch')
  })

  it('accepts requests with correct application_token (flat)', () => {
    const result = verifyBitrixApplicationToken(
      { AUTH_ID: 'abc', application_token: 'my-secret-token' },
      'my-secret-token'
    )

    expect(result.valid).toBe(true)
    expect(result.reason).toBeUndefined()
  })

  it('accepts requests with correct application_token (nested in auth)', () => {
    const result = verifyBitrixApplicationToken(
      { AUTH_ID: 'abc', auth: { application_token: 'my-secret-token', access_token: 'xyz' } },
      'my-secret-token'
    )

    expect(result.valid).toBe(true)
    expect(result.reason).toBeUndefined()
  })

  it('prefers auth.application_token over flat application_token', () => {
    const result = verifyBitrixApplicationToken(
      { application_token: 'wrong-flat', auth: { application_token: 'correct-token' } },
      'correct-token'
    )

    expect(result.valid).toBe(true)
  })

  it('rejects when both locations have wrong tokens', () => {
    const result = verifyBitrixApplicationToken(
      { application_token: 'wrong-flat', auth: { application_token: 'also-wrong' } },
      'correct-token'
    )

    expect(result.valid).toBe(false)
    expect(result.reason).toBe('token_mismatch')
  })

  it('uses timing-safe comparison (different length tokens rejected)', () => {
    const result = verifyBitrixApplicationToken(
      { application_token: 'short' },
      'much-longer-expected-token'
    )

    expect(result.valid).toBe(false)
    expect(result.reason).toBe('token_mismatch')
  })
})
