<template>
  <div class="pb-20 bg-slate-50 min-h-screen">
    <header class="max-w-7xl mx-auto px-4 md:px-6 pt-8 mb-4">
      <h1 class="text-3xl font-bold text-slate-900 mb-2">Inventory Hub</h1>
      <p class="text-slate-500 text-sm md:text-base">Ready for immediate dispatch.</p>
    </header>

    <div class="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row gap-8">
      <aside class="w-full md:w-64 shrink-0 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit">
        <button @click="showMobileFilters = !showMobileFilters" class="md:hidden w-full flex items-center justify-between font-bold text-slate-900 mb-2">
          <span class="flex items-center gap-2">
            <span class="material-symbols-outlined">tune</span> Filters & Search
          </span>
          <span class="material-symbols-outlined">{{ showMobileFilters ? 'expand_less' : 'expand_more' }}</span>
        </button>

        <div :class="{ 'hidden md:block': !showMobileFilters, 'block': showMobileFilters }" class="mt-6 md:mt-0 space-y-8 transition-all">
          <div>
            <h3 class="font-bold text-slate-900 mb-3 text-sm uppercase tracking-wider">Search</h3>
            <input v-model="searchQuery" type="text" placeholder="Search..." class="w-full rounded-xl border-slate-200 bg-slate-50 focus:ring-2 focus:ring-[#002888]/20 focus:border-[#002888] p-3 outline-none" />
          </div>

          <div>
            <h3 class="font-bold text-slate-900 mb-3 text-sm uppercase tracking-wider">Categories</h3>
            <div class="space-y-3">
              <label class="flex items-center gap-3 cursor-pointer group">
                <input type="radio" v-model="selectedCategory" value="all" class="w-4 h-4 text-[#002888] border-slate-300 focus:ring-[#002888]">
                <span class="text-slate-700 font-medium group-hover:text-[#002888]">All Products</span>
              </label>
              <label v-for="cat in categories" :key="cat.id" class="flex items-center gap-3 cursor-pointer group">
                <input type="radio" v-model="selectedCategory" :value="cat.id" class="w-4 h-4 text-[#002888] border-slate-300 focus:ring-[#002888]">
                <span class="text-slate-700 font-medium group-hover:text-[#002888]">{{ cat.name }}</span>
              </label>
            </div>
          </div>

          <div>
            <h3 class="font-bold text-slate-900 mb-3 text-sm uppercase tracking-wider flex justify-between">
              Max Price <span class="text-[#002888]">₦{{ Number(maxPrice).toLocaleString() }}</span>
            </h3>
            <input v-model="maxPrice" type="range" min="0" max="2000000" step="50000" class="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#002888]" />
          </div>

          <button v-if="isFilterActive" @click="clearFilters" class="w-full py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors">
            Clear Filters
          </button>
        </div>
      </aside>

      <main class="flex-1 min-w-0">
        <div v-if="pending" class="text-center py-24 bg-white rounded-3xl border border-slate-100">
          <span class="material-symbols-outlined text-4xl text-[#002888] animate-pulse">package_2</span>
          <h3 class="font-bold mt-2">Loading inventory...</h3>
        </div>

        <div v-else-if="!isFilterActive" class="space-y-10">
          <div v-if="categorySections.length > 0">
            <div v-for="category in categorySections" :key="category.id">
              <div class="flex items-center justify-between mb-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <h2 class="text-lg md:text-xl font-bold text-slate-900">{{ category.name }}</h2>
                <button @click="selectCategoryAndScroll(category.id)" class="text-sm font-bold text-[#002888] flex items-center gap-1 hover:underline">
                  See All <span class="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
              <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                <ProductCard v-for="product in category.products" :key="product.ID" :product="product" />
              </div>
            </div>
          </div>
          <div v-else>
            <div class="flex items-center justify-between mb-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
              <h2 class="text-lg md:text-xl font-bold text-slate-900">All Products</h2>
            </div>
            <div v-if="fallbackProducts.length === 0" class="text-center py-24 bg-white rounded-3xl border border-slate-100">
              <span class="material-symbols-outlined text-6xl text-slate-300">inventory_2</span>
              <h3 class="font-bold mt-2">No products available</h3>
              <p class="text-slate-500 text-sm">Please check back shortly or try again later.</p>
            </div>
            <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
              <ProductCard v-for="product in fallbackProducts" :key="product.ID" :product="product" />
            </div>
          </div>
        </div>

        <div v-else>
          <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-slate-200 gap-2">
            <h2 class="text-xl font-bold text-slate-900">{{ selectedCategory === 'all' ? 'Search Results' : categories.find(c => c.id === selectedCategory)?.name }}</h2>
            <span class="bg-blue-100 text-[#002888] px-3 py-1 rounded-full text-xs font-black self-start sm:self-auto">{{ matchingProducts.length }} Results</span>
          </div>

          <div v-if="matchingProducts.length === 0" class="text-center py-24 bg-white rounded-3xl border border-slate-100">
            <span class="material-symbols-outlined text-6xl text-slate-300">inventory_2</span>
            <h3 class="font-bold mt-2">No products found</h3>
            <p class="text-slate-500 text-sm">Try adjusting your filters or price range.</p>
          </div>

          <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            <ProductCard v-for="product in displayedProducts" :key="product.ID" :product="product" />
          </div>

          <div v-if="matchingProducts.length > displayedProducts.length" class="mt-8 flex justify-center">
            <button @click="displayLimit += 50" class="px-8 py-3 bg-white border-2 border-[#002888] text-[#002888] font-bold rounded-xl hover:bg-slate-50 transition-colors">
              Load More
            </button>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { excludeServiceProducts } from '~/utils/productFilters'
