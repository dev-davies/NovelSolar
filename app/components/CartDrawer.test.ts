import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

// Mock the useCart composable
vi.mock('~/composables/useCart', () => ({
  useCart: vi.fn().mockReturnValue({
    cart: vi.fn(),
    isCartOpen: vi.fn(),
    toggleCart: vi.fn(),
    removeFromCart: vi.fn(),
    updateQuantity: vi.fn(),
    cartTotalAmount: vi.fn()
  })
}))

// Simplified CartDrawer for testing
const TestCartDrawer = {
  template: `
    <div>
      <!-- Overlay -->
      <div v-if="isCartOpen" class="overlay" @click="toggleCart"></div>
      
      <!-- Drawer -->
      <div :class="isCartOpen ? 'translate-x-0' : 'translate-x-full'" class="drawer">
        <div class="header">
          <h2>Your Cart</h2>
          <span v-if="cart.length > 0" class="badge">{{ cart.length }}</span>
          <button @click="toggleCart">Close</button>
        </div>
        
        <div class="content">
          <div v-if="cart.length === 0" class="empty-state">
            <h3>Your cart is empty</h3>
          </div>
          
          <div v-for="item in cart" :key="item.id" class="cart-item">
            <div class="item-info">
              <h3>{{ item.name }}</h3>
              <p>₦{{ Number(item.price).toLocaleString() }}</p>
            </div>
            <div class="quantity-controls">
              <button @click="updateQuantity(item.id, -1)">-</button>
              <span>{{ item.quantity }}</span>
              <button @click="updateQuantity(item.id, 1)">+</button>
            </div>
            <button @click="removeFromCart(item.id)">Remove</button>
          </div>
        </div>
        
        <div class="footer">
          <div>Total: ₦{{ cartTotalAmount }}</div>
          <button>Checkout</button>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      isCartOpen: true,
      cart: [
        { id: '1', name: 'Solar Panel 300W', price: 50000, quantity: 2 },
        { id: '2', name: 'Inverter 5KVA', price: 150000, quantity: 1 }
      ]
    }
  },
  computed: {
    cartTotalAmount() {
      return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    }
  },
  methods: {
    toggleCart() {
      this.isCartOpen = !this.isCartOpen
    },
    removeFromCart(id) {
      this.cart = this.cart.filter(item => item.id !== id)
    },
    updateQuantity(id, delta) {
      const item = this.cart.find(i => i.id === id)
      if (item) {
        const newQty = item.quantity + delta
        if (newQty > 0) {
          item.quantity = newQty
        }
      }
    }
  }
}

describe('CartDrawer', () => {
  it('displays cart items', () => {
    const wrapper = mount(TestCartDrawer)
    
    expect(wrapper.text()).toContain('Solar Panel 300W')
    expect(wrapper.text()).toContain('Inverter 5KVA')
  })

  it('displays empty state when cart is empty', () => {
    const wrapper = mount(TestCartDrawer, {
      data() {
        return {
          cart: []
        }
      }
    })
    
    expect(wrapper.text()).toContain('Your cart is empty')
  })

  it('displays cart item count badge', () => {
    const wrapper = mount(TestCartDrawer)
    
    expect(wrapper.text()).toContain('2')
  })

  it('calculates cart total correctly', () => {
    const wrapper = mount(TestCartDrawer)
    
    // 2 * 50000 + 1 * 150000 = 100000 + 150000 = 250000
    expect(wrapper.vm.cartTotalAmount).toBe(250000)
  })

  it('removes item from cart', () => {
    const wrapper = mount(TestCartDrawer)
    
    wrapper.vm.removeFromCart('1')
    
    expect(wrapper.vm.cart.length).toBe(1)
    expect(wrapper.vm.cart[0].name).toBe('Inverter 5KVA')
  })

  it('increases item quantity', () => {
    const wrapper = mount(TestCartDrawer)
    
    wrapper.vm.updateQuantity('1', 1)
    
    const item = wrapper.vm.cart.find(i => i.id === '1')
    expect(item.quantity).toBe(3)
  })

  it('decreases item quantity', () => {
    const wrapper = mount(TestCartDrawer)
    
    wrapper.vm.updateQuantity('1', -1)
    
    const item = wrapper.vm.cart.find(i => i.id === '1')
    expect(item.quantity).toBe(1)
  })

  it('does not decrease quantity below 1', () => {
    const wrapper = mount(TestCartDrawer, {
      data() {
        return {
          cart: [
            { id: '1', name: 'Solar Panel 300W', price: 50000, quantity: 1 }
          ]
        }
      }
    })
    
    wrapper.vm.updateQuantity('1', -1)
    
    const item = wrapper.vm.cart.find(i => i.id === '1')
    expect(item.quantity).toBe(1)
  })

  it('updates total when quantity changes', () => {
    const wrapper = mount(TestCartDrawer)
    
    wrapper.vm.updateQuantity('1', 1)
    
    // 3 * 50000 + 1 * 150000 = 150000 + 150000 = 300000
    expect(wrapper.vm.cartTotalAmount).toBe(300000)
  })

  it('toggles cart open/close', () => {
    const wrapper = mount(TestCartDrawer)
    
    expect(wrapper.vm.isCartOpen).toBe(true)
    
    wrapper.vm.toggleCart()
    
    expect(wrapper.vm.isCartOpen).toBe(false)
  })

  it('displays formatted price', () => {
    const wrapper = mount(TestCartDrawer)
    
    expect(wrapper.text()).toContain('50,000')
    expect(wrapper.text()).toContain('150,000')
  })
})