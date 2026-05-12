import { timingSafeEqual } from 'crypto'
import { logger } from './logger'

/**
 * Verifies that an inbound Bitrix24 request carries the correct
 * application_token. Bitrix sends this token in the POST body —
 * either at `body.application_token` (flat) or inside
 * `body.auth.application_token` (nested auth object).
 *
 * @param body  — the parsed POST body from Bitrix
 * @param expectedToken — the BITRIX_APPLICATION_TOKEN from runtimeConfig.
 *        When empty/undefined the check is skipped with a warning so
 *        existing deployments aren't broken.
 */
export function verifyBitrixApplicationToken(
  body: Record<string, unknown>,
  expectedToken: string | undefined
): { valid: boolean; reason?: string } {
  if (!expectedToken) {
    logger.warn(
      'Bitrix Webhook',
      'BITRIX_APPLICATION_TOKEN not configured — skipping verification. Set it to enable defence-in-depth.'
    )
    return { valid: true, reason: 'unconfigured' }
  }

  // Bitrix may nest the token inside an `auth` object or send it flat
  const auth = body.auth as Record<string, unknown> | undefined
  const received =
    (auth?.application_token as string | undefined) ??
    (body.application_token as string | undefined) ??
    ''

  if (!received) {
    logger.warn('Bitrix Webhook', 'Request missing application_token')
    return { valid: false, reason: 'missing_token' }
  }

  if (!safeEqual(expectedToken, received)) {
    logger.warn('Bitrix Webhook', 'application_token mismatch')
    return { valid: false, reason: 'token_mismatch' }
  }

  return { valid: true }
}

/** Constant-time string comparison to prevent timing attacks. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  return timingSafeEqual(Buffer.from(a, 'utf8'), Buffer.from(b, 'utf8'))
}
