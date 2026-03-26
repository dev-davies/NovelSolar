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

  // Auto-sanitize any corrupted cart items from older sessions where image was saved as an array
  if (cart.value && Array.isArray(cart.value)) {
    cart.value.forEach((item: any) => {
      if (Array.isArray(item.image) && item.image.length > 0) {
        item.image = item.image[0].value || '/images/placeholder.png';
      } else if (typeof item.image === 'object' && item.image !== null) {
        item.image = item.image.value || item.image.showUrl || '/images/placeholder.png';
      }
    });
  }

  const toggleCart = () => {
    isCartOpen.value = !isCartOpen.value;
  };

  const addToCart = (product: any, qty = 1) => {
    const productId = product.ID || product.id;
    const existingItem = cart.value.find((item: CartItem) => item.id === productId);
    
    if (existingItem) {
      existingItem.quantity += qty;
    } else {
      let finalImage = product.PROPERTY_102 || product.PREVIEW_PICTURE || product.image || '/images/placeholder.png';
      if (Array.isArray(finalImage) && finalImage.length > 0 && finalImage[0].value) {
        finalImage = finalImage[0].value;
      } else if (typeof finalImage === 'object' && finalImage !== null && finalImage.value) {
        finalImage = finalImage.value;
      }
      
      cart.value.push({
        id: productId,
        name: product.NAME || product.name || product.title,
        price: Number(product.PRICE || product.price || 0),
        image: finalImage,
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
