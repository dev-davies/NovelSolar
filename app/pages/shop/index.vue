<script setup>
const categories = [
  { id: 'batteries', name: 'Batteries', SECTION_ID: null },
  { id: 'solar-panel', name: 'Solar Panel', SECTION_ID: null },
  { id: 'inverters', name: 'Inverters', SECTION_ID: null },
  { id: 'accessories', name: 'Lightening & Accessories', SECTION_ID: null },
  { id: 'services', name: 'Services', SECTION_ID: null }
];

// Fetch live products
const { data: apiProducts, pending } = useFetch('/api/inventory');
// Helper to safely get the products array whether it's direct or nested
const getProductsArray = () => {
  if (!apiProducts.value) return [];
  // If the API returns { data: [...] } or { result: [...] }
  if (Array.isArray(apiProducts.value.data)) return apiProducts.value.data;
  if (Array.isArray(apiProducts.value.result)) return apiProducts.value.result;
  // If it's already an array
  if (Array.isArray(apiProducts.value)) return apiProducts.value;
  return [];
};

// Filter States for Desktop
const searchQuery = ref('');
const selectedCategory = ref('all');
const maxPrice = ref(2000000); // Default max price

import { watch } from 'vue';

const displayLimit = ref(50);

// Step 1: Find ALL products that match the current filters
const matchingProducts = computed(() => {
  const products = getProductsArray();
  if (products.length === 0) return [];
  
  return products.filter(product => {
    // 1. Safe Search
    const productName = product.NAME || product.name || '';
    const matchesSearch = productName.toLowerCase().includes(searchQuery.value.toLowerCase());
    
    // 2. Safe Category
    const matchesCategory = selectedCategory.value === 'all' || 
                            product.SECTION_ID === categories.find(c => c.id === selectedCategory.value)?.SECTION_ID;
    
    // 3. Safe Price (Fall back to 0 if missing so they don't disappear)
    const rawPrice = product.PRICE || product.price || 0;
    const matchesPrice = Number(rawPrice) <= maxPrice.value;
    
    return matchesSearch && matchesCategory && matchesPrice;
  });
});

// Step 2: Slice the matches based on our current display limit
const displayedProducts = computed(() => {
  return matchingProducts.value.slice(0, displayLimit.value);
});

// Step 3: Reset the pagination if the user searches or changes a filter
watch([searchQuery, selectedCategory, maxPrice], () => {
  displayLimit.value = 50;
});

// Mobile Helper
const getProductsForCategory = (categoryId) => {
  const products = getProductsArray();
  if (products.length === 0) return [];
  
  const targetSectionId = categories.find(c => c.id === categoryId)?.SECTION_ID;
  return products.filter(p => p.SECTION_ID === targetSectionId).slice(0, 4);
};

useHead({
  title: 'Shop Inventory | NovelSolar',
  meta: [
    { name: 'description', content: 'Explore our full range of solar equipment with advanced filtering and mobile-first navigation.' }
  ]
});
</script>

