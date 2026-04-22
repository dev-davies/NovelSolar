<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="bg-white p-12 rounded-2xl shadow-xl border border-gray-100 text-center max-w-lg w-full">
      <div class="text-xs font-black text-[#002888] uppercase tracking-widest mb-2 italic">
        {{ route.params.brand }} Partner Portal
      </div>
      <h1 class="text-3xl font-extrabold text-[#002888] capitalize mb-6 tracking-tight">
        {{ route.params.slug.replace(/-/g, ' ') }}
      </h1>
      <p class="text-gray-500 text-lg mb-8 font-medium">
        Information about {{ route.params.slug.replace(/-/g, ' ') }} for our {{ route.params.brand }} ecosystem is being updated.
      </p>
      <NuxtLink :to="'/partners/' + route.params.brand" class="text-[#002888] font-bold hover:underline">
        &larr; Back to {{ route.params.brand.toUpperCase() }} Overview
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
useHead({
  title: `${route.params.slug.replace(/-/g, ' ').toUpperCase()} | ${route.params.brand.toUpperCase()}`,
})
</script>
