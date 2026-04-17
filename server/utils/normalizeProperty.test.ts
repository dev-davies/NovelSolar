import { describe, it, expect } from 'vitest'
import { normalizeProperty } from './normalizeProperty'

describe('normalizeProperty', () => {
  it('returns null for null input', () => {
    expect(normalizeProperty(null)).toBeNull()
  })

  it('returns null for undefined input', () => {
    expect(normalizeProperty(undefined)).toBeNull()
  })

  it('returns null for empty string', () => {
    expect(normalizeProperty('')).toBeNull()
  })

  it('returns value directly if not an array', () => {
    expect(normalizeProperty('simple string')).toBe('simple string')
    expect(normalizeProperty(123)).toBe(123)
    expect(normalizeProperty({ key: 'value' })).toEqual({ key: 'value' })
  })

  it('extracts value from Bitrix array format with value property', () => {
    const input = [{ value: 'test-value' }]
    expect(normalizeProperty(input)).toBe('test-value')
  })

  it('extracts value from Bitrix array format without value property', () => {
    const input = ['just-a-string']
    expect(normalizeProperty(input)).toBe('just-a-string')
  })

  it('returns first element from array with multiple items', () => {
    const input = [{ value: 'first' }, { value: 'second' }]
    expect(normalizeProperty(input)).toBe('first')
  })

  it('handles empty array', () => {
    const input: unknown[] = []
    // Fixed: now returns null instead of empty array
    expect(normalizeProperty(input)).toBeNull()
  })

  it('handles array with null value', () => {
    const input = [null]
    // Fixed: now returns null instead of throwing
    expect(normalizeProperty(input)).toBeNull()
  })

  it('handles array with undefined value', () => {
    const input = [undefined]
    // Fixed: now returns null instead of throwing
    expect(normalizeProperty(input)).toBeNull()
  })
})