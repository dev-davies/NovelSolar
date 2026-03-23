<script setup lang="ts">
import { computed } from 'vue';
import { useToast } from '~/composables/useToast';

const props = defineProps<{
  toast: {
    id: string;
    title: string;
    message: string;
    type: 'success' | 'error' | 'info';
  }
}>();

const { removeToast } = useToast();

const iconName = computed(() => {
  switch (props.toast.type) {
    case 'success': return 'check_circle';
    case 'error': return 'error';
    case 'info': return 'info';
    default: return 'notifications';
  }
});

const colors = computed(() => {
  switch (props.toast.type) {
    case 'success': return 'bg-white border-green-500 text-green-700 shadow-green-500/10';
    case 'error': return 'bg-white border-red-500 text-red-700 shadow-red-500/10';
    case 'info': return 'bg-white border-blue-500 text-[#002888] shadow-blue-500/10';
    default: return 'bg-white border-gray-500 text-gray-700';
  }
});

const iconColor = computed(() => {
  switch (props.toast.type) {
    case 'success': return 'text-green-500';
    case 'error': return 'text-red-500';
    case 'info': return 'text-[#002888]';
    default: return 'text-gray-500';
  }
});
</script>

<template>
  <div 
    class="flex items-start gap-3 w-80 sm:w-96 shadow-lg rounded-xl p-4 border-l-4 pointer-events-auto overflow-hidden bg-white"
    :class="colors"
  >
    <div class="shrink-0 mt-0.5">
      <span class="material-symbols-outlined text-2xl" :class="iconColor">{{ iconName }}</span>
    </div>
    <div class="flex-1 min-w-0 pt-0.5">
      <h4 class="text-sm font-bold text-slate-900 line-clamp-1">{{ toast.title }}</h4>
      <p class="text-xs text-slate-600 mt-1 leading-snug">{{ toast.message }}</p>
    </div>
    <button 
      @click="removeToast(toast.id)" 
      class="shrink-0 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-100"
      aria-label="Close notification"
    >
      <span class="material-symbols-outlined text-sm">close</span>
    </button>
  </div>
</template>
