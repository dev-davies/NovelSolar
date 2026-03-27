export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, otp } = body;
  const config = useRuntimeConfig();
  const bitrixUrl = config.bitrixWebhookUrl || config.public.bitrixWebhookUrl || config.bitrixWebhook;

  if (!email || !otp) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email and OTP are required',
    });
  }

  // 1. Fetch stored OTP data
  const storageKey = `otp:${email}`;
  const stored = await useStorage('cache').getItem(storageKey) as { code: string, expires: number } | null;

  // 2. Validate OTP
  if (!stored || stored.code !== otp || Date.now() > stored.expires) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid or expired code',
    });
  }

  // 3. Immediately delete OTP from storage
  await useStorage('cache').removeItem(storageKey);

  // 4. Sync with Bitrix CRM
  let contactId = null;
  let isNewUser = false;

  if (bitrixUrl) {
    try {
      // Search for existing contact by email
      const searchResponse = await $fetch<{ result: any[] }>(`${bitrixUrl}crm.contact.list`, {
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
        isNewUser = true;
        const nameParts = email.split('@')[0].split('.');
        const firstName = nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1);
        const lastName = nameParts.length > 1 ? (nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1)) : '';

        const createResponse = await $fetch<{ result: any }>(`${bitrixUrl}crm.contact.add`, {
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

  // 5. Securely log user in for 7 days
  setCookie(event, 'auth_token', contactId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  });

  return { 
    success: true, 
    contactId, 
    message: 'Login successful' 
  };
});
