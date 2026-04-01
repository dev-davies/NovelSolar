export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const bitrixUrl = config.bitrixWebhookUrl;
  const contactId = getCookie(event, 'auth_token');
  const body = await readBody(event);
  const { firstName, lastName, phone, address } = body;

  if (!contactId) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    });
  }

  if (!bitrixUrl) {
    throw createError({
      statusCode: 500,
      statusMessage: 'CRM Configuration missing',
    });
  }

  const normalizedBitrixUrl = bitrixUrl.endsWith('/') ? bitrixUrl : `${bitrixUrl}/`;

  try {
    await $fetch(`${normalizedBitrixUrl}crm.contact.update`, {
      method: 'POST',
      body: {
        id: contactId,
        fields: {
          NAME: firstName,
          LAST_NAME: lastName,
          PHONE: [{ VALUE: phone, VALUE_TYPE: "WORK" }],
          ADDRESS: address
        }
      }
    });

    return { success: true, message: 'Profile updated successfully' };
  } catch (error) {
    console.error('Bitrix Profile Update Error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update profile in CRM',
    });
  }
});
