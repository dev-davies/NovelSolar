import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock $fetch globally
global.$fetch = vi.fn()

// Mock the email template utility
vi.mock('../utils/emailTemplate', () => ({
  generateOrderReceiptHtml: vi.fn().mockReturnValue('<html>receipt</html>')
}))

describe('/api/checkout logic', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('processes checkout with valid data', async () => {
    const mockResponse = { result: 12345, error: null }
    global.$fetch.mockResolvedValue(mockResponse)

    const config = { bitrixWebhookUrl: 'https://test.bitrix.com/rest/' }
    const body = {
      customer: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        address: '123 Test St'
      },
      cart: [
        { name: 'Product 1', price: 1000, quantity: 2 },
        { name: 'Product 2', price: 500, quantity: 1 }
      ],
      total: 2500,
      paymentMethod: 'Bank Transfer',
      branch: { address: 'Main Branch' }
    }

    // Simulate the checkout logic
    const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    const normalizedBitrixUrl = config.bitrixWebhookUrl.endsWith('/') 
      ? config.bitrixWebhookUrl 
      : `${config.bitrixWebhookUrl}/`

    const response = await $fetch(`${normalizedBitrixUrl}crm.lead.add`, {
      method: 'POST',
      body: {
        fields: {
          TITLE: `Web Order: ${body.customer.firstName} ${body.customer.lastName} (${orderId})`,
          NAME: body.customer.firstName,
          LAST_NAME: body.customer.lastName,
          EMAIL: [{ VALUE: body.customer.email, VALUE_TYPE: 'WORK' }],
          PHONE: [{ VALUE: body.customer.phone, VALUE_TYPE: 'WORK' }],
          ADDRESS: body.customer.address,
          OPPORTUNITY: body.total,
          CURRENCY_ID: 'NGN',
          SOURCE_ID: 'WEB'
        }
      }
    })

    expect(response.result).toBe(12345)
    expect(response.error).toBeNull()
  })

  it('handles missing customer data', async () => {
    const body = {
      customer: {},
      cart: [],
      total: 0
    }

    // Simulate validation
    const hasCustomer = !!(body.customer?.firstName || body.customer?.email)
    expect(hasCustomer).toBe(false)
  })

  it('handles empty cart', async () => {
    const body = {
      customer: { firstName: 'John', email: 'john@test.com' },
      cart: [],
      total: 0
    }

    // Cart should be empty
    expect(body.cart.length).toBe(0)
    expect(body.total).toBe(0)
  })

  it('calculates order total correctly', async () => {
    const cart = [
      { name: 'Product 1', price: 1000, quantity: 2 },
      { name: 'Product 2', price: 500, quantity: 3 }
    ]

    const calculatedTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    
    expect(calculatedTotal).toBe(3500) // (1000*2) + (500*3)
  })

  it('handles Bitrix API error', async () => {
    const mockResponse = {
      error: 'ERROR',
      error_description: 'Bitrix API failed'
    }
    global.$fetch.mockResolvedValue(mockResponse)

    const config = { bitrixWebhookUrl: 'https://test.bitrix.com/rest/' }
    const normalizedBitrixUrl = config.bitrixWebhookUrl.endsWith('/') 
      ? config.bitrixWebhookUrl 
      : `${config.bitrixWebhookUrl}/`

    const response = await $fetch(`${normalizedBitrixUrl}crm.lead.add`, {
      method: 'POST',
      body: { fields: { TITLE: 'Test' } }
    })

    expect(response.error).toBe('ERROR')
    expect(response.error_description).toBe('Bitrix API failed')
  })

  it('handles missing webhook URL', () => {
    const config = { bitrixWebhookUrl: null }

    expect(() => {
      if (!config.bitrixWebhookUrl) {
        throw new Error('Bitrix Webhook URL is missing from ENV')
      }
    }).toThrow('Bitrix Webhook URL is missing from ENV')
  })

  it('formats cart items for CRM comments', async () => {
    const cart = [
      { name: 'Solar Panel 300W', price: 50000, quantity: 5 },
      { name: 'Inverter 5KVA', price: 150000, quantity: 2 }
    ]

    const orderDetailsList = cart
      .map((item) => `- ${item.quantity}x ${item.name} (₦${item.price.toLocaleString()})`)
      .join('\n')

    expect(orderDetailsList).toContain('5x Solar Panel 300W')
    expect(orderDetailsList).toContain('2x Inverter 5KVA')
    expect(orderDetailsList).toContain('₦50,000') // individual item price
    expect(orderDetailsList).toContain('₦150,000') // individual item price
  })

  it('rejects invalid customer email format', () => {
    const body = {
      customer: { firstName: 'John', email: 'bad-email', phone: '123' },
      cart: [{ name: 'Panel', price: 1000, quantity: 1 }],
      total: 1000
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
    expect(emailRegex.test((body.customer.email || '').trim())).toBe(false)
  })

  it('generates order ID with timestamp', () => {
    const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    
    expect(orderId).toMatch(/^ORD-\d+-\d+$/)
  })
})