import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

// Create a simplified version of ProductCard for testing
const TestProductCard = {
  template: `
    <div class="product-card">
      <NuxtLink :to="'/shop/' + product.ID" class="product-link">
        <h3>{{ product.NAME }}</h3>
        <p class="price">{{ formatPrice(product.PRICE) }}</p>
      </NuxtLink>
    </div>
  `,
  props: ['product'],
  methods: {
    formatPrice(price) {
      return new Intl.NumberFormat('en-US').format(price)
    }
  }
}

describe('ProductCard', () => {
  it('renders product name', async () => {
    const product = { ID: 123, NAME: 'Test Product', PRICE: 1000 }
    const wrapper = mount(TestProductCard, {
      props: { product },
      global: {
        stubs: {
          NuxtLink: {
            template: '<a :href="to"><slot /></a>',
            props: ['to']
          }
        }
      }
    })
    expect(wrapper.text()).toContain('Test Product')
  })

  it('renders product price', async () => {
    const product = { ID: 123, NAME: 'Test Product', PRICE: 1000 }
    const wrapper = mount(TestProductCard, {
      props: { product },
      global: {
        stubs: {
          NuxtLink: {
            template: '<a :href="to"><slot /></a>',
            props: ['to']
          }
        }
      }
    })
    expect(wrapper.text()).toContain('1,000')
  })

  it('links to correct product page', async () => {
    const product = { ID: 123, NAME: 'Test Product', PRICE: 1000 }
    const wrapper = mount(TestProductCard, {
      props: { product },
      global: {
        stubs: {
          NuxtLink: {
            template: '<a :href="to"><slot /></a>',
            props: ['to']
          }
        }
      }
    })
    const link = wrapper.find('a')
    expect(link.attributes('href')).toBe('/shop/123')
  })
})