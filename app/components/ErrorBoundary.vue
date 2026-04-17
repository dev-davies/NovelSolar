// filepath: app/components/ErrorBoundary.vue
<template>
  <div v-if="error" class="error-boundary">
    <slot name="fallback" :error="error" :retry="retry" :clear-error="clearError">
      <div class="error-fallback">
        <slot name="icon">
          <div class="error-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
        </slot>

        <slot name="title" :error="error">
          <h2 class="error-title">{{ errorTitle }}</h2>
        </slot>

        <slot name="message" :error="error">
          <p class="error-message">{{ errorMessage }}</p>
        </slot>

        <slot name="actions" :error="error" :retry="retry">
          <div class="error-actions">
            <button v-if="canRetry" type="button" @click="retry" class="btn-retry">
              Try Again
            </button>
            <NuxtLink to="/" class="btn-home">
              Go Home
            </NuxtLink>
          </div>
        </slot>
      </div>
    </slot>
  </div>
  <slot v-else />
</template>

<script setup lang="ts">
import type { ErrorInfo } from 'vue'
import { useErrorLogger } from '~/composables/useErrorLogger'

type BoundaryError = Error & {
  statusCode?: number
  statusMessage?: string
  cause?: unknown
}

interface Props {
  fallback?: boolean
  logErrors?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  fallback: true,
  logErrors: true
})

const emit = defineEmits<{
  error: [error: BoundaryError]
  retry: []
}>()

const { trackVueError } = useErrorLogger()
const error = ref<BoundaryError | null>(null)
const errorInfo = ref<string>('')

const errorTitle = computed(() => {
  if (!error.value) return ''
  if (error.value.statusCode === 404 || error.value.message.includes('404')) return 'Page Not Found'
  if ((error.value.statusCode ?? 0) >= 500 || error.value.message.includes('500')) return 'Server Error'
  if (error.value.message.toLowerCase().includes('network')) return 'Connection Error'
  return 'Something Went Wrong'
})

const errorMessage = computed(() => {
  if (!error.value) return ''
  return error.value.statusMessage || error.value.message || 'An unexpected error occurred. Please try again.'
})

const canRetry = computed(() => {
  if (!error.value) return false
  return error.value.statusCode !== 404 && !error.value.message.includes('404')
})

const retry = () => {
  error.value = null
  errorInfo.value = ''
  emit('retry')
}

const handleError = (err: unknown, info: string) => {
  const normalizedError = err instanceof Error ? err as BoundaryError : new Error(String(err ?? 'Unknown error')) as BoundaryError

  if (error.value?.message === normalizedError.message && errorInfo.value === info) {
    return false
  }

  error.value = normalizedError
  errorInfo.value = info
  emit('error', normalizedError)

  if (props.logErrors) {
    void trackVueError(normalizedError, info)
  }

  return false
}

onErrorCaptured((err, instance, info) => {
  const componentName =
    instance?.type && typeof instance.type !== 'string'
      ? instance.type.name || instance.type.__name || 'AnonymousComponent'
      : typeof instance?.type === 'string'
        ? instance.type
        : 'UnknownComponent'

  const details = `${info} in ${componentName}`
  return handleError(err, details)
})

const setError = (err: BoundaryError, info = 'manual') => {
  error.value = err
  errorInfo.value = info
}

const clearError = () => {
  error.value = null
  errorInfo.value = ''
}

defineExpose({
  setError,
  clearError,
  error,
  retry
})
</script>

<style scoped>
.error-boundary {
  min-height: 200px;
}

.error-fallback {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
  text-align: center;
}

.error-icon {
  color: #9ca3af;
  margin-bottom: 1.5rem;
}

.error-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.75rem;
}

.error-message {
  color: #6b7280;
  max-width: 400px;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.error-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.btn-retry,
.btn-home {
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.btn-retry {
  background-color: #002888;
  color: white;
  border: none;
}

.btn-retry:hover {
  background-color: #001f6b;
}

.btn-home {
  background-color: white;
  color: #002888;
  border: 1px solid #002888;
}

.btn-home:hover {
  background-color: #f3f4f6;
}
</style>
