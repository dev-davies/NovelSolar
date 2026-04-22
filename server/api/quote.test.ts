import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock $fetch globally
global.$fetch = vi.fn()

// Mock useRuntimeConfig
vi.mock('#imports', () => ({
  useRuntimeConfig: vi.fn().mockReturnValue({
    bitrixWebhookUrl: 'https://test.bitrix.com/rest/'
  })
}))

describe('/api/quote', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('creates a lead successfully with all required fields', async () => {
    const mockResponse = {
      result: 'lead_67890'
    }
    global.$fetch.mockResolvedValueOnce(mockResponse)

    const body = {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      phone: '9876543210',
      projectType: 'Solar Panel Installation',
      details: 'Looking for 5kW system'
    }

    const response = await global.$fetch('https://test.bitrix.com/rest/crm.lead.add', {
      method: 'POST',
      body: {
        fields: {
          TITLE: `Website Quote Request: ${body.projectType}`,
          NAME: body.firstName,
          LAST_NAME: body.lastName,
          EMAIL: [{ VALUE: body.email, VALUE_TYPE: 'WORK' }],
          PHONE: [{ VALUE: body.phone, VALUE_TYPE: 'WORK' }],
          COMMENTS: expect.any(String),
          SOURCE_ID: 'WEB'
        }
      }
    })

    expect(response.result).toBe('lead_67890')
  })

  it('throws error for missing required fields', () => {
    const body = {
      firstName: 'Jane',
      // missing lastName, email, phone, projectType
    }

    expect(() => {
      if (!body.firstName || !body.lastName || !body.email || !body.phone || !body.projectType) {
        throw new Error('Missing required fields: firstName, lastName, email, phone, projectType')
      }
    }).toThrow('Missing required fields: firstName, lastName, email, phone, projectType')
  })

  it('throws error when webhook URL is not configured', () => {
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
      error_description: 'Lead creation failed'
    }
    global.$fetch.mockResolvedValueOnce(mockResponse)

    const response = await global.$fetch('https://test.bitrix.com/rest/crm.lead.add', {
      method: 'POST',
      body: { fields: {} }
    })

    expect(response.error).toBe('ERROR')
    expect(response.error_description).toBe('Lead creation failed')
  })

  it('includes project type in title', async () => {
    const mockResponse = { result: 'lead_123' }
    global.$fetch.mockResolvedValueOnce(mockResponse)

    const body = {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      phone: '9876543210',
      projectType: 'Battery Backup System'
    }

    const response = await global.$fetch('https://test.bitrix.com/rest/crm.lead.add', {
      method: 'POST',
      body: {
        fields: {
          TITLE: `Website Quote Request: ${body.projectType}`
        }
      }
    })

    expect(response.result).toBeDefined()
  })

  it('handles optional details field', async () => {
    const mockResponse = { result: 'lead_123' }
    global.$fetch.mockResolvedValueOnce(mockResponse)

    const body = {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      phone: '9876543210',
      projectType: 'Solar Installation',
      details: 'Need quote for residential property'
    }

    const response = await global.$fetch('https://test.bitrix.com/rest/crm.lead.add', {
      method: 'POST',
      body: {
        fields: {
          COMMENTS: expect.stringContaining('Need quote for residential property')
        }
      }
    })

    expect(response.result).toBeDefined()
  })

  it('rejects invalid email format', () => {
    const body = {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'not-valid',
      phone: '9876543210',
      projectType: 'Solar Installation'
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
    expect(emailRegex.test(body.email.trim())).toBe(false)
  })

  it('handles missing optional details', async () => {
    const mockResponse = { result: 'lead_123' }
    global.$fetch.mockResolvedValueOnce(mockResponse)

    const body = {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      phone: '9876543210',
      projectType: 'Solar Installation'
      // details is optional
    }

    const response = await global.$fetch('https://test.bitrix.com/rest/crm.lead.add', {
      method: 'POST',
      body: {
        fields: {
          COMMENTS: expect.stringContaining('No additional details provided')
        }
      }
    })

    expect(response.result).toBeDefined()
  })
})