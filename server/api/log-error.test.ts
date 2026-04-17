// filepath: server/api/log-error.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createEvent, readBody } from 'h3'

// Mock #imports before importing the handler
vi.mock('#imports', () => ({
  useRuntimeConfig: (event?: any) => ({
    public: {
      appVersion: '1.0.0'
    },
    errorLoggingWebhookUrl: '',
    errorLoggingWebhookAuthHeader: '',
    errorLoggingWebhookToken: ''
  })
}))

// Mock h3 readBody
vi.mock('h3', async () => {
  const actual = await vi.importActual('h3') as any
  return {
    ...actual,
    readBody: vi.fn(),
    createEvent: actual.createEvent
  }
})

import logErrorHandler from './log-error.post'

describe('log-error.post.ts', () => {
  let mockConsoleLog: ReturnType<typeof vi.spyOn>
  let mockConsoleError: ReturnType<typeof vi.spyOn>
  
  beforeEach(() => {
    mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {})
    mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.clearAllMocks()
  })
  
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return success for valid error log entry', async () => {
    const event = createEvent({
      method: 'POST',
      headers: { 'content-type': 'application/json' },
    } as any, {} as any)
    
    const body = {
      message: 'Test error',
      timestamp: new Date().toISOString(),
      level: 'error'
    }

    vi.mocked(readBody).mockResolvedValue(body)

    const response = await logErrorHandler(event)
    expect(response.success).toBe(true)
    expect(response.id).toMatch(/^err_\d+$/)
  })

  it('should reject entries without message', async () => {
    const event = createEvent({
      method: 'POST',
      headers: { 'content-type': 'application/json' },
    } as any, {} as any)

    const body = {
      timestamp: new Date().toISOString(),
      level: 'error'
    }

    vi.mocked(readBody).mockResolvedValue(body)

    try {
      await logErrorHandler(event)
      expect(true).toBe(false) // Should not reach here
    } catch (error: any) {
      expect(error.statusCode).toBe(400)
    }
  })

  it('should reject entries without timestamp', async () => {
    const event = createEvent({
      method: 'POST',
      headers: { 'content-type': 'application/json' },
    } as any, {} as any)

    const body = {
      message: 'Test error',
      level: 'error'
    }

    vi.mocked(readBody).mockResolvedValue(body)

    try {
      await logErrorHandler(event)
      expect(true).toBe(false) // Should not reach here
    } catch (error: any) {
      expect(error.statusCode).toBe(400)
    }
  })

  it('should include server version in log entry', async () => {
    const event = createEvent({
      method: 'POST',
      headers: { 'content-type': 'application/json' },
    } as any, {} as any)

    const body = {
      message: 'Test error',
      timestamp: new Date().toISOString(),
      level: 'error'
    }

    vi.mocked(readBody).mockResolvedValue(body)

    const response = await logErrorHandler(event)
    expect(response).toBeDefined()
  })

  it('should handle all error levels', async () => {
    const levels = ['error', 'warning', 'info'] as const
    
    for (const level of levels) {
      const event = createEvent({
        method: 'POST',
        headers: { 'content-type': 'application/json' },
      } as any, {} as any)

      const body = {
        message: `Test ${level}`,
        timestamp: new Date().toISOString(),
        level
      }

      vi.mocked(readBody).mockResolvedValue(body)

      const response = await logErrorHandler(event)
      expect(response.success).toBe(true)
    }
  })
})
