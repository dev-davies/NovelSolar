<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <ToastContainer />
</template>

<script setup>
useSeoMeta({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} | Novel Solar` : 'Novel Solar | Premium Components & Engineering';
  },
  ogType: 'website',
  description: 'Sourcing the world\'s best solar components for residential and commercial projects. Instant quotes, high-efficiency panels, and same-day logistics in Nigeria.',
  ogDescription: 'Sourcing the world\'s best solar components for residential and commercial projects. Instant quotes, high-efficiency panels, and same-day logistics in Nigeria.',
  ogImage: 'https://novelsolar.com/images/fallback-post.png', // Fallback social sharing image
  twitterCard: 'summary_large_image',
})
</script>

<style>
body {
  background-color: #f8f6f6;
}
</style>
