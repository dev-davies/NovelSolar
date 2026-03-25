<template>
  <div class="min-h-screen bg-gray-50 p-8 lg:p-12">
    <div class="max-w-7xl mx-auto">
      <header class="mb-12">
        <h1 class="text-4xl font-bold text-[#002888] mb-2">All Solar Inventory</h1>
        <p class="text-gray-600">Browse our complete catalog of enterprise-grade solar components.</p>
      </header>

      <!-- Loading State -->
      <div v-if="pending" class="flex flex-col items-center justify-center py-20 text-center">
        <div class="w-12 h-12 border-4 border-[#002888]/20 border-t-[#002888] rounded-full animate-spin mb-4"></div>
        <p class="text-xl text-gray-500 font-medium">Loading complete inventory...</p>
      </div>

      <!-- Product Grid -->
      <div v-else-if="filteredProducts && filteredProducts.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
        <ProductCard v-for="product in filteredProducts" :key="product.ID" :product="product" />
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
        <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <p class="text-xl text-gray-500 font-medium">
          {{ $route.query.q ? `No results found for "${$route.query.q}"` : 'No products currently available.' }}
        </p>
        <p class="text-gray-400 mt-2">Check back later for new arrivals.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const { data: products, pending } = useFetch('/api/inventory')

const filteredProducts = computed(() => {
  if (!products.value) return []
  const searchQuery = route.query.q
  if (!searchQuery) return products.value
  
  const query = searchQuery.toString().toLowerCase()
  return products.value.filter(p => 
    p.NAME.toLowerCase().includes(query)
  )
})

// SEO
useHead({
  title: 'All Solar Inventory | NovelSolar',
  meta: [
    { name: 'description', content: 'Browse our complete catalog of enterprise-grade solar panels, inverters, batteries, and accessories.' }
  ]
})
</script>
