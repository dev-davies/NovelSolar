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

  if (!bitrixUrl) {
    throw createError({
      statusCode: 500,
      statusMessage: 'CRM Configuration missing',
    });
  }

  try {
    const response = await $fetch<{ result: any }>(`${bitrixUrl}crm.contact.get`, {
      method: 'POST',
      body: { id: contactId }
    });

    const contact = response.result;

    // Extract email and phone from multi-fields
    const email = contact.EMAIL?.[0]?.VALUE || '';
    const phone = contact.PHONE?.[0]?.VALUE || '';

    return {
      firstName: contact.NAME || '',
      lastName: contact.LAST_NAME || '',
      email: email,
      phone: phone,
      address: contact.ADDRESS || ''
    };
  } catch (error) {
    console.error('Bitrix Profile Fetch Error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch user profile from CRM',
    });
  }
});
