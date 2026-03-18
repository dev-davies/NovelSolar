import { useState } from '#app';
import { computed } from 'vue';

export const useCart = () => {
  const cart = useState<any[]>('novel-cart', () => []);

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

  const addToCart = (product: any) => {
    const productId = product.ID || product.id;
    const existingItem = cart.value.find(item => item.id === productId);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.value.push({
        id: productId,
        name: product.NAME || product.name || product.title,
        price: Number(product.PRICE || product.price || 0),
        image: product.image || null,
        quantity: 1
      });
    }
    
    if (import.meta.client) {
      localStorage.setItem('novel-cart-data', JSON.stringify(cart.value));
    }
  };

  const cartItemCount = computed(() => {
    return cart.value.reduce((total, item) => total + item.quantity, 0);
  });

  const cartTotal = computed(() => {
    return cart.value.reduce((total, item) => total + (item.price * item.quantity), 0);
  });

  return { 
    cart, 
    addToCart, 
    loadCart, 
    cartItemCount,
    cartTotal
  };
};
