<template>
  <div class="min-h-screen bg-gray-50 p-8 lg:p-12">
    <div class="max-w-7xl mx-auto">
      <header class="mb-12">
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

      <!-- Loading State -->
      <div v-if="pending" class="flex flex-col items-center justify-center py-20 text-center">
        <div class="w-12 h-12 border-4 border-[#002888]/20 border-t-[#002888] rounded-full animate-spin mb-4"></div>
        <p class="text-xl text-gray-500 font-medium">Loading {{ categoryName }} inventory...</p>
      </div>

      <!-- Product Grid -->
      <div v-else-if="filteredProducts.length > 0" class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div v-for="product in filteredProducts" :key="product.ID" class="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col relative overflow-hidden">
          <!-- In Stock Badge -->
          <div class="absolute top-4 left-4 z-10 px-2.5 py-1 bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-wider rounded-md border border-green-100 shadow-sm">
            In Stock
          </div>

          <!-- Link to Product Detail Page -->
          <NuxtLink :to="'/products/' + product.ID" class="block group/link">
            <div class="aspect-square bg-gray-50 flex items-center justify-center border-b border-gray-50 overflow-hidden transition-opacity duration-300 group-hover/link:opacity-80">
              <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <svg class="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            <div class="px-5 pt-5">
              <h3 class="text-sm font-bold text-gray-900 line-clamp-2 leading-snug group-hover/link:text-blue-800 transition-colors">
                {{ product.NAME }}
              </h3>
            </div>
          </NuxtLink>

          <div class="px-5 pb-5 flex flex-col flex-grow">
            <div class="mt-auto">
              <div class="flex items-baseline gap-1 mb-4">
                <span class="text-lg font-extrabold text-gray-900">{{ product.PRICE }}</span>
                <span class="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{{ product.CURRENCY_ID }}</span>
              </div>
              
              <div class="grid grid-cols-2 gap-2 mt-4">
                <button 
                  class="bg-[#002888] text-white px-4 py-2 rounded-lg text-[11px] font-bold hover:bg-blue-900 transition-colors shadow-sm w-full"
                  @click="buyNow(product)"
                >
                  Buy Now
                </button>
                <NuxtLink :to="'/products/' + product.ID" class="border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-[11px] font-bold hover:bg-gray-50 transition-colors w-full flex items-center justify-center">
                  Specs
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
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

const { data: products, pending } = useFetch('/api/inventory')

const filteredProducts = computed(() => {
  if (!products.value) return []
  
  const slug = route.params.slug.toLowerCase()
  
  // Define keywords that belong to other specific categories
  const mainCategoryKeywords = [
    'regular', 'half cut', 'hybrid', 'solar generator', 
    'lithium', 'tubular', 'dry cell', 'mppt', 'pwm'
  ]
  
  return products.value.filter(p => {
    const productName = p.NAME.toLowerCase()
    
    if (slug === 'accessories') {
      // For accessories, check that the product name doesn't contain any main category keywords
      return !mainCategoryKeywords.some(keyword => productName.includes(keyword))
    } else {
      // Standard filtering for other categories
      const formattedSlug = slug.replace(/-/g, ' ')
      return productName.includes(formattedSlug) || productName.includes(slug)
    }
  })
})

const cart = useState('cart', () => [])
const buyNow = (product) => {
  cart.value = [product]
  navigateTo('/checkout')
}

useHead({
  title: `${categoryName.value.toUpperCase()} | NovelSolar`,
  meta: [
    { name: 'description', content: `Browse our professional range of ${categoryName.value} solar components.` }
  ]
})
</script>
