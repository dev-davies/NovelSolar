export default defineEventHandler(async (event) => {
  const body = sanitizePayload(await readBody(event));
  const config = useRuntimeConfig();

  const webhookUrl = config.bitrixWebhookUrl;

  if (!webhookUrl) {
    throw createError({
      statusCode: 500,
      statusMessage: 'CRM connection missing.',
    });
  }

  if (!body.name || !body.email || !body.message) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields: name, email, message',
    });
  }

  if (!isValidEmail(body.email)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Please provide a valid email address.',
    });
  }

  const normalizedUrl = webhookUrl.endsWith('/') ? webhookUrl : `${webhookUrl}/`;

  try {
    const response: any = await $fetch(`${normalizedUrl}crm.lead.add`, {
      method: 'POST',
      body: {
        fields: {
          TITLE: `General Web Inquiry: ${body.subject || 'No Subject'}`,
          NAME: body.name,
          EMAIL: [{ VALUE: body.email, VALUE_TYPE: 'WORK' }],
          PHONE: [{ VALUE: body.phone || '', VALUE_TYPE: 'WORK' }],
          COMMENTS: `Inquiry Type: General Contact Form\nSubject: ${body.subject || 'No Subject'}\n\nMessage:\n${body.message}`,
          SOURCE_ID: 'WEB',
          OPENED: 'Y',
        },
        params: { REGISTER_SONET_EVENT: 'Y' },
      },
    });

    if (response.error) {
      throw new Error(response.error_description || 'Unknown Bitrix error');
    }

    return {
      success: true,
      leadId: response.result,
    };
  } catch (error: any) {
    console.error('Bitrix Contact Inquiry Error:', error?.data || error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to send message.',
    });
  }
});
