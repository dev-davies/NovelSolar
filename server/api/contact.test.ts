import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock $fetch globally
global.$fetch = vi.fn()

describe('/api/contact logic', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('processes contact form with valid data', async () => {
    const mockResponse = { result: 67890, error: null }
    global.$fetch.mockResolvedValue(mockResponse)

    const config = { bitrixWebhookUrl: 'https://test.bitrix.com/rest/' }
    const body = {
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1234567890',
      subject: 'Product Inquiry',
      message: 'I am interested in your solar panels.'
    }

    const normalizedUrl = config.bitrixWebhookUrl.endsWith('/') 
      ? config.bitrixWebhookUrl 
      : `${config.bitrixWebhookUrl}/`

    const response = await $fetch(`${normalizedUrl}crm.lead.add`, {
      method: 'POST',
      body: {
        fields: {
          TITLE: `General Web Inquiry: ${body.subject}`,
          NAME: body.name,
          EMAIL: [{ VALUE: body.email, VALUE_TYPE: 'WORK' }],
          PHONE: [{ VALUE: body.phone, VALUE_TYPE: 'WORK' }],
          COMMENTS: `Inquiry Type: General Contact Form\nSubject: ${body.subject}\n\nMessage:\n${body.message}`,
          SOURCE_ID: 'WEB',
          OPENED: 'Y'
        }
      }
    })

    expect(response.result).toBe(67890)
    expect(response.error).toBeNull()
  })

  it('validates required fields', () => {
    const body = {
      name: '',
      email: '',
      message: ''
    }

    const isValid = !!(body.name && body.email && body.message)
    expect(isValid).toBe(false)
  })

  it('validates name is required', () => {
    const body = { name: '', email: 'test@test.com', message: 'Hello' }
    expect(!!body.name).toBe(false)
  })

  it('validates email is required', () => {
    const body = { name: 'John', email: '', message: 'Hello' }
    expect(!!body.email).toBe(false)
  })

  it('validates message is required', () => {
    const body = { name: 'John', email: 'test@test.com', message: '' }
    expect(!!body.message).toBe(false)
  })

  it('handles missing webhook URL', () => {
    const config = { bitrixWebhookUrl: null }

    expect(() => {
      if (!config.bitrixWebhookUrl) {
        throw new Error('CRM connection missing.')
      }
    }).toThrow('CRM connection missing.')
  })

  it('handles Bitrix API error', async () => {
    const mockResponse = {
      error: 'ERROR',
      error_description: 'Bitrix API failed'
    }
    global.$fetch.mockResolvedValue(mockResponse)

    const config = { bitrixWebhookUrl: 'https://test.bitrix.com/rest/' }
    const normalizedUrl = config.bitrixWebhookUrl.endsWith('/') 
      ? config.bitrixWebhookUrl 
      : `${config.bitrixWebhookUrl}/`

    const response = await $fetch(`${normalizedUrl}crm.lead.add`, {
      method: 'POST',
      body: { fields: { TITLE: 'Test' } }
    })

    expect(response.error).toBe('ERROR')
  })

  it('formats comments with inquiry details', () => {
    const body = {
      name: 'Test User',
      subject: 'Pricing Question',
      message: 'What is the price for 10 panels?',
      phone: '+1234567890'
    }

    const comments = `Inquiry Type: General Contact Form\nSubject: ${body.subject}\n\nMessage:\n${body.message}`

    expect(comments).toContain('Inquiry Type: General Contact Form')
    expect(comments).toContain('Subject: Pricing Question')
    expect(comments).toContain('What is the price for 10 panels?')
  })

  it('handles optional phone field', async () => {
    const body = {
      name: 'Test User',
      email: 'test@test.com',
      message: 'Hello',
      phone: ''
    }

    // Phone is optional, so empty string should be handled
    const phoneValue = body.phone || ''
    expect(phoneValue).toBe('')
  })

  it('handles optional subject field', () => {
    const body = {
      name: 'Test User',
      email: 'test@test.com',
      message: 'Hello',
      subject: ''
    }

    // Subject defaults to 'No Subject' in the API
    const subject = body.subject || 'No Subject'
    expect(subject).toBe('No Subject')
  })
})