<template>
  <div class="pb-20">
    <!-- Page Header (Shared) -->
    <header class="max-w-6xl mx-auto px-4 md:px-6 pt-8 mb-4 md:mb-0">
      <h1 class="text-3xl font-bold text-slate-900 mb-2">All Inventory</h1>
      <p class="text-slate-500 text-sm md:text-base">Ready for immediate dispatch from our regional hubs.</p>
    </header>

    <!-- MOBILE VIEW: Categorized Blocks (Hidden on Desktop) -->
    <div v-if="pending" class="block md:hidden max-w-6xl mx-auto px-4 py-8 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 mt-6">
      <span class="material-symbols-outlined text-4xl text-[#002888] mb-2 animate-pulse">package_2</span>
      <h3 class="text-base font-bold text-slate-900 mb-1">Loading inventory...</h3>
    </div>
    <div v-else class="block md:hidden max-w-6xl mx-auto px-4 py-6">
      <div v-for="category in categories" :key="category.id" class="mb-10">
        <!-- Category Header Pill -->
        <div class="bg-[#002888] text-white px-5 py-3.5 rounded-xl flex items-center justify-between mb-5 shadow-sm">
          <h2 class="text-lg font-bold">{{ category.name }}</h2>
          <NuxtLink :to="'/shop/category/' + category.id" class="text-xs font-semibold flex items-center gap-1 hover:text-blue-200 transition-colors">
            See All <span class="material-symbols-outlined text-sm">chevron_right</span>
          </NuxtLink>
        </div>

        <!-- 2-Column Grid -->
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
          <ProductCard 
            v-for="product in getProductsForCategory(category.id)" 
            :key="product.ID" 
            :product="product" 
          />
        </div>
      </div>
    </div>

    <!-- DESKTOP VIEW: Sidebar + Full Grid (Hidden on Mobile) -->
    <div class="hidden md:flex gap-8 max-w-7xl mx-auto px-6 py-12">
      <!-- Sidebar Filters -->
      <aside class="w-64 shrink-0 space-y-8">
        <div>
          <h3 class="font-bold text-slate-900 mb-4 text-lg">Search</h3>
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search products..." 
            class="w-full rounded-lg border-slate-200 bg-slate-50 focus:ring-2 focus:ring-[#002888]/20 focus:border-[#002888] p-3 outline-none" 
          />
        </div>

        <div>
          <h3 class="font-bold text-slate-900 mb-4 text-lg">Categories</h3>
          <div class="space-y-3">
            <label class="flex items-center gap-3 cursor-pointer group">
              <input type="radio" v-model="selectedCategory" value="all" class="w-4 h-4 text-[#002888] border-slate-300 focus:ring-[#002888]">
              <span class="text-slate-700 font-medium group-hover:text-[#002888] transition-colors">All Products</span>
            </label>
            <label v-for="cat in categories" :key="cat.id" class="flex items-center gap-3 cursor-pointer group">
              <input type="radio" v-model="selectedCategory" :value="cat.id" class="w-4 h-4 text-[#002888] border-slate-300 focus:ring-[#002888]">
              <span class="text-slate-700 font-medium group-hover:text-[#002888] transition-colors">{{ cat.name }}</span>
            </label>
          </div>
        </div>

        <div>
          <h3 class="font-bold text-slate-900 mb-4 text-lg flex items-center justify-between">
            Max Price 
            <span class="text-sm font-black text-[#002888]">₦{{ Number(maxPrice).toLocaleString() }}</span>
          </h3>
          <input 
            v-model="maxPrice" 
            type="range" 
            min="0" 
            max="2000000" 
            step="50000" 
            class="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#002888]" 
          />
          <div class="flex justify-between mt-2 text-[10px] text-slate-400 font-bold uppercase">
            <span>₦0</span>
            <span>₦2M+</span>
          </div>
        </div>
      </aside>

      <!-- Results Grid -->
      <main class="flex-1 min-w-0">
        <div class="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
          <h2 class="text-2xl font-bold text-slate-900 uppercase tracking-tight">
            {{ selectedCategory === 'all' ? 'All Inventory' : categories.find(c => c.id === selectedCategory)?.name }}
          </h2>
          <span class="bg-blue-50 text-[#002888] px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
            {{ matchingProducts.length }} Results
          </span>
        </div>
        
        <!-- Loading State -->
        <div v-if="pending" class="text-center py-24 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200">
          <span class="material-symbols-outlined text-6xl text-[#002888] mb-4 animate-pulse">package_2</span>
          <h3 class="text-lg font-bold text-slate-900 mb-1">Loading inventory...</h3>
          <p class="text-slate-500 mb-6">Retrieving live data.</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="matchingProducts.length === 0" class="text-center py-24 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200">
          <span class="material-symbols-outlined text-6xl text-slate-200 mb-4">inventory_2</span>
          <h3 class="text-lg font-bold text-slate-900 mb-1">No products found</h3>
          <p class="text-slate-500 mb-6">Try adjusting your filters to find what you're looking for.</p>
          <button 
            @click="searchQuery = ''; selectedCategory = 'all'; maxPrice = 2000000" 
            class="bg-[#002888] text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-900 transition-all shadow-lg"
          >
            Clear All Filters
          </button>
        </div>

        <!-- Desktop Grid -->
        <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
          <ProductCard 
            v-for="product in displayedProducts" 
            :key="product.ID" 
            :product="product" 
          />
        </div>
        
        <div v-if="matchingProducts.length > displayedProducts.length" class="mt-12 flex justify-center">
          <button @click="displayLimit += 50" class="px-8 py-3 bg-white border-2 border-[#002888] text-[#002888] font-bold rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2">
            Load More Products
            <span class="material-symbols-outlined text-sm">expand_more</span>
          </button>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 600, 'GRAD' 0, 'opsz' 24;
}
</style>
