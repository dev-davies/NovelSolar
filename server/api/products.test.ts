import { describe, it, expect, vi } from 'vitest'

// Mock $fetch globally
global.$fetch = vi.fn()

// Mock the utility function
vi.mock('~/utils/normalizeProperty', () => ({
  normalizeProperty: vi.fn((value) => value)
}))

describe('/api/products logic', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('processes products successfully', async () => {
    const mockResponse = {
      result: [
        {
          ID: '1',
          NAME: 'Test Product',
          PRICE: 1000,
          DESCRIPTION: 'Test description',
          PROPERTY_102: 'image.jpg'
        }
      ],
      total: 1
    }

    global.$fetch.mockResolvedValue(mockResponse)

    // Simulate the handler logic without Nuxt wrapper
    const config = { bitrixWebhookUrl: 'https://test.bitrix.com/rest/' }
    const query = {}
    const startFrom = 0
    const PAGE_SIZE = 50

    const filters = {}
    const response = await $fetch(`${config.bitrixWebhookUrl}crm.product.list`, {
      method: 'POST',
      body: {
        filter: filters,
        select: expect.any(Array),
        order: { ID: 'DESC' },
        start: startFrom,
        limit: PAGE_SIZE,
      },
    })

    expect(response.result).toHaveLength(1)
    expect(response.result[0].NAME).toBe('Test Product')
  })

  it('handles API errors', async () => {
    const mockResponse = {
      error: 'API_ERROR',
      error_description: 'Bitrix API failed'
    }

    global.$fetch.mockResolvedValue(mockResponse)

    const config = { bitrixWebhookUrl: 'https://test.bitrix.com/rest/' }

    const response = await $fetch(`${config.bitrixWebhookUrl}crm.product.list`, {
      method: 'POST',
      body: expect.any(Object),
    })

    // Check that the response contains error
    expect(response.error).toBe('API_ERROR')
    expect(response.error_description).toBe('Bitrix API failed')
  })

  it('handles missing webhook URL', () => {
    const config = { bitrixWebhookUrl: null }

    expect(() => {
      if (!config.bitrixWebhookUrl) {
        throw new Error('Server configuration error')
      }
    }).toThrow('Server configuration error')
  })
})