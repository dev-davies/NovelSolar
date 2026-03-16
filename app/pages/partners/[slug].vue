<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="bg-white p-12 rounded-2xl shadow-xl border border-gray-100 text-center max-w-lg w-full">
      <h1 class="text-3xl font-bold text-[#002888] capitalize mb-6">
        Partner: {{ route.params.slug.replace('-', ' ') }}
      </h1>
      <p class="text-gray-500 text-lg mb-8">
        Detailed partner information coming soon
      </p>
      <NuxtLink to="/" class="text-[#002888] font-semibold hover:underline">
        &larr; Back to Home
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
useHead({
  title: `${route.params.slug.replace(/-/g, ' ').toUpperCase()} | Partner`,
})
</script>
