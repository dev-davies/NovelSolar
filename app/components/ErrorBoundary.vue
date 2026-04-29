<template>
  <div v-if="error" class="error-boundary">
    <slot name="fallback" :error="error" :clear-error="clearError">
      <div class="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 class="text-red-800 font-bold mb-2">Something went wrong</h3>
        <p class="text-red-600 text-sm mb-4">{{ error.message || 'An unexpected error occurred.' }}</p>
        <button @click="clearError" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-medium">
          Try Again
        </button>
      </div>
    </slot>
  </div>
  <slot v-else></slot>
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'

const error = ref<Error | null>(null)

onErrorCaptured((err) => {
  error.value = err as Error
  return false
})

const clearError = () => {
  error.value = null
}
</script>
