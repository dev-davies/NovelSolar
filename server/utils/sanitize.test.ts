import { describe, it, expect } from 'vitest'
import { isValidEmail, sanitizePayload } from './sanitize'

describe('isValidEmail', () => {
  it('accepts valid emails', () => {
    expect(isValidEmail('user@example.com')).toBe(true)
    expect(isValidEmail('test.name@domain.co')).toBe(true)
    expect(isValidEmail('user+tag@example.ng')).toBe(true)
    expect(isValidEmail('name@sub.domain.com')).toBe(true)
    expect(isValidEmail('  user@example.com  ')).toBe(true) // trimmed internally
  })

  it('rejects missing @ symbol', () => {
    expect(isValidEmail('userexample.com')).toBe(false)
  })

  it('rejects missing domain', () => {
    expect(isValidEmail('user@')).toBe(false)
    expect(isValidEmail('user@.')).toBe(false)
  })

  it('rejects missing local part', () => {
    expect(isValidEmail('@example.com')).toBe(false)
  })

  it('rejects TLD shorter than 2 characters', () => {
    expect(isValidEmail('user@example.c')).toBe(false)
  })

  it('rejects emails with spaces in the middle', () => {
    expect(isValidEmail('user name@example.com')).toBe(false)
    expect(isValidEmail('user@exam ple.com')).toBe(false)
  })

  it('rejects empty and whitespace-only strings', () => {
    expect(isValidEmail('')).toBe(false)
    expect(isValidEmail('   ')).toBe(false)
  })

  it('rejects non-string values', () => {
    expect(isValidEmail(null)).toBe(false)
    expect(isValidEmail(undefined)).toBe(false)
    expect(isValidEmail(123)).toBe(false)
    expect(isValidEmail({})).toBe(false)
  })

  it('rejects emails exceeding 254 characters', () => {
    const longLocal = 'a'.repeat(245)
    expect(isValidEmail(`${longLocal}@example.com`)).toBe(false)
  })
})

describe('sanitizePayload', () => {
  it('escapes HTML in strings', () => {
    expect(sanitizePayload('<script>alert("xss")</script>')).toBe(
      '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
    )
  })

  it('recursively sanitizes objects', () => {
    const result = sanitizePayload({ name: '<b>bold</b>' })
    expect(result.name).toBe('&lt;b&gt;bold&lt;/b&gt;')
  })

  it('recursively sanitizes arrays', () => {
    const result = sanitizePayload(['<script>', 'safe'])
    expect(result[0]).toBe('&lt;script&gt;')
    expect(result[1]).toBe('safe')
  })

  it('passes through non-string primitives', () => {
    expect(sanitizePayload(42)).toBe(42)
    expect(sanitizePayload(null)).toBe(null)
    expect(sanitizePayload(true)).toBe(true)
  })
})
