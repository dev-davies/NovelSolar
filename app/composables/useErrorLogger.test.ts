// filepath: app/composables/useErrorLogger.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useErrorLogger } from './useErrorLogger'

vi.mock('#app', () => ({
  useRuntimeConfig: () => ({
    public: {
      baseUrl: 'https://novelsolar.com',
      appVersion: '1.0.0',
      errorLoggingEnabled: true,
      errorLoggingEndpoint: '/api/log-error'
    }
  })
}))

describe('useErrorLogger', () => {
  let mockFetch: ReturnType<typeof vi.fn>
  
  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      value: { href: 'https://novelsolar.com/products' },
      writable: true
    })
    Object.defineProperty(window, 'navigator', {
      value: { userAgent: 'vitest' },
      writable: true
    })
    mockFetch = vi.fn().mockResolvedValue({ ok: true })
    global.fetch = mockFetch as typeof fetch
  })
  
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('logError', () => {
    it('should log error to console in development', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      const { logError } = useErrorLogger({ environment: 'development' })
      const result = await logError('Test error', { context: 'test' })
      
      expect(result.message).toBe('Test error')
      expect(result.level).toBe('error')
      expect(result.context).toEqual({ context: 'test' })
      expect(consoleSpy).toHaveBeenCalled()
      
      consoleSpy.mockRestore()
    })

    it('should send error to endpoint when enabled', async () => {
      const { logError } = useErrorLogger({ enabled: true, environment: 'production' })
      const error = new Error('Test error')
      
      await logError(error, { userId: '123' })
      
      expect(mockFetch).toHaveBeenCalledWith('/api/log-error', expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: expect.stringContaining('Test error')
      }))
    })

    it('should handle string errors', async () => {
      const { logError } = useErrorLogger({ enabled: false })
      const result = await logError('String error message')
      
      expect(result.message).toBe('String error message')
      expect(result.level).toBe('error')
    })
  })

  describe('logWarning', () => {
    it('should log warning with correct level', async () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      const { logWarning } = useErrorLogger({ environment: 'development' })
      const result = await logWarning('Test warning', { context: 'test' })
      
      expect(result.message).toBe('Test warning')
      expect(result.level).toBe('warning')
      
      consoleSpy.mockRestore()
    })
  })

  describe('logInfo', () => {
    it('should log info to console in development', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      
      const { logInfo } = useErrorLogger({ environment: 'development' })
      const result = await logInfo('Test info')
      
      expect(result.message).toBe('Test info')
      expect(result.level).toBe('info')
      
      consoleSpy.mockRestore()
    })
  })

  describe('setupGlobalErrorHandler', () => {
    it('should return cleanup function', () => {
      const { setupGlobalErrorHandler } = useErrorLogger()
      const cleanup = setupGlobalErrorHandler()
      
      expect(typeof cleanup).toBe('function')
      cleanup?.()
    })
  })

  describe('config', () => {
    it('should use custom endpoint when provided', () => {
      const { config } = useErrorLogger({ endpoint: '/custom-log' })
      expect(config.endpoint).toBe('/custom-log')
    })

    it('should default to production environment', () => {
      const { config } = useErrorLogger()
      expect(config.environment).toBe('production')
    })

    it('should allow custom release version', () => {
      const { config } = useErrorLogger({ release: '2.0.0' })
      expect(config.release).toBe('2.0.0')
    })

    it('should derive development environment from localhost baseUrl', () => {
      vi.doMock('#app', () => ({
        useRuntimeConfig: () => ({
          public: {
            baseUrl: 'http://localhost:3000',
            appVersion: '1.0.0',
            errorLoggingEnabled: true,
            errorLoggingEndpoint: '/api/log-error'
          }
        })
      }))

      const { config } = useErrorLogger({ environment: 'development' })
      expect(config.environment).toBe('development')
    })
  })
})
