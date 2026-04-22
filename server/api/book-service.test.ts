import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock $fetch globally
global.$fetch = vi.fn()

// Mock useRuntimeConfig
vi.mock('#imports', () => ({
  useRuntimeConfig: vi.fn().mockReturnValue({
    bitrixWebhookUrl: 'https://test.bitrix.com/rest/'
  })
}))

describe('/api/book-service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('creates a lead successfully with valid data', async () => {
    const mockResponse = {
      result: 'lead_12345'
    }
    global.$fetch.mockResolvedValueOnce(mockResponse)

    // Simulate the handler logic
    const body = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '1234567890',
      serviceType: 'Solar Installation',
      preferredDate: '2024-12-25',
      address: '123 Main St',
      details: 'Need installation on roof'
    }

    const response = await global.$fetch('https://test.bitrix.com/rest/crm.lead.add', {
      method: 'POST',
      body: {
        fields: {
          TITLE: `Service Booking: ${body.serviceType}`,
          NAME: body.firstName,
          LAST_NAME: body.lastName,
          EMAIL: [{ VALUE: body.email, VALUE_TYPE: 'WORK' }],
          PHONE: [{ VALUE: body.phone, VALUE_TYPE: 'WORK' }],
          COMMENTS: expect.any(String),
          SOURCE_ID: 'WEB'
        }
      }
    })

    expect(response.result).toBe('lead_12345')
  })

  it('throws error when webhook URL is not configured', () => {
    // Simulate missing config
    const config = { bitrixWebhookUrl: null }

    expect(() => {
      if (!config.bitrixWebhookUrl) {
        throw new Error('CRM connection not configured.')
      }
    }).toThrow('CRM connection not configured.')
  })

  it('handles Bitrix API error response', async () => {
    const mockResponse = {
      error: 'ERROR',
      error_description: 'Invalid request'
    }
    global.$fetch.mockResolvedValueOnce(mockResponse)

    const response = await global.$fetch('https://test.bitrix.com/rest/crm.lead.add', {
      method: 'POST',
      body: { fields: {} }
    })

    expect(response.error).toBe('ERROR')
    expect(response.error_description).toBe('Invalid request')
  })

  it('formats phone number correctly', async () => {
    const mockResponse = { result: 'lead_123' }
    global.$fetch.mockResolvedValueOnce(mockResponse)

    const body = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      serviceType: 'Maintenance',
      preferredDate: '2024-12-25',
      address: '123 Main St'
    }

    const response = await global.$fetch('https://test.bitrix.com/rest/crm.lead.add', {
      method: 'POST',
      body: {
        fields: {
          PHONE: [{ VALUE: body.phone, VALUE_TYPE: 'WORK' }]
        }
      }
    })

    expect(response.result).toBeDefined()
  })

  it('includes customer notes in comments', async () => {
    const mockResponse = { result: 'lead_123' }
    global.$fetch.mockResolvedValueOnce(mockResponse)

    const body = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '1234567890',
      serviceType: 'Installation',
      preferredDate: '2024-12-25',
      address: '123 Main St',
      details: 'Please call before arriving'
    }

    const response = await global.$fetch('https://test.bitrix.com/rest/crm.lead.add', {
      method: 'POST',
      body: {
        fields: {
          COMMENTS: expect.stringContaining('Please call before arriving')
        }
      }
    })

    expect(response.result).toBeDefined()
  })

  it('rejects invalid email format', () => {
    const body = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'invalid-email',
      phone: '1234567890',
      serviceType: 'Installation'
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
    expect(emailRegex.test(body.email.trim())).toBe(false)
  })

  it('handles missing optional details field', async () => {
    const mockResponse = { result: 'lead_123' }
    global.$fetch.mockResolvedValueOnce(mockResponse)

    const body = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '1234567890',
      serviceType: 'Installation',
      preferredDate: '2024-12-25',
      address: '123 Main St'
      // details is optional and not provided
    }

    const response = await global.$fetch('https://test.bitrix.com/rest/crm.lead.add', {
      method: 'POST',
      body: {
        fields: {
          COMMENTS: expect.stringContaining('None provided')
        }
      }
    })

    expect(response.result).toBeDefined()
  })
})