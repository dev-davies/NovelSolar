import type { H3Event } from 'h3'

interface RateLimitConfig {
  /** Maximum allowed attempts in the window */
  maxAttempts: number
  /** Window size in seconds */
  windowSeconds: number
  /** Storage key prefix */
  prefix: string
}

const defaults: RateLimitConfig = {
  maxAttempts: 5,
  windowSeconds: 900, // 15 minutes
  prefix: 'auth-rl',
}

/**
 * Per-endpoint rate limiter for auth-sensitive routes.
 * Keys by IP + endpoint so limits are independent per route.
 * Uses the same 'rateLimit' storage namespace as the global middleware
 * (memory in dev, Vercel KV in production).
 */
export async function enforceAuthRateLimit(
  event: H3Event,
  opts?: Partial<RateLimitConfig>
) {
  const config = { ...defaults, ...opts }
  const storage = useStorage('rateLimit')

  const ip =
    event.node.req.headers['x-forwarded-for'] ||
    event.node.req.socket.remoteAddress ||
    'unknown-ip'

  const endpoint = event.path || 'unknown'
  const window = Math.floor(Date.now() / 1000 / config.windowSeconds)
  const key = `${config.prefix}:${ip}:${endpoint}:${window}`

  const attempts: number = (await storage.getItem(key)) || 0

  if (attempts >= config.maxAttempts) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Too many attempts. Please try again later.',
    })
  }

  await storage.setItem(key, attempts + 1)
}
