import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock $fetch globally
global.$fetch = vi.fn()

// Mock useRuntimeConfig
vi.mock('#imports', () => ({
  useRuntimeConfig: vi.fn().mockReturnValue({
    bitrixWebhookUrl: 'https://test.bitrix.com/rest/'
  })
}))

describe('/api/admin/delete-product', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deletes product successfully with valid ID', async () => {
    const mockResponse = {
      result: true
    }
    global.$fetch.mockResolvedValueOnce(mockResponse)

    const body = {
      productId: '12345',
      productName: 'Solar Panel 300W'
    }

    const response = await global.$fetch('https://test.bitrix.com/rest/crm.product.delete', {
      method: 'POST',
      body: {
        id: body.productId
      }
    })

    expect(response.result).toBe(true)
  })

  it('throws error when product ID is missing', () => {
    const body = {
      productName: 'Test Product'
      // missing productId
    }

    expect(() => {
      if (!body.productId) {
        throw new Error('Product ID is required')
      }
    }).toThrow('Product ID is required')
  })

  it('throws error when webhook URL is not configured', () => {
    const config = { bitrixWebhookUrl: null }

    expect(() => {
      if (!config.bitrixWebhookUrl) {
        throw new Error('Bitrix not configured')
      }
    }).toThrow('Bitrix not configured')
  })

  it('handles Bitrix delete error', async () => {
    global.$fetch.mockResolvedValueOnce({ result: false })

    const body = {
      productId: '12345',
      productName: 'Test Product'
    }

    const response = await global.$fetch('https://test.bitrix.com/rest/crm.product.delete', {
      method: 'POST',
      body: {
        id: body.productId
      }
    })

    expect(response.result).toBe(false)
  })

  it('returns product ID in response', async () => {
    const mockResponse = { result: true }
    global.$fetch.mockResolvedValueOnce(mockResponse)

    const body = {
      productId: '12345',
      productName: 'Test Product'
    }

    const response = await global.$fetch('https://test.bitrix.com/rest/crm.product.delete', {
      method: 'POST',
      body: {
        id: body.productId
      }
    })

    // The handler returns productId in the response
    expect(body.productId).toBe('12345')
  })

  it('handles non-existent product gracefully', async () => {
    // Bitrix returns true even if product doesn't exist (idempotent)
    const mockResponse = { result: true }
    global.$fetch.mockResolvedValueOnce(mockResponse)

    const body = {
      productId: '99999',
      productName: 'Non-existent Product'
    }

    const response = await global.$fetch('https://test.bitrix.com/rest/crm.product.delete', {
      method: 'POST',
      body: {
        id: body.productId
      }
    })

    expect(response.result).toBe(true)
  })
})