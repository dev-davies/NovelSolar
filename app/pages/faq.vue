<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <div class="bg-[#002888] py-24 px-4 text-center">
      <h1 class="text-4xl sm:text-5xl font-extrabold text-white mb-6">
        Frequently Asked Questions
      </h1>
      <p class="text-white/80 text-lg max-w-2xl mx-auto">
        Knowledge base coming soon.
      </p>
    </div>

    <div class="max-w-4xl mx-auto px-4 py-16 text-center">
      <div class="bg-white p-12 rounded-3xl shadow-xl border border-gray-100">
        <svg class="w-16 h-16 text-gray-200 mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Under Construction</h2>
        <p class="text-gray-500">
          We're currently building our comprehensive FAQ section. Please check back later or contact us directly if you have urgent questions.
        </p>
        <NuxtLink to="/contact" class="inline-block mt-8 bg-[#002888] text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-900 transition-all">
          Contact Us
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'FAQ | NovelSolar',
  meta: [
    { name: 'description', content: 'Find answers to common questions about NovelSolar products and services.' }
  ]
})
</script>
