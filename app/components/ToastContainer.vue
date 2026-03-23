<script setup>
import { useToast } from '~/composables/useToast';
import ToastNotification from './ToastNotification.vue';

const { toasts } = useToast();
</script>

<template>
  <!-- Global Toast Overlay -->
  <div class="fixed top-24 right-4 z-[9999] flex flex-col gap-3 pointer-events-none w-80 sm:w-96">
    <TransitionGroup 
      name="toast" 
      tag="div" 
      class="flex flex-col gap-3"
    >
      <ToastNotification 
        v-for="toast in toasts" 
        :key="toast.id" 
        :toast="toast" 
      />
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-move, 
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.95);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.95);
}

.toast-leave-active {
  position: absolute;
  right: 0;
}
</style>
