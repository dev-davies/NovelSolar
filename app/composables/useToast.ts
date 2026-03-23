import { useState } from '#app';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  title: string;
  message: string;
  type: ToastType;
  duration?: number;
}

export const useToast = () => {
  const toasts = useState<Toast[]>('active-toasts', () => []);

  const removeToast = (id: string) => {
    toasts.value = toasts.value.filter(t => t.id !== id);
  };

  const addToast = (title: string, message: string, type: ToastType = 'info', duration = 5000) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 5);
    toasts.value.push({ id, title, message, type, duration });

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  };

  return {
    toasts,
    addToast,
    removeToast
  };
};
