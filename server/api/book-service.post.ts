export default defineEventHandler(async (event) => {
  const body = sanitizePayload(await readBody(event))
  const config = useRuntimeConfig()
  const webhookUrl = config.bitrixWebhookUrl

  if (!webhookUrl) {
    throw createError({ statusCode: 500, statusMessage: 'CRM connection not configured.' })
  }

  if (!isValidEmail(body.email)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Please provide a valid email address.',
    })
  }

  // Ensure URL ends with a slash for safety
  const normalizedUrl = webhookUrl.endsWith('/') ? webhookUrl : `${webhookUrl}/`

  try {
    // Format the data for Bitrix crm.lead.add
    const response: any = await $fetch(`${normalizedUrl}crm.lead.add`, {
      method: 'POST',
      body: {
        fields: {
          TITLE: `Service Booking: ${body.serviceType}`,
          NAME: body.firstName,
          LAST_NAME: body.lastName,
          EMAIL: [{ VALUE: body.email, VALUE_TYPE: "WORK" }],
          PHONE: [{ VALUE: body.phone, VALUE_TYPE: "WORK" }],
          // Put the crucial service details in the main comment block for the technician
          COMMENTS: `SERVICE REQUEST DETAILS\n------------------------\nService: ${body.serviceType}\nPreferred Date: ${body.preferredDate}\nService Address: ${body.address}\n\nCustomer Notes:\n${body.details || 'None provided'}`,
          SOURCE_ID: "WEB" 
        },
        params: { REGISTER_SONET_EVENT: "Y" } // Pings the sales/dispatch team in Bitrix
      }
    })

    if (response.error) {
      throw new Error(response.error_description)
    }

    return { success: true, leadId: response.result }
  } catch (error: any) {
    console.error('Bitrix Booking Error:', error?.data || error)
    throw createError({ 
      statusCode: 500, 
      statusMessage: 'Failed to submit booking request. Please try again later.' 
    })
  }
})
