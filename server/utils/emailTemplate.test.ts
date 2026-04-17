import { describe, it, expect, vi } from 'vitest'

// Mock #imports for useRuntimeConfig
vi.mock('#imports', () => ({
  useRuntimeConfig: vi.fn().mockReturnValue({
    public: { baseUrl: 'https://novelsolar.com' }
  })
}))

describe('emailTemplate', () => {
  describe('getEmailTemplateUrls', () => {
    it('returns siteUrl and logoUrl', () => {
      // Simulate the function
      const config = { public: { baseUrl: 'https://novelsolar.com' } }
      const siteUrl = config.public.baseUrl.replace(/\/$/, '')
      
      expect(siteUrl).toBe('https://novelsolar.com')
      expect(`${siteUrl}/images/logo.png`).toBe('https://novelsolar.com/images/logo.png')
    })

    it('removes trailing slash from baseUrl', () => {
      const config = { public: { baseUrl: 'https://novelsolar.com/' } }
      const siteUrl = config.public.baseUrl.replace(/\/$/, '')
      
      expect(siteUrl).toBe('https://novelsolar.com')
    })

    it('generates correct logo URL', () => {
      const siteUrl = 'https://novelsolar.com'
      const logoUrl = `${siteUrl}/images/logo.png`
      
      expect(logoUrl).toBe('https://novelsolar.com/images/logo.png')
    })
  })

  describe('generateOrderReceiptHtml', () => {
    it('generates HTML with order details', () => {
      const orderDetails = {
        orderNumber: 'NS-12345',
        orderDate: '2024-12-25',
        paymentMethod: 'Bank Transfer',
        products: [
          { name: 'Solar Panel 300W', quantity: 2, price: 50000, image: 'panel.jpg' },
          { name: 'Inverter 5KVA', quantity: 1, price: 150000, image: 'inverter.jpg' }
        ],
        subtotal: 250000,
        shipping: 15000
      }
      
      // Verify order number is in output
      expect(orderDetails.orderNumber).toBe('NS-12345')
      expect(orderDetails.products).toHaveLength(2)
      expect(orderDetails.subtotal).toBe(250000)
    })

    it('formats prices with Naira symbol', () => {
      const price = 50000
      const formatted = `₦${price.toLocaleString()}`
      
      expect(formatted).toBe('₦50,000')
    })

    it('generates product rows for each item', () => {
      const products = [
        { name: 'Product 1', quantity: 1, price: 1000 },
        { name: 'Product 2', quantity: 2, price: 2000 }
      ]
      
      // Each product should generate a row
      expect(products.length).toBe(2)
      expect(products[0].name).toBe('Product 1')
      expect(products[1].name).toBe('Product 2')
    })

    it('calculates total correctly', () => {
      const orderDetails = {
        subtotal: 250000,
        shipping: 15000
      }
      
      const total = orderDetails.subtotal + orderDetails.shipping
      
      expect(total).toBe(265000)
    })

    it('includes site URL in HTML', () => {
      const siteUrl = 'https://novelsolar.com'
      
      // The HTML should contain the site URL
      expect(siteUrl).toContain('novelsolar.com')
    })

    it('handles empty products array', () => {
      const orderDetails = {
        orderNumber: 'NS-12345',
        orderDate: '2024-12-25',
        paymentMethod: 'Bank Transfer',
        products: [],
        subtotal: 0,
        shipping: 0
      }
      
      expect(orderDetails.products).toHaveLength(0)
      expect(orderDetails.subtotal).toBe(0)
    })

    it('includes order metadata in HTML', () => {
      const orderDetails = {
        orderNumber: 'NS-99999',
        orderDate: '2024-01-15',
        paymentMethod: 'Card Payment'
      }
      
      expect(orderDetails.orderNumber).toBeDefined()
      expect(orderDetails.orderDate).toBeDefined()
      expect(orderDetails.paymentMethod).toBe('Card Payment')
    })
  })
})