<template>
  <AppErrorState
    :status-code="statusCode"
    :title="title"
    :message="description"
    :show-retry="statusCode !== 404"
    :show-back="statusCode === 404"
    :show-search="statusCode === 404"
    :quick-links="quickLinks"
    @retry="handleRetry"
    @back="handleBack"
    @search="handleSearch"
  />
</template>

<script setup lang="ts">
const props = defineProps({
  error: {
    type: Object as () => { statusCode?: number; message?: string; statusMessage?: string },
    default: () => ({})
  }
})

const router = useRouter()
const statusCode = computed(() => props.error?.statusCode || 500)
const quickLinks = [
  { label: 'Shop Products', to: '/products' },
  { label: 'Solar Calculator', to: '/calculator' },
  { label: 'Get a Quote', to: '/quote' },
  { label: 'Contact Us', to: '/contact' }
]

const title = computed(() => {
  if (statusCode.value === 404) return 'Page Not Found'
  if (statusCode.value >= 500) return 'We Hit a Temporary Problem'
  return 'Something Went Wrong'
})

const description = computed(() => {
  if (statusCode.value === 404) {
    return props.error?.statusMessage || props.error?.message || "The page you're looking for has been moved, deleted, or doesn't exist in our current grid."
  }

  return props.error?.statusMessage || props.error?.message || 'A server or application error interrupted this request. Please refresh the page or return home.'
})

const handleRetry = () => {
  window.location.reload()
}

const handleBack = () => {
  if (window.history.length > 1) {
    router.back()
    return
  }

  clearError({ redirect: '/' })
}

const handleSearch = (query: string) => {
  clearError({ redirect: `/products?search=${encodeURIComponent(query)}` })
}
</script>
