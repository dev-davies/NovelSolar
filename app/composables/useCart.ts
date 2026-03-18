import { useState } from '#app';
import { computed } from 'vue';

export const useCart = () => {
  const cart = useState<any[]>('novel-cart', () => []);
  const isCartOpen = useState<boolean>('novel-cart-open', () => false);

  const saveCart = () => {
    if (import.meta.client) {
      localStorage.setItem('novel-cart-data', JSON.stringify(cart.value));
    }
  };

  const loadCart = () => {
    if (import.meta.client) {
      const savedCart = localStorage.getItem('novel-cart-data');
      if (savedCart) {
        try {
          cart.value = JSON.parse(savedCart);
        } catch (e) {
          console.error('Failed to parse cart data:', e);
          cart.value = [];
        }
      }
    }
  };

  const toggleCart = () => {
    isCartOpen.value = !isCartOpen.value;
  };

  const addToCart = (product: any, qty = 1) => {
    const productId = product.ID || product.id;
    const existingItem = cart.value.find(item => item.id === productId);
    
    if (existingItem) {
      existingItem.quantity += qty;
    } else {
      cart.value.push({
        id: productId,
        name: product.NAME || product.name || product.title,
        price: Number(product.PRICE || product.price || 0),
        image: product.image || null,
        quantity: qty
      });
    }
    saveCart();
    isCartOpen.value = true; // Auto-open drawer when adding an item
  };

  const removeFromCart = (productId: string | number) => {
    cart.value = cart.value.filter(item => item.id !== productId);
    saveCart();
  };

  const updateQuantity = (productId: string | number, amount: number) => {
    const item = cart.value.find(item => item.id === productId);
    if (item) {
      item.quantity += amount;
      if (item.quantity <= 0) {
        removeFromCart(productId);
      } else {
        saveCart();
      }
    }
  };

  const cartItemCount = computed(() => {
    return cart.value.reduce((total, item) => total + item.quantity, 0);
  });

  const cartTotalAmount = computed(() => {
    return cart.value.reduce((total, item) => total + (item.price * item.quantity), 0);
  });

  return { 
    cart, 
    isCartOpen, 
    loadCart, 
    toggleCart, 
    addToCart, 
    removeFromCart, 
    updateQuantity, 
    cartItemCount, 
    cartTotalAmount 
  };
};