import { watch, computed, ref } from 'vue'

// Updated to include ALL categories from the ecosystem
const categories = [
  { id: 'solar-panels', name: 'Solar Panels', SECTION_ID: 1 },
  { id: 'inverters', name: 'Inverters', SECTION_ID: 2 },
  { id: 'batteries', name: 'Batteries', SECTION_ID: 3 },
  { id: 'charge-controllers', name: 'Charge Controllers', SECTION_ID: 4 },
  { id: 'lighting', name: 'Lighting', SECTION_ID: 5 },
  { id: 'power-banks', name: 'Power Banks', SECTION_ID: 6 },
  { id: 'accessories', name: 'Accessories', SECTION_ID: 7 }
]

const { data: apiProducts, pending } = useFetch('/api/inventory')

const normalizeSectionId = (value) => (value === null || value === undefined ? '' : String(value).trim())

const getProductsArray = () => {
  if (!apiProducts.value) return []
  if (Array.isArray(apiProducts.value.data)) return excludeServiceProducts(apiProducts.value.data)
  if (Array.isArray(apiProducts.value.result)) return excludeServiceProducts(apiProducts.value.result)
  if (Array.isArray(apiProducts.value)) return excludeServiceProducts(apiProducts.value)
  return []
}

const getCategorySectionId = (categoryId) => {
  const sectionId = categories.find(c => c.id === categoryId)?.SECTION_ID
  return normalizeSectionId(sectionId)
}

const searchQuery = ref('')
const selectedCategory = ref('all')
const maxPrice = ref(2000000)
const displayLimit = ref(50)
const showMobileFilters = ref(false)

// Determine if the user is actively using any filters
const isFilterActive = computed(() => {
  return searchQuery.value !== '' || selectedCategory.value !== 'all' || maxPrice.value < 2000000
})

const clearFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = 'all'
  maxPrice.value = 2000000
  showMobileFilters.value = false
}

// The "See All" button magic: Applies filter and scrolls top natively
const selectCategoryAndScroll = (catId) => {
  selectedCategory.value = catId
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const matchingProducts = computed(() => {
  const products = getProductsArray()
  if (products.length === 0) return []
  return products.filter(product => {
    const productName = product.NAME || product.name || ''
    const matchesSearch = productName.toLowerCase().includes(searchQuery.value.toLowerCase())
    const targetSection = getCategorySectionId(selectedCategory.value)
    const matchesCategory = selectedCategory.value === 'all' || normalizeSectionId(product.SECTION_ID) === targetSection
    const rawPrice = product.PRICE || product.price || 0
    const matchesPrice = Number(rawPrice) <= maxPrice.value
    return matchesSearch && matchesCategory && matchesPrice
  })
})

const displayedProducts = computed(() => matchingProducts.value.slice(0, displayLimit.value))

watch([searchQuery, selectedCategory, maxPrice], () => {
  displayLimit.value = 50
})

const getProductsForCategory = (categoryId) => {
  const products = getProductsArray()
  const targetSectionId = getCategorySectionId(categoryId)
  return products.filter(p => normalizeSectionId(p.SECTION_ID) === targetSectionId).slice(0, 4)
}

const categorySections = computed(() => {
  return categories
    .map(category => ({ ...category, products: getProductsForCategory(category.id) }))
    .filter(category => category.products.length > 0)
})

const fallbackProducts = computed(() => getProductsArray().slice(0, 12))

useHead({ title: 'Shop Inventory | NovelSolar' })
</script>
