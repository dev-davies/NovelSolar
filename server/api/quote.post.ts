export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const config = useRuntimeConfig();

  // Get webhook URL from runtime config (same pattern as other endpoints)
  const webhookUrl = config.bitrixWebhookUrl || config.public.bitrixWebhookUrl || config.bitrixWebhook;

  if (!webhookUrl) {
    throw createError({
      statusCode: 500,
      statusMessage: 'CRM connection not configured.'
    });
  }

  // Validate required fields
  if (!body.firstName || !body.lastName || !body.email || !body.phone || !body.projectType) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields: firstName, lastName, email, phone, projectType'
    });
  }

  try {
    // Format the data for Bitrix crm.lead.add
    const response: any = await $fetch(`${webhookUrl}crm.lead.add`, {
      method: 'POST',
      body: {
        fields: {
          TITLE: `Website Quote Request: ${body.projectType || 'General Inquiry'}`,
          NAME: body.firstName,
          LAST_NAME: body.lastName,
          EMAIL: [{ VALUE: body.email, VALUE_TYPE: 'WORK' }],
          PHONE: [{ VALUE: body.phone, VALUE_TYPE: 'WORK' }],
          COMMENTS: `Project Type: ${body.projectType}\n\nDetails:\n${body.details || 'No additional details provided'}`,
          SOURCE_ID: 'WEB'
        },
        params: { REGISTER_SONET_EVENT: 'Y' }
      }
    });

    if (response.error) {
      console.error('Bitrix error response:', response);
      throw new Error(response.error_description || 'Unknown Bitrix error');
    }

    console.log(`✅ Quote lead created in Bitrix (ID: ${response.result})`);

    return {
      success: true,
      leadId: response.result,
      message: 'Your quote request has been submitted successfully. Our team will contact you shortly.'
    };
  } catch (error: any) {
    console.error('❌ Bitrix Lead Creation Error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to submit quote request. Please try again later.'
    });
  }
});
