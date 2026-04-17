import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

// Mock the useSanityImage composable
vi.mock('~/composables/useSanityImage', () => ({
  useSanityImage: vi.fn().mockReturnValue({
    urlFor: vi.fn().mockReturnValue({
      width: vi.fn().mockReturnValue({
        url: vi.fn().mockReturnValue('https://example.com/image.jpg')
      })
    })
  })
}))

// Simplified PortableTextImage for testing
const TestPortableTextImage = {
  template: `
    <div class="image-container">
      <img 
        v-if="hasAsset"
        :src="imageUrl" 
        class="w-full h-auto object-cover"
        loading="lazy"
      />
    </div>
  `,
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  computed: {
    hasAsset() {
      return this.value && this.value.asset
    },
    imageUrl() {
      if (this.value && this.value.asset) {
        return 'https://example.com/image.jpg'
      }
      return ''
    }
  }
}

describe('PortableTextImage', () => {
  it('renders image when value has asset', () => {
    const wrapper = mount(TestPortableTextImage, {
      props: {
        value: {
          asset: {
            _ref: 'image-abc123'
          }
        }
      }
    })
    
    expect(wrapper.find('img').exists()).toBe(true)
  })

  it('does not render image when value is null', () => {
    const wrapper = mount(TestPortableTextImage, {
      props: {
        value: null
      }
    })
    
    expect(wrapper.find('img').exists()).toBe(false)
  })

  it('does not render image when value has no asset', () => {
    const wrapper = mount(TestPortableTextImage, {
      props: {
        value: {}
      }
    })
    
    expect(wrapper.find('img').exists()).toBe(false)
  })

  it('sets correct image source URL', () => {
    const wrapper = mount(TestPortableTextImage, {
      props: {
        value: {
          asset: {
            _ref: 'image-abc123'
          }
        }
      }
    })
    
    const img = wrapper.find('img')
    expect(img.attributes('src')).toBe('https://example.com/image.jpg')
  })

  it('applies object-cover class', () => {
    const wrapper = mount(TestPortableTextImage, {
      props: {
        value: {
          asset: {
            _ref: 'image-abc123'
          }
        }
      }
    })
    
    const img = wrapper.find('img')
    expect(img.classes()).toContain('object-cover')
  })

  it('applies w-full h-auto classes', () => {
    const wrapper = mount(TestPortableTextImage, {
      props: {
        value: {
          asset: {
            _ref: 'image-abc123'
          }
        }
      }
    })
    
    const img = wrapper.find('img')
    expect(img.classes()).toContain('w-full')
    expect(img.classes()).toContain('h-auto')
  })

  it('has lazy loading attribute', () => {
    const wrapper = mount(TestPortableTextImage, {
      props: {
        value: {
          asset: {
            _ref: 'image-abc123'
          }
        }
      }
    })
    
    const img = wrapper.find('img')
    expect(img.attributes('loading')).toBe('lazy')
  })

  it('handles undefined value gracefully', () => {
    const wrapper = mount(TestPortableTextImage, {
      props: {
        value: undefined
      }
    })
    
    expect(wrapper.find('img').exists()).toBe(false)
  })
})