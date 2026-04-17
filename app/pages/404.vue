// filepath: app/pages/404.vue
<template>
  <AppErrorState
    :status-code="404"
    title="Page Not Found"
    message="The page you requested is unavailable. Search the catalog or jump back into the main sections of the site."
    :show-back="true"
    :show-search="true"
    :quick-links="quickLinks"
    @back="goBack"
    @search="handleSearch"
  />
</template>

<script setup lang="ts">
const router = useRouter()
const quickLinks = [
  { label: 'Shop Products', to: '/products' },
  { label: 'Solar Calculator', to: '/calculator' },
  { label: 'Get a Quote', to: '/quote' },
  { label: 'About Us', to: '/about' }
]

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}

const handleSearch = (query: string) => {
  router.push(`/products?search=${encodeURIComponent(query)}`)
}

useSeoMeta({
  title: 'Page Not Found - 404',
  description: 'The page you are looking for does not exist. Browse our solar products or use our calculator to find what you need.',
  ogTitle: 'Page Not Found - 404 | Novel Solar',
  ogDescription: 'The page you are looking for does not exist. Browse our solar products or use our calculator to find what you need.'
})
</script>
