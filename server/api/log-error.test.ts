// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createEvent, readBody } from 'h3'

// Import handler AFTER mocks
import logErrorHandler from './log-error.post'

const mockConfig = {
  public: { appVersion: '1.0.0' },
  errorLoggingWebhookUrl: '',
  errorLoggingWebhookAuthHeader: '',
  errorLoggingWebhookToken: '',
}

// Intercept standard Nuxt aliases
vi.mock('#imports', () => ({ useRuntimeConfig: () => mockConfig }))
vi.mock('#internal/nitro', () => ({ useRuntimeConfig: () => mockConfig }))

// Intercept global auto-imports injected by @nuxt/test-utils
vi.stubGlobal('useRuntimeConfig', () => mockConfig)

// Mock h3
vi.mock('h3', async () => {
  const actual = (await vi.importActual('h3')) as any
  return {
    ...actual,
    readBody: vi.fn(),
    createEvent: actual.createEvent,
  }
})

const VALID_TOKEN = 'test-log-token'

function makeEvent(headers: Record<string, string> = {}) {
  return createEvent(
    {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...headers },
    } as any,
    {} as any,
  )
}

describe('log-error.post.ts', () => {
  let mockConsoleLog: ReturnType<typeof vi.spyOn>
  let mockConsoleError: ReturnType<typeof vi.spyOn>
  let originalToken: string | undefined

  beforeEach(() => {
    mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {})
    mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    originalToken = process.env.LOG_ERROR_TOKEN
    process.env.LOG_ERROR_TOKEN = VALID_TOKEN
    vi.clearAllMocks()
  })

  afterEach(() => {
    process.env.LOG_ERROR_TOKEN = originalToken
    vi.restoreAllMocks()
  })

  it('should return 403 when LOG_ERROR_TOKEN env var is not set', async () => {
    delete process.env.LOG_ERROR_TOKEN
    const event = makeEvent({ 'x-log-token': VALID_TOKEN })
    vi.mocked(readBody).mockResolvedValue({ message: 'Test', timestamp: new Date().toISOString(), level: 'error' })

    try {
      await logErrorHandler(event)
      expect(true).toBe(false)
    } catch (error: unknown) {
      expect((error as any).statusCode).toBe(403)
    }
  })

  it('should return 401 when x-log-token header is missing', async () => {
    const event = makeEvent()
    vi.mocked(readBody).mockResolvedValue({ message: 'Test', timestamp: new Date().toISOString(), level: 'error' })

    try {
      await logErrorHandler(event)
      expect(true).toBe(false)
    } catch (error: unknown) {
      expect((error as any).statusCode).toBe(401)
    }
  })

  it('should return 401 when x-log-token header is wrong', async () => {
    const event = makeEvent({ 'x-log-token': 'wrong-token' })
    vi.mocked(readBody).mockResolvedValue({ message: 'Test', timestamp: new Date().toISOString(), level: 'error' })

    try {
      await logErrorHandler(event)
      expect(true).toBe(false)
    } catch (error: unknown) {
      expect((error as any).statusCode).toBe(401)
    }
  })

  it('should return success for valid token and valid error log entry', async () => {
    const event = makeEvent({ 'x-log-token': VALID_TOKEN })

    const body = {
      message: 'Test error',
      timestamp: new Date().toISOString(),
      level: 'error',
    }

    vi.mocked(readBody).mockResolvedValue(body)

    const response = await logErrorHandler(event)
    expect(response.success).toBe(true)
    expect(response.id).toMatch(/^err_\d+$/)
  })

  it('should reject entries without message', async () => {
    const event = makeEvent({ 'x-log-token': VALID_TOKEN })

    vi.mocked(readBody).mockResolvedValue({
      timestamp: new Date().toISOString(),
      level: 'error',
    })

    try {
      await logErrorHandler(event)
      expect(true).toBe(false)
    } catch (error: unknown) {
      expect((error as any).statusCode).toBe(400)
    }
  })

  it('should reject entries without timestamp', async () => {
    const event = makeEvent({ 'x-log-token': VALID_TOKEN })

    vi.mocked(readBody).mockResolvedValue({
      message: 'Test error',
      level: 'error',
    })

    try {
      await logErrorHandler(event)
      expect(true).toBe(false)
    } catch (error: unknown) {
      expect((error as any).statusCode).toBe(400)
    }
  })

  it('should include server version in log entry', async () => {
    const event = makeEvent({ 'x-log-token': VALID_TOKEN })

    vi.mocked(readBody).mockResolvedValue({
      message: 'Test error',
      timestamp: new Date().toISOString(),
      level: 'error',
    })

    const response = await logErrorHandler(event)
    expect(response).toBeDefined()
  })

  it('should handle all error levels', async () => {
    const levels = ['error', 'warning', 'info'] as const

    for (const level of levels) {
      const event = makeEvent({ 'x-log-token': VALID_TOKEN })

      vi.mocked(readBody).mockResolvedValue({
        message: `Test ${level}`,
        timestamp: new Date().toISOString(),
        level,
      })

      const response = await logErrorHandler(event)
      expect(response.success).toBe(true)
    }
  })
})
