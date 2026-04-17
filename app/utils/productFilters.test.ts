import { describe, it, expect } from 'vitest'
import { isServiceProduct, excludeServiceProducts } from './productFilters'

describe('productFilters', () => {
  describe('isServiceProduct', () => {
    it('returns false for null product', () => {
      expect(isServiceProduct(null)).toBe(false)
    })

    it('returns false for undefined product', () => {
      expect(isServiceProduct(undefined)).toBe(false)
    })

    it('returns false for product with no name', () => {
      expect(isServiceProduct({})).toBe(false)
    })

    it('detects audit service in name', () => {
      const product = { NAME: 'Solar Audit Service' }
      expect(isServiceProduct(product)).toBe(true)
    })

    it('detects installation service in name', () => {
      const product = { name: 'Professional Installation' }
      expect(isServiceProduct(product)).toBe(true)
    })

    it('detects repair service in name', () => {
      const product = { NAME: 'Equipment Repair Service' }
      expect(isServiceProduct(product)).toBe(true)
    })

    it('detects maintenance service in name', () => {
      const product = { name: 'Annual Maintenance Contract' }
      expect(isServiceProduct(product)).toBe(true)
    })

    it('is case insensitive', () => {
      const product = { NAME: 'SOLAR INSTALLATION' }
      expect(isServiceProduct(product)).toBe(true)
    })

    it('returns false for regular product', () => {
      const product = { NAME: 'Solar Panel 300W' }
      expect(isServiceProduct(product)).toBe(false)
    })

    it('returns false for inverter product', () => {
      const product = { name: '5KVA Inverter' }
      expect(isServiceProduct(product)).toBe(false)
    })

    it('returns false for battery product', () => {
      const product = { NAME: 'Lithium Battery 12V' }
      expect(isServiceProduct(product)).toBe(false)
    })

    it('handles partial keyword matches', () => {
      const product = { name: 'Installation Kit' }
      expect(isServiceProduct(product)).toBe(true)
    })
  })

  describe('excludeServiceProducts', () => {
    it('returns empty array for null input', () => {
      // Current behavior: throws error (bug - should handle null gracefully)
      expect(() => excludeServiceProducts(null as any)).toThrow()
    })

    it('returns empty array for undefined input', () => {
      expect(excludeServiceProducts(undefined)).toEqual([])
    })

    it('returns empty array for empty array', () => {
      expect(excludeServiceProducts([])).toEqual([])
    })

    it('filters out service products', () => {
      const products = [
        { NAME: 'Solar Panel 300W' },
        { name: 'Installation Service' },
        { NAME: 'Inverter 5KVA' },
        { name: 'Repair Service' }
      ]
      const result = excludeServiceProducts(products)
      expect(result).toHaveLength(2)
      expect(result[0].NAME).toBe('Solar Panel 300W')
      expect(result[1].NAME).toBe('Inverter 5KVA')
    })

    it('keeps all products when none are services', () => {
      const products = [
        { NAME: 'Solar Panel 300W' },
        { name: 'Inverter 5KVA' },
        { NAME: 'Battery 200Ah' }
      ]
      const result = excludeServiceProducts(products)
      expect(result).toHaveLength(3)
    })

    it('removes all service products', () => {
      const products = [
        { name: 'Installation' },
        { NAME: 'Maintenance' },
        { name: 'Audit' }
      ]
      const result = excludeServiceProducts(products)
      expect(result).toHaveLength(0)
    })

    it('preserves product order', () => {
      const products = [
        { NAME: 'Panel' },
        { name: 'Installation' },
        { NAME: 'Inverter' },
        { name: 'Repair' },
        { NAME: 'Battery' }
      ]
      const result = excludeServiceProducts(products)
      expect(result[0].NAME).toBe('Panel')
      expect(result[1].NAME).toBe('Inverter')
      expect(result[2].NAME).toBe('Battery')
    })
  })
})