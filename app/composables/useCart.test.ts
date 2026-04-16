import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.localStorage = localStorageMock

// Mock dependencies
vi.mock('@vueuse/core', () => ({
  useLocalStorage: vi.fn(() => ref([]))
}))

vi.mock('#app', () => ({
  useState: vi.fn(() => ref(false))
}))

// Import after mocks
import { useCart } from './useCart'
import { ref } from 'vue'

describe('useCart', () => {
  beforeEach(() => {
    // Clear mocks
    vi.clearAllMocks()
    localStorageMock.clear()
  })

  it('adds item to cart', () => {
    const { cart, addToCart } = useCart()
    const product = { ID: 1, NAME: 'Test Product', PRICE: 100 }

    addToCart(product)

    expect(cart.value).toHaveLength(1)
    expect(cart.value[0]).toMatchObject({
      id: 1,
      name: 'Test Product',
      price: 100,
      quantity: 1
    })
  })

  it('increments quantity for existing item', () => {
    const { cart, addToCart } = useCart()
    const product = { ID: 1, NAME: 'Test Product', PRICE: 100 }

    addToCart(product)
    addToCart(product)

    expect(cart.value).toHaveLength(1)
    expect(cart.value[0].quantity).toBe(2)
  })

  it('removes item from cart', () => {
    const { cart, addToCart, removeFromCart } = useCart()
    const product = { ID: 1, NAME: 'Test Product', PRICE: 100 }

    addToCart(product)
    expect(cart.value).toHaveLength(1)

    removeFromCart(1)
    expect(cart.value).toHaveLength(0)
  })

  it('updates quantity', () => {
    const { cart, addToCart, updateQuantity } = useCart()
    const product = { ID: 1, NAME: 'Test Product', PRICE: 100 }

    addToCart(product)
    updateQuantity(1, 2)

    expect(cart.value[0].quantity).toBe(3)
  })

  it('removes item when quantity becomes zero', () => {
    const { cart, addToCart, updateQuantity } = useCart()
    const product = { ID: 1, NAME: 'Test Product', PRICE: 100 }

    addToCart(product)
    updateQuantity(1, -1)

    expect(cart.value).toHaveLength(0)
  })

  it('calculates cart item count', () => {
    const { cartItemCount, addToCart } = useCart()
    const product1 = { ID: 1, NAME: 'Product 1', PRICE: 100 }
    const product2 = { ID: 2, NAME: 'Product 2', PRICE: 200 }

    addToCart(product1, 2)
    addToCart(product2, 3)

    expect(cartItemCount.value).toBe(5)
  })

  it('calculates cart total amount', () => {
    const { cartTotalAmount, addToCart } = useCart()
    const product1 = { ID: 1, NAME: 'Product 1', PRICE: 100 }
    const product2 = { ID: 2, NAME: 'Product 2', PRICE: 200 }

    addToCart(product1, 2)
    addToCart(product2, 1)

    expect(cartTotalAmount.value).toBe(400)
  })
})