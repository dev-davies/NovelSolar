import { describe, it, expect } from 'vitest'
import { useProductImage } from './useProductImage'

const { getProductImage } = useProductImage()

describe('useProductImage', () => {
  describe('getProductImage', () => {
    it('returns placeholder when product is null', () => {
      expect(getProductImage(null)).toBe('/images/placeholder.png')
    })

    it('returns placeholder when product is undefined', () => {
      expect(getProductImage(undefined)).toBe('/images/placeholder.png')
    })

    it('returns placeholder when product is empty object', () => {
      expect(getProductImage({})).toBe('/images/placeholder.png')
    })

    it('returns Cloudinary URL from PROPERTY_102 as direct string', () => {
      const product = {
        NAME: 'Test Product',
        PROPERTY_102: 'https://res.cloudinary.com/demo/image/upload/sample.jpg'
      }
      expect(getProductImage(product)).toBe('https://res.cloudinary.com/demo/image/upload/sample.jpg')
    })

    it('returns Cloudinary URL from PROPERTY_102 as array of objects', () => {
      const product = {
        NAME: 'Test Product',
        PROPERTY_102: [
          { value: 'https://res.cloudinary.com/demo/image/upload/cloudinary1.jpg' }
        ]
      }
      expect(getProductImage(product)).toBe('https://res.cloudinary.com/demo/image/upload/cloudinary1.jpg')
    })

    it('returns empty string when PROPERTY_102 is empty array', () => {
      const product = {
        NAME: 'Test Product',
        PROPERTY_102: []
      }
      // Falls through to legacy fields, then placeholder
      expect(getProductImage(product)).toBe('/images/placeholder.png')
    })

    it('falls back to PROPERTY_44 when PROPERTY_102 is missing', () => {
      const product = {
        NAME: 'Test Product',
        PROPERTY_44: {
          showUrl: '/upload/iblock/123/image.jpg'
        }
      }
      expect(getProductImage(product)).toContain('/api/bitrix-image')
      expect(getProductImage(product)).toContain('nisl.bitrix24.com')
    })

    it('falls back to PREVIEW_PICTURE when PROPERTY_102 and PROPERTY_44 are missing', () => {
      const product = {
        NAME: 'Test Product',
        PREVIEW_PICTURE: {
          downloadUrl: '/upload/iblock/456/preview.jpg'
        }
      }
      expect(getProductImage(product)).toContain('/api/bitrix-image')
      expect(getProductImage(product)).toContain('nisl.bitrix24.com')
    })

    it('falls back to DETAIL_PICTURE when PROPERTY_102, PROPERTY_44, and PREVIEW_PICTURE are missing', () => {
      const product = {
        NAME: 'Test Product',
        DETAIL_PICTURE: {
          showUrl: '/upload/iblock/789/detail.jpg'
        }
      }
      expect(getProductImage(product)).toContain('/api/bitrix-image')
      expect(getProductImage(product)).toContain('nisl.bitrix24.com')
    })

    it('returns direct URL when legacy field is a string starting with http', () => {
      const product = {
        NAME: 'Test Product',
        PROPERTY_44: 'https://example.com/direct-image.jpg'
      }
      expect(getProductImage(product)).toBe('https://example.com/direct-image.jpg')
    })

    it('returns placeholder when all image fields are missing', () => {
      const product = {
        NAME: 'Test Product',
        PRICE: 1000,
        DESCRIPTION: 'A test product'
      }
      expect(getProductImage(product)).toBe('/images/placeholder.png')
    })

    it('prefers PROPERTY_102 over legacy fields', () => {
      const product = {
        NAME: 'Test Product',
        PROPERTY_102: 'https://cloudinary.com/preferred.jpg',
        PROPERTY_44: { showUrl: '/legacy/image.jpg' },
        PREVIEW_PICTURE: { downloadUrl: '/legacy/preview.jpg' }
      }
      expect(getProductImage(product)).toBe('https://cloudinary.com/preferred.jpg')
    })

    it('prefers PROPERTY_44 over PREVIEW_PICTURE and DETAIL_PICTURE', () => {
      const product = {
        NAME: 'Test Product',
        PROPERTY_44: { showUrl: '/property44/image.jpg' },
        PREVIEW_PICTURE: { downloadUrl: '/preview/image.jpg' },
        DETAIL_PICTURE: { showUrl: '/detail/image.jpg' }
      }
      expect(getProductImage(product)).toContain('property44')
    })

    it('prefers PREVIEW_PICTURE over DETAIL_PICTURE', () => {
      const product = {
        NAME: 'Test Product',
        PREVIEW_PICTURE: { downloadUrl: '/preview/image.jpg' },
        DETAIL_PICTURE: { showUrl: '/detail/image.jpg' }
      }
      expect(getProductImage(product)).toContain('preview')
    })

    it('handles product with only NAME property', () => {
      const product = { NAME: 'Minimal Product' }
      expect(getProductImage(product)).toBe('/images/placeholder.png')
    })

    it('encodes Bitrix URL parameters correctly', () => {
      const product = {
        NAME: 'Test Product',
        PROPERTY_44: {
          showUrl: '/upload/image with spaces.jpg'
        }
      }
      const result = getProductImage(product)
      // The URL should be encoded (spaces become %20)
      expect(result).toContain('%20')
      expect(result).toContain('image%20with%20spaces')
    })
  })
})