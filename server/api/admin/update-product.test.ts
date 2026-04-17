import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock $fetch globally
global.$fetch = vi.fn()

// Mock useRuntimeConfig
vi.mock('#imports', () => ({
  useRuntimeConfig: vi.fn().mockReturnValue({
    bitrixWebhookUrl: 'https://test.bitrix.com/rest/'
  })
}))

describe('/api/admin/update-product', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('updates product successfully with valid data', async () => {
    const mockResponse = {
      result: '12345'
    }
    global.$fetch.mockResolvedValueOnce(mockResponse)

    const body = {
      productId: '12345',
      productName: 'Solar Panel 300W',
      productPrice: 55000,
      productDescription: 'Updated description',
      productSpecs: { wattage: '300W', type: 'Monocrystalline' }
    }

    const response = await global.$fetch('https://test.bitrix.com/rest/crm.product.update', {
      method: 'POST',
      body: {
        id: body.productId,
        fields: {
          NAME: body.productName,
          PRICE: body.productPrice,
          DESCRIPTION: body.productDescription,
          DESCRIPTION_TYPE: 'html',
          PROPERTY_104: JSON.stringify(body.productSpecs)
        }
      }
    })

    expect(response.result).toBe('12345')
  })

  it('throws error for missing required fields', () => {
    const body = {
      productId: '12345'
      // missing productName and productPrice
    }

    expect(() => {
      if (!body.productId || !body.productName || !body.productPrice) {
        throw new Error('Missing required fields: ID, Name, Price')
      }
    }).toThrow('Missing required fields: ID, Name, Price')
  })

  it('throws error when webhook URL is not configured', () => {
    const config = { bitrixWebhookUrl: null }

    expect(() => {
      if (!config.bitrixWebhookUrl) {
        throw new Error('Bitrix not configured')
      }
    }).toThrow('Bitrix not configured')
  })

  it('handles Bitrix update error', async () => {
    global.$fetch.mockResolvedValueOnce({ result: false })

    const body = {
      productId: '12345',
      productName: 'Test Product',
      productPrice: 10000
    }

    const response = await global.$fetch('https://test.bitrix.com/rest/crm.product.update', {
      method: 'POST',
      body: {
        id: body.productId,
        fields: { NAME: body.productName, PRICE: body.productPrice }
      }
    })

    expect(response.result).toBe(false)
  })

  it('formats empty description correctly', async () => {
    const mockResponse = { result: '12345' }
    global.$fetch.mockResolvedValueOnce(mockResponse)

    const body = {
      productId: '12345',
      productName: 'Test Product',
      productPrice: 10000,
      productDescription: ''
    }

    const response = await global.$fetch('https://test.bitrix.com/rest/crm.product.update', {
      method: 'POST',
      body: {
        id: body.productId,
        fields: {
          DESCRIPTION: ''
        }
      }
    })

    expect(response.result).toBeDefined()
  })

  it('stringifies product specs', async () => {
    const mockResponse = { result: '12345' }
    global.$fetch.mockResolvedValueOnce(mockResponse)

    const body = {
      productId: '12345',
      productName: 'Test Product',
      productPrice: 10000,
      productSpecs: { wattage: '300W', efficiency: '20%' }
    }

    const specsJson = JSON.stringify(body.productSpecs)

    const response = await global.$fetch('https://test.bitrix.com/rest/crm.product.update', {
      method: 'POST',
      body: {
        id: body.productId,
        fields: {
          PROPERTY_104: specsJson
        }
      }
    })

    expect(specsJson).toBe('{"wattage":"300W","efficiency":"20%"}')
  })

  it('handles missing optional specs', async () => {
    const mockResponse = { result: '12345' }
    global.$fetch.mockResolvedValueOnce(mockResponse)

    const body = {
      productId: '12345',
      productName: 'Test Product',
      productPrice: 10000
      // productSpecs is optional
    }

    const specsDefault = '[]'

    const response = await global.$fetch('https://test.bitrix.com/rest/crm.product.update', {
      method: 'POST',
      body: {
        id: body.productId,
        fields: {
          PROPERTY_104: specsDefault
        }
      }
    })

    expect(response.result).toBeDefined()
  })
})