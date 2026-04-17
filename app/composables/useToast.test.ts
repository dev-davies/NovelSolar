import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useToast } from './useToast'

// Mock Nuxt's useState
vi.mock('#app', () => ({
  useState: vi.fn((key, init) => {
    const state = { value: init ? init() : [] }
    return {
      ...state,
      value: state.value
    }
  })
}))

describe('useToast', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('adds a toast with default type (info)', () => {
    const { toasts, addToast } = useToast()
    
    addToast('Test Title', 'Test Message')
    
    expect(toasts.value).toHaveLength(1)
    expect(toasts.value[0].title).toBe('Test Title')
    expect(toasts.value[0].message).toBe('Test Message')
    expect(toasts.value[0].type).toBe('info')
  })

  it('adds a toast with custom type', () => {
    const { toasts, addToast } = useToast()
    
    addToast('Success', 'Operation completed', 'success')
    addToast('Error', 'Something went wrong', 'error')
    
    expect(toasts.value).toHaveLength(2)
    expect(toasts.value[0].type).toBe('success')
    expect(toasts.value[1].type).toBe('error')
  })

  it('adds a toast with custom duration', () => {
    const { toasts, addToast } = useToast()
    
    addToast('Custom Duration', 'This toast lasts 10 seconds', 'info', 10000)
    
    expect(toasts.value[0].duration).toBe(10000)
  })

  it('adds a toast with zero duration (no auto-dismiss)', () => {
    const { toasts, addToast } = useToast()
    
    addToast('Persistent', 'This toast will not auto-dismiss', 'info', 0)
    
    expect(toasts.value[0].duration).toBe(0)
  })

  it('removes a toast by id', () => {
    const { toasts, addToast, removeToast } = useToast()
    
    addToast('Toast 1', 'Message 1')
    addToast('Toast 2', 'Message 2')
    addToast('Toast 3', 'Message 3')
    
    expect(toasts.value).toHaveLength(3)
    
    const toastIdToRemove = toasts.value[1].id
    removeToast(toastIdToRemove)
    
    expect(toasts.value).toHaveLength(2)
    expect(toasts.value.map(t => t.title)).toEqual(['Toast 1', 'Toast 3'])
  })

  it('auto-dismisses toast after default duration (5 seconds)', () => {
    const { toasts, addToast } = useToast()
    
    addToast('Auto Dismiss', 'This will be removed')
    
    expect(toasts.value).toHaveLength(1)
    
    // Fast-forward time by 5 seconds (default duration)
    vi.advanceTimersByTime(5000)
    
    expect(toasts.value).toHaveLength(0)
  })

  it('auto-dismisses toast after custom duration', () => {
    const { toasts, addToast } = useToast()
    
    addToast('Custom Auto Dismiss', 'This will be removed after 3 seconds', 'info', 3000)
    
    expect(toasts.value).toHaveLength(1)
    
    // Fast-forward time by 2 seconds - should still be there
    vi.advanceTimersByTime(2000)
    expect(toasts.value).toHaveLength(1)
    
    // Fast-forward to 3 seconds total - should be removed
    vi.advanceTimersByTime(1000)
    expect(toasts.value).toHaveLength(0)
  })

  it('does not auto-dismiss when duration is 0', () => {
    const { toasts, addToast } = useToast()
    
    addToast('No Auto Dismiss', 'This will not auto-dismiss', 'info', 0)
    
    expect(toasts.value).toHaveLength(1)
    
    // Fast-forward time by a large amount
    vi.advanceTimersByTime(10000)
    
    // Toast should still be there
    expect(toasts.value).toHaveLength(1)
  })

  it('generates unique ids for each toast', () => {
    const { toasts, addToast } = useToast()
    
    addToast('Toast 1', 'Message 1')
    addToast('Toast 2', 'Message 2')
    addToast('Toast 3', 'Message 3')
    
    const ids = toasts.value.map(t => t.id)
    const uniqueIds = new Set(ids)
    
    // All ids should be unique
    expect(uniqueIds.size).toBe(3)
  })

  it('handles multiple toasts with different types', () => {
    const { toasts, addToast } = useToast()
    
    addToast('Info Toast', 'Info message', 'info')
    addToast('Success Toast', 'Success message', 'success')
    addToast('Error Toast', 'Error message', 'error')
    
    expect(toasts.value).toHaveLength(3)
    expect(toasts.value[0].type).toBe('info')
    expect(toasts.value[1].type).toBe('success')
    expect(toasts.value[2].type).toBe('error')
  })
})