import type { BitrixLeadResponse } from '../types/bitrix'
import { logger } from '../utils/logger'
export default defineEventHandler(async (event) => {
  interface BookServiceBody {
    firstName: string
    lastName: string
    email: string
    phone: string
    serviceType: string
    preferredDate: string
    address: string
    details?: string
    [key: string]: string | undefined
  }
  const body = sanitizePayload(await readBody(event)) as BookServiceBody
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
    logger.info('Book Service API', `Attempting to send booking request to Bitrix for ${body.email}`)

    const response = await $fetch<BitrixLeadResponse>(`${normalizedUrl}crm.lead.add`, {
      method: 'POST',
      body: {
        fields: {
          TITLE: `Service Booking: ${body.serviceType}`,
          NAME: body.firstName,
          LAST_NAME: body.lastName,
          EMAIL: [{ VALUE: body.email, VALUE_TYPE: 'WORK' }],
          PHONE: [{ VALUE: body.phone, VALUE_TYPE: 'WORK' }],
          // Put the crucial service details in the main comment block for the technician
          COMMENTS: `SERVICE REQUEST DETAILS\n------------------------\nService: ${body.serviceType}\nPreferred Date: ${body.preferredDate}\nService Address: ${body.address}\n\nCustomer Notes:\n${body.details || 'None provided'}`,
          SOURCE_ID: 'WEB',
        },
        params: { REGISTER_SONET_EVENT: 'Y' }, // Pings the sales/dispatch team in Bitrix
      },
    })

    if (response.error) {
      logger.error('Book Service API', 'Bitrix error response', {
        error: response.error,
        error_description: response.error_description,
      })
      throw new Error(response.error_description)
    }

    logger.info('Book Service API', `Successfully created Lead in Bitrix for ${body.email}`, {
      leadId: response.result,
    })

    return { success: true, leadId: response.result }
  } catch (error: unknown) {
    const err = error as { data?: unknown }
    logger.error('Book Service API', 'Bitrix Booking Error', { error: err.data || error, email: body.email })

    // THE SAFETY NET: Save the booking request to Nitro's local storage
    try {
      const storage = useStorage('data:failed-bookings')
      const bookingId = `BK-${Date.now()}-${Math.floor(Math.random() * 1000)}`
      await storage.setItem(bookingId, {
        ...body,
        timestamp: new Date().toISOString(),
        id: bookingId,
      })
      logger.info('Book Service API', `Booking ${bookingId} saved to fallback queue.`)
    } catch (storageError) {
      logger.error('Book Service API', '[CRITICAL] Failed to save booking to fallback storage', { error: storageError })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to submit booking request. (Saved locally for retry)',
    })
  }
})
