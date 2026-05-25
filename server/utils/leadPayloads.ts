import type { FailedOrder, FailedQuote, FailedContact, FailedBooking } from '../types/database'
import type { SubmissionType } from '../types/bitrix'

// TITLE prefixes used by the submit endpoints. These also drive classifyLeadByTitle()
// when reading leads back from Bitrix. If a submit endpoint changes its TITLE format,
// update the corresponding prefix here.
export const LEAD_TITLE_PREFIXES = {
  order: 'Web Order:',
  quote: 'Website Quote Request:',
  contact: 'General Web Inquiry:',
  booking: 'Service Booking:',
} as const

export function classifyLeadByTitle(title: string | undefined): SubmissionType {
  if (!title) return 'other'
  if (title.startsWith(LEAD_TITLE_PREFIXES.order)) return 'order'
  if (title.startsWith(LEAD_TITLE_PREFIXES.quote)) return 'quote'
  if (title.startsWith(LEAD_TITLE_PREFIXES.contact)) return 'contact'
  if (title.startsWith(LEAD_TITLE_PREFIXES.booking)) return 'booking'
  return 'other'
}

type LeadFields = Record<string, unknown>

/**
 * Rebuild the crm.lead.add payload for a failed order. The stored FailedOrder only
 * keeps cart items as {id, quantity} — names/prices were resolved from Bitrix at the
 * original checkout and aren't persisted. Retry produces a leaner COMMENTS block
 * than the live checkout, but the OPPORTUNITY total is preserved.
 */
export function buildOrderLeadPayload(order: FailedOrder): { fields: LeadFields } {
  const { customer, cart, total, branch, paymentMethod, orderId } = order
  const itemLines = cart.map((item) => `- ${item.quantity}x product #${item.id ?? item.ID ?? 'unknown'}`).join('\n')
  return {
    fields: {
      TITLE: `${LEAD_TITLE_PREFIXES.order} ${customer.firstName || 'Guest'} ${customer.lastName || ''} (${orderId}) [RECOVERED]`,
      NAME: customer.firstName || 'Guest',
      LAST_NAME: customer.lastName || '',
      EMAIL: [{ VALUE: customer.email, VALUE_TYPE: 'WORK' }],
      PHONE: [{ VALUE: customer.phone || '0000000000', VALUE_TYPE: 'WORK' }],
      ADDRESS: customer.address || '',
      OPPORTUNITY: total,
      CURRENCY_ID: 'NGN',
      COMMENTS: [
        `RECOVERED WEB ORDER (${orderId})`,
        `Fulfillment: ${paymentMethod === 'pickup' ? 'Store Pickup' : 'Delivery'}`,
        `Branch: ${branch?.address || 'N/A'}`,
        `Payment: ${paymentMethod || 'Bank Transfer'}`,
        `Notes: ${customer.note || 'None'}`,
        '',
        'ITEMS:',
        itemLines,
      ].join('\n'),
      SOURCE_ID: 'WEB',
    },
  }
}

export function buildQuoteLeadPayload(quote: FailedQuote): { fields: LeadFields; params: Record<string, string> } {
  return {
    fields: {
      TITLE: `${LEAD_TITLE_PREFIXES.quote} ${quote.projectType || 'General Inquiry'}`,
      NAME: quote.firstName,
      LAST_NAME: quote.lastName,
      EMAIL: [{ VALUE: quote.email, VALUE_TYPE: 'WORK' }],
      PHONE: [{ VALUE: quote.phone, VALUE_TYPE: 'WORK' }],
      COMMENTS: `Project Type: ${quote.projectType}\n\nDetails:\n${quote.details || 'No additional details provided'}`,
      SOURCE_ID: 'WEB',
    },
    params: { REGISTER_SONET_EVENT: 'Y' },
  }
}

export function buildContactLeadPayload(contact: FailedContact): {
  fields: LeadFields
  params: Record<string, string>
} {
  return {
    fields: {
      TITLE: `${LEAD_TITLE_PREFIXES.contact} ${contact.subject || 'No Subject'}`,
      NAME: contact.name,
      EMAIL: [{ VALUE: contact.email, VALUE_TYPE: 'WORK' }],
      PHONE: [{ VALUE: contact.phone || '', VALUE_TYPE: 'WORK' }],
      COMMENTS: `Inquiry Type: General Contact Form\nSubject: ${contact.subject || 'No Subject'}\n\nMessage:\n${contact.message}`,
      SOURCE_ID: 'WEB',
      OPENED: 'Y',
    },
    params: { REGISTER_SONET_EVENT: 'Y' },
  }
}

export function buildBookingLeadPayload(booking: FailedBooking): {
  fields: LeadFields
  params: Record<string, string>
} {
  return {
    fields: {
      TITLE: `${LEAD_TITLE_PREFIXES.booking} ${booking.serviceType}`,
      NAME: booking.firstName,
      LAST_NAME: booking.lastName,
      EMAIL: [{ VALUE: booking.email, VALUE_TYPE: 'WORK' }],
      PHONE: [{ VALUE: booking.phone, VALUE_TYPE: 'WORK' }],
      COMMENTS: `SERVICE REQUEST DETAILS\n------------------------\nService: ${booking.serviceType}\nPreferred Date: ${booking.preferredDate}\nService Address: ${booking.address}\n\nCustomer Notes:\n${booking.details || 'None provided'}`,
      SOURCE_ID: 'WEB',
    },
    params: { REGISTER_SONET_EVENT: 'Y' },
  }
}
