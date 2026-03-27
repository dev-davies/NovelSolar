export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const bitrixUrl = config.bitrixWebhookUrl || config.public.bitrixWebhookUrl || config.bitrixWebhook;
  const contactId = getCookie(event, 'auth_token');

  if (!contactId) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized. Please login.',
    });
  }

  // Handle local/temporary IDs (if Bitrix was down during login)
  if (contactId.startsWith('temp_') || contactId.startsWith('local_')) {
    return {
      firstName: 'Valued',
      lastName: 'Customer',
      email: '',
      phone: '',
      address: '',
      isTemporary: true
    };
  }

  if (!bitrixUrl) {
    throw createError({
      statusCode: 500,
      statusMessage: 'CRM Configuration missing',
    });
  }

  // Use storage for short-term caching (5 minutes)
  const cacheKey = `profile:${contactId}`;
  const cachedProfile = await useStorage('cache').getItem(cacheKey) as any;
  if (cachedProfile && cachedProfile.expires > Date.now()) {
    return cachedProfile.data;
  }

  try {
    const response = await $fetch<{ result: any }>(`${bitrixUrl}crm.contact.get`, {
      method: 'POST',
      body: { id: contactId }
    });

    const contact = response.result;
    if (!contact) {
      throw new Error('Contact not found in CRM');
    }

    // Extract email and phone from multi-fields
    const email = contact.EMAIL?.[0]?.VALUE || '';
    const phone = contact.PHONE?.[0]?.VALUE || '';

    const profileData = {
      firstName: contact.NAME || '',
      lastName: contact.LAST_NAME || '',
      email: email,
      phone: phone,
      address: contact.ADDRESS || ''
    };

    // Cache the profile data
    await useStorage('cache').setItem(cacheKey, {
      data: profileData,
      expires: Date.now() + 5 * 60 * 1000
    });

    return profileData;
  } catch (error) {
    console.error(`[PROFILE] Fetch Error for ${contactId}:`, error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch user profile from CRM',
    });
  }
});
