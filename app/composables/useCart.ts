import { useState } from '#app';
import { computed } from 'vue';
import { useLocalStorage } from '@vueuse/core';

export interface CartItem {
  id: string | number;
  name: string;
  price: number;
  image: string | null;
  quantity: number;
}

export const useCart = () => {
  // useLocalStorage safely synchronizes with the browser natively
  const cart = useLocalStorage<CartItem[]>('novel-cart-data', []);
  const isCartOpen = useState<boolean>('novel-cart-open', () => false);

  const toggleCart = () => {
    isCartOpen.value = !isCartOpen.value;
  };

  const addToCart = (product: any, qty = 1) => {
    const productId = product.ID || product.id;
    const existingItem = cart.value.find((item: CartItem) => item.id === productId);
    
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
    isCartOpen.value = true; // Auto-open drawer when adding an item
  };

  const removeFromCart = (productId: string | number) => {
    cart.value = cart.value.filter((item: CartItem) => item.id !== productId);
  };

  const updateQuantity = (productId: string | number, amount: number) => {
    const item = cart.value.find((item: CartItem) => item.id === productId);
    if (item) {
      item.quantity += amount;
      if (item.quantity <= 0) {
        removeFromCart(productId);
      }
    }
  };

  const cartItemCount = computed(() => {
    return cart.value.reduce((total: number, item: CartItem) => total + item.quantity, 0);
  });

  const cartTotalAmount = computed(() => {
    return cart.value.reduce((total: number, item: CartItem) => total + (item.price * item.quantity), 0);
  });

  return { 
    cart, 
    isCartOpen, 
    toggleCart, 
    addToCart, 
    removeFromCart, 
    updateQuantity, 
    cartItemCount, 
    cartTotalAmount 
  };
};
