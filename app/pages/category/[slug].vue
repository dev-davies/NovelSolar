<template>
  <div class="min-h-screen bg-gray-50 p-8 lg:p-12">
    <div class="max-w-7xl mx-auto">
      <header class="mb-8">
        <div class="flex items-center gap-2 text-sm text-gray-400 mb-4">
          <NuxtLink to="/" class="hover:text-primary transition-colors">Home</NuxtLink>
          <span>/</span>
          <NuxtLink to="/products" class="hover:text-primary transition-colors">Products</NuxtLink>
          <span>/</span>
          <span class="text-gray-900 font-medium capitalize">{{ categoryName }}</span>
        </div>
        <h1 class="text-4xl font-bold text-[#002888] capitalize mb-2">{{ categoryName }} Inventory</h1>
        <p class="text-gray-600">Browse our selection of {{ categoryName }} components for your solar projects.</p>
      </header>

      <!-- Sub-category Filters -->
      <div v-if="subCategories.length > 0" class="flex flex-wrap gap-2 mb-10">
        <button 
          @click="activeSubCategory = 'All'"
          class="px-5 py-2 rounded-full text-sm font-bold transition-all border"
          :class="activeSubCategory === 'All' ? 'bg-[#002888] text-white border-[#002888]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#002888] hover:text-[#002888]'"
        >
          All
        </button>
        <button 
          v-for="sub in subCategories" 
          :key="sub"
          @click="activeSubCategory = sub"
          class="px-5 py-2 rounded-full text-sm font-bold transition-all border"
          :class="activeSubCategory === sub ? 'bg-[#002888] text-white border-[#002888]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#002888] hover:text-[#002888]'"
        >
          {{ sub }}
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="pending" class="flex flex-col items-center justify-center py-20 text-center">
        <div class="w-12 h-12 border-4 border-[#002888]/20 border-t-[#002888] rounded-full animate-spin mb-4"></div>
        <p class="text-xl text-gray-500 font-medium">Loading {{ categoryName }} inventory...</p>
      </div>

      <!-- Product Grid -->
      <div v-else-if="filteredProducts.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
        <ProductCard v-for="product in filteredProducts" :key="product.ID" :product="product" />
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
        <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <p class="text-xl text-gray-500 font-medium">No products currently found in the {{ categoryName }} category.</p>
        <p class="text-gray-400 mt-2">Try browsing our <NuxtLink to="/products" class="text-primary hover:underline">entire inventory</NuxtLink> instead.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const categoryName = computed(() => route.params.slug.replace(/-/g, ' '))

const activeSubCategory = ref('All')

const categorySubMap = {
  'solar-panels': ['Regular', 'Half Cut'],
  'inverters': ['Hybrid', 'Regular', 'Solar Generator'],
  'batteries': ['Lithium', 'Tubular', 'Dry Cell'],
  'charge-controllers': ['MPPT', 'PWM'],
  'accessories': []
}

const subCategories = computed(() => categorySubMap[route.params.slug] || [])

const { data: products, pending } = useFetch('/api/inventory')

const filteredProducts = computed(() => {
  if (!products.value) return []
  
  const slug = route.params.slug.toLowerCase()
  const formattedSlug = slug.replace(/-/g, ' ')
  
  // Define keywords that belong to other specific categories to isolate 'accessories'
  const mainCategoryKeywords = [
    'regular', 'half cut', 'hybrid', 'solar generator', 
    'lithium', 'tubular', 'dry cell', 'mppt', 'pwm'
  ]
  
  let result = products.value.filter(p => {
    const productName = p.NAME.toLowerCase()
    
    if (slug === 'accessories') {
      return !mainCategoryKeywords.some(keyword => productName.includes(keyword))
    } else if (slug === 'solar-panels') {
      return productName.includes('panel') || productName.includes('pv')
    } else {
      return productName.includes(formattedSlug) || productName.includes(slug)
    }
  })

  // Apply sub-category filter
  if (activeSubCategory.value !== 'All') {
    const subQuery = activeSubCategory.value.toLowerCase()
    
    // Helper to identify half-cut panels
    const isHalfCut = (name) => {
      const n = name.toLowerCase()
      return n.includes('half cut') || n.includes('half-cut') || n.includes('halfcut')
    }

    if (slug === 'solar-panels') {
      if (subQuery === 'regular') {
        result = result.filter(p => !isHalfCut(p.NAME))
      } else if (subQuery === 'half cut') {
        result = result.filter(p => isHalfCut(p.NAME))
      } else {
        result = result.filter(p => p.NAME.toLowerCase().includes(subQuery))
      }
    } else {
      result = result.filter(p => p.NAME.toLowerCase().includes(subQuery))
    }
  }

  return result
})

const { addToCart } = useCart()
const buyNow = (product) => {
  addToCart(product)
  navigateTo('/checkout')
}

useHead({
  title: `${categoryName.value.toUpperCase()} | NovelSolar`,
  meta: [
    { name: 'description', content: `Browse our professional range of ${categoryName.value} solar components.` }
  ]
})
</script>
