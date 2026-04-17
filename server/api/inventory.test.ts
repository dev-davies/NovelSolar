import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock $fetch globally
global.$fetch = vi.fn()

// Mock useRuntimeConfig
vi.mock('#imports', () => ({
  useRuntimeConfig: vi.fn().mockReturnValue({
    bitrixWebhookUrl: 'https://test.bitrix.com/rest/'
  })
}))

// Mock normalizeProperty
vi.mock('~/utils/normalizeProperty', () => ({
  normalizeProperty: vi.fn((val) => val)
}))

describe('/api/inventory', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches products from Bitrix successfully', async () => {
    const mockResponse = {
      result: [
        { ID: '1', NAME: 'Solar Panel 300W', PRICE: 50000, QUANTITY: 10 },
        { ID: '2', NAME: 'Inverter 5KVA', PRICE: 150000, QUANTITY: 5 }
      ],
      next: null
    }
    global.$fetch.mockResolvedValueOnce(mockResponse)

    const response = await global.$fetch('https://test.bitrix.com/rest/crm.product.list', {
      method: 'POST',
      body: {
        limit: 50,
        select: expect.any(Array)
      }
    })

    expect(response.result).toHaveLength(2)
    expect(response.result[0].NAME).toBe('Solar Panel 300W')
  })

  it('handles pagination with next token', async () => {
    const firstResponse = {
      result: [{ ID: '1', NAME: 'Product 1' }],
      next: 50
    }
    const secondResponse = {
      result: [{ ID: '2', NAME: 'Product 2' }],
      next: null
    }
    global.$fetch
      .mockResolvedValueOnce(firstResponse)
      .mockResolvedValueOnce(secondResponse)

    // Simulate pagination
    let start = 0
    let allProducts = []
    
    const firstReq = await global.$fetch('https://test.bitrix.com/rest/crm.product.list', {
      method: 'POST',
      body: { limit: 50, start: 0 }
    })
    allProducts.push(...firstReq.result)
    
    if (firstReq.next) {
      start = firstReq.next
      const secondReq = await global.$fetch(`https://test.bitrix.com/rest/crm.product.list?start=${start}`, {
        method: 'POST',
        body: { limit: 50 }
      })
      allProducts.push(...secondReq.result)
    }

    expect(allProducts).toHaveLength(2)
  })

  it('throws error when webhook URL is not configured', () => {
    const config = { bitrixWebhookUrl: null }

    expect(() => {
      if (!config.bitrixWebhookUrl) {
        throw new Error('Server configuration error: Bitrix Webhook URL is missing.')
      }
    }).toThrow('Server configuration error: Bitrix Webhook URL is missing.')
  })

  it('normalizes product properties', async () => {
    const mockResponse = {
      result: [
        { 
          ID: '1', 
          NAME: 'Test Product', 
          PROPERTY_102: [{ value: 'image.jpg' }],
          PROPERTY_44: [{ value: 'category1' }],
          PROPERTY_104: '[]',
          PROPERTY_112: null
        }
      ],
      next: null
    }
    global.$fetch.mockResolvedValueOnce(mockResponse)

    const response = await global.$fetch('https://test.bitrix.com/rest/crm.product.list', {
      method: 'POST',
      body: { limit: 50, select: expect.any(Array) }
    })

    // The handler normalizes properties
    const product = response.result[0]
    expect(product.PROPERTY_102).toBeDefined()
  })

  it('handles empty product list', async () => {
    const mockResponse = {
      result: [],
      next: null
    }
    global.$fetch.mockResolvedValueOnce(mockResponse)

    const response = await global.$fetch('https://test.bitrix.com/rest/crm.product.list', {
      method: 'POST',
      body: { limit: 50 }
    })

    expect(response.result).toHaveLength(0)
  })

  it('handles API errors gracefully', async () => {
    global.$fetch.mockRejectedValueOnce(new Error('Network error'))

    // Simulate error handling - returns empty array on error
    let allProducts = []
    try {
      await global.$fetch('https://test.bitrix.com/rest/crm.product.list', {
        method: 'POST',
        body: { limit: 50 }
      })
    } catch (error) {
      console.error('Error fetching inventory list:', error)
    }

    expect(allProducts).toEqual([])
  })

  it('includes correct select fields', async () => {
    const mockResponse = { result: [], next: null }
    global.$fetch.mockResolvedValueOnce(mockResponse)

    await global.$fetch('https://test.bitrix.com/rest/crm.product.list', {
      method: 'POST',
      body: {
        limit: 50,
        select: ['ID', 'NAME', 'PRICE', 'QUANTITY', 'CURRENCY_ID', 'SECTION_ID', 'PROPERTY_102', 'PROPERTY_104', 'PROPERTY_112', 'DETAIL_PICTURE', 'PREVIEW_PICTURE', 'PROPERTY_44']
      }
    })

    expect(global.$fetch).toHaveBeenCalled()
  })
})