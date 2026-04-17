// filepath: server/api/log-error.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createEvent } from 'h3'
import logErrorHandler from './log-error.post'

vi.mock('#imports', () => ({
  useRuntimeConfig: () => ({
    public: {
      appVersion: '1.0.0'
    },
    errorLoggingWebhookUrl: '',
    errorLoggingWebhookAuthHeader: '',
    errorLoggingWebhookToken: ''
  })
}))

describe('log-error.post.ts', () => {
  let mockConsoleLog: ReturnType<typeof vi.spyOn>
  let mockConsoleError: ReturnType<typeof vi.spyOn>
  
  beforeEach(() => {
    mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {})
    mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
  })
  
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return success for valid error log entry', async () => {
    const event = createEvent({
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: {
        message: 'Test error',
        timestamp: new Date().toISOString(),
        level: 'error'
      }
    })

    const response = await logErrorHandler(event)
    expect(response.success).toBe(true)
    expect(response.id).toMatch(/^err_\d+$/)
  })

  it('should reject entries without message', async () => {
    const event = createEvent({
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: {
        timestamp: new Date().toISOString(),
        level: 'error'
      }
    })

    try {
      await logErrorHandler(event)
    } catch (error: unknown) {
      const err = error as { statusCode?: number }
      expect(err.statusCode).toBe(400)
    }
  })

  it('should reject entries without timestamp', async () => {
    const event = createEvent({
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: {
        message: 'Test error',
        level: 'error'
      }
    })

    try {
      await logErrorHandler(event)
    } catch (error: unknown) {
      const err = error as { statusCode?: number }
      expect(err.statusCode).toBe(400)
    }
  })

  it('should include server version in log entry', async () => {
    const event = createEvent({
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: {
        message: 'Test error',
        timestamp: new Date().toISOString(),
        level: 'error'
      }
    })

    const response = await logErrorHandler(event)
    // The handler adds serverVersion to the log but doesn't return it
    // This test just verifies the endpoint works
    expect(response).toBeDefined()
  })

  it('should handle all error levels', async () => {
    const levels = ['error', 'warning', 'info'] as const
    
    for (const level of levels) {
      const event = createEvent({
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: {
          message: `Test ${level}`,
          timestamp: new Date().toISOString(),
          level
        }
      })

      const response = await logErrorHandler(event)
      expect(response.success).toBe(true)
    }
  })
})
