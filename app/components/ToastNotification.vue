<script setup lang="ts">
import { computed } from 'vue'
import { useToast } from '~/composables/useToast'

const props = defineProps<{
  toast: {
    id: string
    title: string
    message: string
    type: 'success' | 'error' | 'info'
  }
}>()

const { removeToast } = useToast()

const typeClasses = computed(() => {
  switch (props.toast.type) {
    case 'success': return 'bg-green-50 text-green-800 border-green-200'
    case 'error': return 'bg-red-50 text-red-800 border-red-200'
    case 'info':
    default: return 'bg-blue-50 text-blue-800 border-blue-200'
  }
})

const iconName = computed(() => {
  switch (props.toast.type) {
    case 'success': return 'check_circle'
    case 'error': return 'error'
    case 'info':
    default: return 'info'
  }
})
</script>

<template>
  <div 
    class="flex items-start p-4 mb-3 border rounded-lg shadow-sm transition-all duration-300"
    :class="typeClasses"
    role="alert"
  >
    <span class="material-symbols-outlined mr-3 shrink-0">{{ iconName }}</span>
    <div class="flex-1">
      <h4 v-if="toast.title" class="font-semibold text-sm">{{ toast.title }}</h4>
      <p class="text-sm mt-0.5 opacity-90">{{ toast.message }}</p>
    </div>
    <button @click="removeToast(toast.id)" class="ml-4 opacity-50 hover:opacity-100 transition-opacity">
      <span class="material-symbols-outlined text-lg">close</span>
    </button>
  </div>
</template>
