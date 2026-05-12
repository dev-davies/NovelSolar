import type { BitrixLeadResponse } from '../types/bitrix'
import { logger } from '../utils/logger'
export default defineEventHandler(async (event) => {
  interface ContactBody {
    name: string
    email: string
    message: string
    subject?: string
    phone?: string
    [key: string]: string | undefined
  }
  const body = sanitizePayload(await readBody(event)) as ContactBody
  const config = useRuntimeConfig()

  const webhookUrl = config.bitrixWebhookUrl

  if (!webhookUrl) {
    throw createError({
      statusCode: 500,
      statusMessage: 'CRM connection missing.',
    })
  }

  if (!body.name || !body.email || !body.message) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields: name, email, message',
    })
  }

  if (!isValidEmail(body.email)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Please provide a valid email address.',
    })
  }

  const normalizedUrl = webhookUrl.endsWith('/') ? webhookUrl : `${webhookUrl}/`

  try {
    logger.info('Contact API', `Attempting to send contact inquiry to Bitrix for ${body.email}`)

    const response = await $fetch<BitrixLeadResponse>(`${normalizedUrl}crm.lead.add`, {
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
    })

    if (response.error) {
      logger.error('Contact API', 'Bitrix error response', {
        error: response.error,
        error_description: response.error_description,
      })
      throw new Error(response.error_description || 'Unknown Bitrix error')
    }

    logger.info('Contact API', `Successfully created Lead in Bitrix for ${body.email}`, { leadId: response.result })

    return {
      success: true,
      leadId: response.result,
    }
  } catch (error: unknown) {
    const err = error as { data?: unknown }
    logger.error('Contact API', 'Bitrix Contact Inquiry Error', { error: err.data || error, email: body.email })

    // THE SAFETY NET: Save the contact inquiry to Nitro's local storage
    try {
      const storage = useStorage('data:failed-contacts')
      const contactId = `CONT-${Date.now()}-${Math.floor(Math.random() * 1000)}`
      await storage.setItem(contactId, {
        ...body,
        timestamp: new Date().toISOString(),
        id: contactId,
      })
      logger.info('Contact API', `Contact inquiry ${contactId} saved to fallback queue.`)
    } catch (storageError) {
      logger.error('Contact API', '[CRITICAL] Failed to save contact inquiry to fallback storage', {
        error: storageError,
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to send message. (Saved locally for retry)',
    })
  }
})
