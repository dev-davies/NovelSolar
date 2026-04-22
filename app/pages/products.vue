<template>
  <div class="min-h-screen bg-slate-50 py-12 px-6 lg:px-12">
    <div class="max-w-7xl mx-auto">
      
      <div class="mb-10">
        <h1 class="text-4xl font-black text-[#002888] tracking-tight mb-2">
          {{ activeSearch ? `Search Results for "${activeSearch}"` : 'All Products' }}
        </h1>
        <p class="text-slate-500 font-medium">
          Showing {{ products.length }} of {{ totalProducts }} available items.
        </p>
      </div>

      <div v-if="isFetching" class="flex justify-center py-24">
        <div class="w-12 h-12 border-4 border-[#002888]/20 border-t-[#002888] rounded-full animate-spin"></div>
      </div>

      <div v-else-if="products.length > 0">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ProductCard v-for="product in products" :key="product.ID" :product="product" />
        </div>

        <div v-if="nextOffset !== null" class="mt-16 flex justify-center">
          <button 
            @click="() => fetchProducts(true)" 
            :disabled="isLoadingMore"
            class="bg-white border-2 border-slate-200 text-[#002888] px-10 py-4 rounded-xl font-black hover:border-[#002888] hover:bg-blue-50 transition-all shadow-sm flex items-center gap-3 disabled:opacity-50"
          >
            <span v-if="isLoadingMore" class="animate-spin border-2 border-[#002888]/30 border-t-[#002888] w-5 h-5 rounded-full"></span>
            {{ isLoadingMore ? 'Loading Inventory...' : 'Load Next 50 Items' }}
          </button>
        </div>
      </div>

      <div v-else class="text-center py-24 bg-white rounded-3xl border border-slate-200 shadow-sm">
        <span class="material-symbols-outlined text-6xl text-slate-300 mb-4">search_off</span>
        <h3 class="text-2xl font-black text-slate-900 mb-2">No products found</h3>
        <p class="text-slate-500">We couldn't find any items matching your criteria. Try adjusting your search.</p>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

// Read search query from URL (e.g., /products?q=inverter)
const activeSearch = computed(() => route.query.q || '')

const products = ref([])
const nextOffset = ref(null)
const totalProducts = ref(0)
const isFetching = ref(true)
const isLoadingMore = ref(false)

// Function to fetch products
const fetchProducts = async (isLoadMore = false) => {
  if (isLoadMore) {
    isLoadingMore.value = true
  } else {
    isFetching.value = true
    products.value = []
    nextOffset.value = null
  }

  try {
    const response = await $fetch('/api/products', {
      query: {
        q: activeSearch.value,
        start: isLoadMore ? nextOffset.value : 0
      }
    })

    if (isLoadMore) {
      products.value = [...products.value, ...(response.products || [])]
    } else {
      products.value = response.products || []
    }

    nextOffset.value = response.next || null
    totalProducts.value = response.total || 0
  } catch (error) {
    console.error('Failed to load products:', error)
  } finally {
    isFetching.value = false
    isLoadingMore.value = false
  }
}

// Watch for URL changes (if they search again from the navbar) and refetch
watch(activeSearch, () => {
  fetchProducts(false)
})

// Initial load
onMounted(() => {
  fetchProducts(false)
})

// SEO
useHead({
  title: 'Products | NovelSolar',
  meta: [
    { name: 'description', content: 'Browse our complete catalog of enterprise-grade solar panels, inverters, batteries, and accessories.' }
  ]
})
</script>
