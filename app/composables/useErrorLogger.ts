// filepath: app/composables/useErrorLogger.ts
import { useRuntimeConfig } from '#app'

export interface ErrorLogEntry {
  message: string
  stack?: string
  context?: Record<string, unknown>
  url?: string
  timestamp: string
  userAgent?: string
  level: 'error' | 'warning' | 'info'
}

export interface ErrorLoggerOptions {
  enabled?: boolean
  endpoint?: string
  environment?: string
  release?: string
}

export function useErrorLogger(options: ErrorLoggerOptions = {}) {
  const config = useRuntimeConfig()
  const isClient = import.meta.client
  const baseUrl = config.public.baseUrl || ''

  const loggerConfig = {
    enabled: options.enabled ?? config.public.errorLoggingEnabled !== false,
    endpoint: options.endpoint ?? config.public.errorLoggingEndpoint ?? '/api/log-error',
    environment: options.environment ?? (baseUrl.includes('localhost') ? 'development' : 'production'),
    release: options.release ?? config.public.appVersion ?? '1.0.0'
  }

  const sendEntry = async (entry: ErrorLogEntry) => {
    if (!loggerConfig.enabled) return

    if (loggerConfig.environment === 'development') {
      const logMethod = entry.level === 'warning' ? console.warn : entry.level === 'info' ? console.log : console.error
      logMethod('[ErrorLogger]', entry.message, entry.stack, entry.context)
    }

    if (!isClient) return

    try {
      await fetch(loggerConfig.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(entry)
      })
    } catch (err) {
      console.error('[ErrorLogger] Failed to send error log:', err)
    }
  }

  const normalizeError = (error: Error | string | unknown) => {
    if (error instanceof Error) return error
    if (typeof error === 'string') return new Error(error)
    return new Error('Unknown error')
  }

  const createEntry = (
    error: Error | string | unknown,
    level: ErrorLogEntry['level'],
    context?: Record<string, unknown>
  ): ErrorLogEntry => {
    const normalizedError = normalizeError(error)

    return {
      message: normalizedError.message,
      stack: normalizedError.stack,
      context,
      url: isClient ? window.location.href : undefined,
      timestamp: new Date().toISOString(),
      userAgent: isClient ? navigator.userAgent : undefined,
      level
    }
  }

  const logError = async (error: Error | string | unknown, context?: Record<string, unknown>) => {
    const entry = createEntry(error, 'error', context)
    await sendEntry(entry)
    return entry
  }

  const logWarning = async (message: string, context?: Record<string, unknown>) => {
    const entry = createEntry(message, 'warning', context)
    await sendEntry(entry)
    return entry
  }

  const logInfo = async (message: string, context?: Record<string, unknown>) => {
    const entry = createEntry(message, 'info', context)

    if (loggerConfig.environment === 'production') {
      return entry
    }

    await sendEntry(entry)
    return entry
  }

  const setupGlobalErrorHandler = () => {
    if (!isClient) return

    const handleError = (event: ErrorEvent) => {
      void logError(event.error || event.message || 'Uncaught client error', {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        type: 'uncaught_error'
      })
    }

    const handleRejection = (event: PromiseRejectionEvent) => {
      void logError(event.reason || 'Unhandled promise rejection', {
        type: 'unhandled_promise_rejection'
      })
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleRejection)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleRejection)
    }
  }

  const trackVueError = (error: Error, info: string) => {
    return logError(error, {
      type: 'vue_error',
      componentInfo: info
    })
  }

  const trackNuxtError = (error: Error | string | unknown, context?: Record<string, unknown>) => {
    return logError(error, {
      type: 'nuxt_error',
      ...context
    })
  }

  return {
    logError,
    logWarning,
    logInfo,
    setupGlobalErrorHandler,
    trackVueError,
    trackNuxtError,
    config: loggerConfig
  }
}
