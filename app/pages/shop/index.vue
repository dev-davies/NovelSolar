<script setup>
const categories = [
  { id: 'batteries', name: 'Batteries' },
  { id: 'solar-panel', name: 'Solar Panel' },
  { id: 'inverters', name: 'Inverters' },
  { id: 'accessories', name: 'Lightening & Accessories' },
  { id: 'services', name: 'Services' }
];

// Unified mock data array
const allProducts = ref(categories.flatMap(cat => 
  [1, 2, 3, 4, 5, 6].map(i => ({
    ID: `${cat.id}-${i}`,
    categoryId: cat.id,
    NAME: `NovelSolar ${cat.name} ${i}`,
    PRICE: Math.floor(Math.random() * 500000) + 50000
  }))
));

// Filter States for Desktop
const searchQuery = ref('');
const selectedCategory = ref('all');
const maxPrice = ref(2000000); // Default max price

// Desktop Computed Filter
const filteredProducts = computed(() => {
  return allProducts.value.filter(product => {
    const matchesSearch = product.NAME.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesCategory = selectedCategory.value === 'all' || product.categoryId === selectedCategory.value;
    const matchesPrice = product.PRICE <= maxPrice.value;
    return matchesSearch && matchesCategory && matchesPrice;
  });
});

// Mobile Helper
const getProductsForCategory = (categoryId) => {
  return allProducts.value.filter(p => p.categoryId === categoryId).slice(0, 4);
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
    <div class="block md:hidden max-w-6xl mx-auto px-4 py-6">
      <div v-for="category in categories" :key="category.id" class="mb-10">
        <!-- Category Header Pill -->
        <div class="bg-[#002888] text-white px-5 py-3.5 rounded-xl flex items-center justify-between mb-5 shadow-sm">
          <h2 class="text-lg font-bold">{{ category.name }}</h2>
          <NuxtLink :to="'/shop/category/' + category.id" class="text-xs font-semibold flex items-center gap-1 hover:text-blue-200 transition-colors">
            See All <span class="material-symbols-outlined text-sm">chevron_right</span>
          </NuxtLink>
        </div>

        <!-- 2-Column Grid -->
        <div class="grid grid-cols-2 gap-3">
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
            {{ filteredProducts.length }} Results
          </span>
        </div>
        
        <!-- Empty State -->
        <div v-if="filteredProducts.length === 0" class="text-center py-24 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200">
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
        <div v-else class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <ProductCard 
            v-for="product in filteredProducts" 
            :key="product.ID" 
            :product="product" 
          />
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
