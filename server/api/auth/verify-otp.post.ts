import { createUserSession } from '../../utils/userSession'
import { OTP_CHALLENGE_COOKIE, createOtpCodeHash, parseOtpChallengeToken } from '../../utils/otpChallenge'

function getOtpSecret(config: ReturnType<typeof useRuntimeConfig>) {
  return String(
    config.otpSecret
    || config.authSessionSecret
    || config.smtpPass
    || 'novel-solar-otp-secret'
  )
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const rawEmail = body?.email ?? '';
  const email = rawEmail.trim().toLowerCase();
  const code = (body?.code ?? '').toString().trim();
  const config = useRuntimeConfig();
  const bitrixUrl = config.bitrixWebhookUrl;

  if (!email || !code) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email and verification code are required',
    });
  }

  const storage = useStorage('otp');
  const storageKey = `user:${email}`;
  const failedKey = `otp:failed:${email}`;
  let storageHealthy = true;

  const safeGet = async <T>(key: string, fallback: T): Promise<T> => {
    try {
      const value = await storage.getItem<T>(key);
      return (value ?? fallback) as T;
    } catch (storageError: any) {
      storageHealthy = false;
      console.error('[AUTH] OTP storage read failed during verification:', storageError?.message || storageError);
      return fallback;
    }
  };

  const safeSet = async (key: string, value: unknown, options?: { ttl?: number }) => {
    try {
      await storage.setItem(key, value, options);
    } catch (storageError: any) {
      storageHealthy = false;
      console.error('[AUTH] OTP storage write failed during verification:', storageError?.message || storageError);
    }
  };

  const safeRemove = async (key: string) => {
    try {
      await storage.removeItem(key);
    } catch (storageError: any) {
      storageHealthy = false;
      console.error('[AUTH] OTP storage delete failed during verification:', storageError?.message || storageError);
    }
  };

  // 1. Fetch stored OTP data from persistent storage (Vercel KV in prod)
  let storedData: any = await safeGet<any | null>(storageKey, null);

  // Fallback to signed cookie challenge if storage is unavailable or empty.
  if (!storedData) {
    const challengeToken = getCookie(event, OTP_CHALLENGE_COOKIE);
    if (challengeToken) {
      const parsedChallenge = parseOtpChallengeToken(challengeToken, getOtpSecret(config));
      if (parsedChallenge && parsedChallenge.email === email) {
        storedData = {
          codeHash: parsedChallenge.codeHash,
          expiresAt: parsedChallenge.expiresAt,
        };
      }
    }
  }

  // 2. Validate OTP
  if (!storedData) {
    throw createError({ 
      statusCode: 400, 
      statusMessage: 'OTP expired or not found.' 
    });
  }

  // Check expiration
  if (Date.now() > storedData.expiresAt) {
    await safeRemove(storageKey); // Clean up expired code
    deleteCookie(event, OTP_CHALLENGE_COOKIE, { path: '/' });
    throw createError({ 
      statusCode: 400, 
      statusMessage: 'OTP has expired. Please request a new one.' 
    });
  }

  // Check code match
  const hasCodeMatch = typeof storedData.code === 'string'
    ? storedData.code === code
    : (
      typeof storedData.codeHash === 'string'
      && storedData.codeHash === createOtpCodeHash(email, code, getOtpSecret(config))
    );

  if (!hasCodeMatch) {
    // Track failed verification attempt persistently to prevent brute force across restarts
    const failedAttempts = await safeGet<{ count: number }>(failedKey, { count: 0 });
    failedAttempts.count += 1;
    await safeSet(failedKey, failedAttempts, { ttl: 60 * 60 }); // 1 hour TTL

    throw createError({ 
      statusCode: 400, 
      statusMessage: 'Invalid OTP code.' 
    });
  }

  // SUCCESS: The code is valid and not expired.
  // Immediately delete it so it cannot be used again.
  await safeRemove(storageKey);
  deleteCookie(event, OTP_CHALLENGE_COOKIE, { path: '/' });

  // 3. Sync with Bitrix CRM
  let contactId = null;

  // Use the same normalization logic as other Bitrix integrations
  const bitrixStr = bitrixUrl as string | undefined;
  const normalizedUrl = bitrixStr ? (bitrixStr.endsWith('/') ? bitrixStr : `${bitrixStr}/`) : null;

  if (normalizedUrl) {
    try {
      // Search for existing contact by email
      const searchResponse = await $fetch<{ result: any[] }>(`${normalizedUrl}crm.contact.list`, {
        method: 'POST',
        body: {
          filter: { "EMAIL": email },
          select: ["ID", "NAME", "LAST_NAME"]
        }
      });

      if (searchResponse.result && searchResponse.result.length > 0) {
        // Contact exists
        contactId = searchResponse.result[0].ID;
        console.log(`[AUTH] Existing contact found in CRM: ${contactId} (${email})`);
      } else {
        // Create new contact
        const nameParts = email.split('@')[0].split('.');
        const firstName = nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1);
        const lastName = nameParts.length > 1 ? (nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1)) : '';

        const createResponse = await $fetch<{ result: any }>(`${normalizedUrl}crm.contact.add`, {
          method: 'POST',
          body: {
            fields: {
              NAME: firstName,
              LAST_NAME: lastName,
              EMAIL: [{ VALUE: email, VALUE_TYPE: "WORK" }],
              SOURCE_ID: "WEB",
              TYPE_ID: "CLIENT",
              OPENED: "Y",
              EXPORT: "Y"
            }
          }
        });
        contactId = createResponse.result;
        console.log(`[AUTH] New contact created in CRM: ${contactId} (${email})`);
      }
    } catch (error) {
      console.error('[AUTH] Bitrix Sync Error:', error);
      // We still want to log the user in locally even if Bitrix is down
      contactId = `temp_${Date.now()}`;
    }
  } else {
    contactId = `local_${Date.now()}`;
    console.warn('[AUTH] Bitrix URL not configured, using local fallback ID');
  }

  // 4. Securely log user in for 7 days
  const userSession = await createUserSession({
    contactId: String(contactId),
    email,
  })

  setCookie(event, 'auth_token', userSession.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: userSession.maxAge, // 7 days
    path: '/'
  });

  // 5. Clear failed attempts on successful login
  await safeRemove(failedKey);

  if (!storageHealthy) {
    console.warn('[AUTH] OTP verification completed with storage fallback mode enabled.');
  }

  return { 
    success: true, 
    contactId, 
    message: 'Account verified successfully.' 
  };
});
