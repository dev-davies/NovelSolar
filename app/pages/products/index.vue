<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <div class="flex flex-col lg:flex-row gap-8">
      
      <!-- Filters Sidebar (1/4 width) -->
      <aside class="lg:w-1/4 space-y-8">
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
          <h2 class="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <svg class="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
            Filters
          </h2>

          <!-- Availability -->
          <div class="mb-8">
            <h3 class="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-4">Availability</h3>
            <div class="space-y-3">
              <label class="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" v-model="filters.inStock" class="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary">
                <span class="text-sm text-gray-600 group-hover:text-primary transition-colors">In Stock</span>
              </label>
              <label class="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" v-model="filters.onBackorder" class="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary">
                <span class="text-sm text-gray-600 group-hover:text-primary transition-colors">On Backorder</span>
              </label>
            </div>
          </div>

          <!-- Price Range -->
          <div class="mb-8">
            <h3 class="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-4">Price Range</h3>
            <div class="px-2">
              <input type="range" v-model="filters.priceRange" :min="0" :max="5000" :step="100" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary">
              <div class="flex justify-between mt-3 text-xs text-gray-500 font-medium">
                <span>$0</span>
                <span>${{ filters.priceRange }}</span>
                <span>$5k+</span>
              </div>
            </div>
          </div>

          <!-- Wattage (W) -->
          <div class="mb-8">
            <h3 class="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-4">Wattage (W)</h3>
             <div class="px-2">
              <input type="range" v-model="filters.wattage" :min="100" :max="700" :step="10" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary">
              <div class="flex justify-between mt-3 text-xs text-gray-500 font-medium">
                <span>100W</span>
                <span>{{ filters.wattage }}W</span>
                <span>700W</span>
              </div>
            </div>
          </div>

          <!-- Panel Efficiency -->
          <div class="mb-4">
            <h3 class="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-4">Panel Efficiency</h3>
            <div class="px-2">
              <input type="range" v-model="filters.efficiency" :min="15" :max="25" :step="0.5" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary">
              <div class="flex justify-between mt-3 text-xs text-gray-500 font-medium">
                <span>15%</span>
                <span>{{ filters.efficiency }}%</span>
                <span>25%</span>
              </div>
            </div>
          </div>

          <button class="bg-white border border-gray-200 text-gray-600 w-full mt-6 py-2 px-4 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors" @click="resetFilters">
            Clear All
          </button>
        </div>
      </aside>

      <!-- Main Content (3/4 width) -->
      <main class="lg:w-3/4">
        <!-- Grid Header -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Solar Panels & Kits</h1>
            <p class="text-sm text-gray-500 mt-1">Showing {{ filteredProducts.length }} results</p>
          </div>
          <div class="flex items-center gap-4 w-full sm:w-auto">
            <span class="text-sm text-gray-500 font-medium whitespace-nowrap">Sort by:</span>
            <select class="block w-full sm:w-48 pl-3 pr-10 py-2 text-sm border-gray-200 focus:outline-none focus:ring-primary focus:border-primary rounded-md bg-gray-50/50">
              <option>Relevance</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Efficiency: Top Rated</option>
            </select>
          </div>
        </div>

        <!-- Product Grid -->
        <div v-if="filteredProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          <ProductCard v-for="product in filteredProducts" :key="product.id" :product="product" />
        </div>
        
        <!-- Empty State -->
        <div v-else class="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
          <svg class="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No products found</h3>
          <p class="mt-1 text-sm text-gray-500">Try adjusting your filters to find what you're looking for.</p>
          <div class="mt-6">
            <button @click="resetFilters" class="bg-[#002888] text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-900 transition-colors shadow-sm">
              Reset all filters
            </button>
          </div>
        </div>
      </main>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const filters = ref({
  inStock: true,
  onBackorder: false,
  priceRange: 3500,
  wattage: 550,
  efficiency: 22
});

const products = [
  {
    id: 1,
    title: 'AlphaPlus 400W High-Eff',
    category: 'Solar Panels',
    wattage: 400,
    efficiency: 21.5,
    price: 345.00,
    originalPrice: 399.00,
    image: '/images/high_efficiency_solar_panels_1773068563508.png'
  },
  {
    id: 2,
    title: 'Nomad Foldable 120W Kit',
    category: 'Foldable Kits',
    wattage: 120,
    efficiency: 19.8,
    price: 289.00,
    image: '/images/foldable_solar_kits_product_1773068578606.png'
  },
  {
    id: 3,
    title: 'Vertex S+ 425W Panel',
    category: 'Solar Panels',
    wattage: 425,
    efficiency: 21.8,
    price: 360.00,
    image: '/images/solar_panel_inventory_1773068259858.png'
  },
  {
    id: 4,
    title: 'Explorer 200W Folding Pro',
    category: 'Foldable Kits',
    wattage: 200,
    efficiency: 20.2,
    price: 499.00,
    originalPrice: 550.00,
    image: '/images/industry_insights_2_1773068331524.png'
  },
  {
    id: 5,
    title: 'Maxeon 3 400W Premium',
    category: 'Solar Panels',
    wattage: 400,
    efficiency: 22.6,
    price: 480.00,
    image: '/images/solar_panel_inventory_1773068259858.png'
  },
  {
    id: 6,
    title: 'LitePort 60W Ultra-Light',
    category: 'Foldable Kits',
    wattage: 60,
    efficiency: 18.5,
    price: 15.00,
    image: '/images/foldable_solar_kits_product_1773068578606.png'
  }
];

const filteredProducts = computed(() => {
  return products.filter(p => {
    return p.price <= filters.value.priceRange && 
           p.wattage <= filters.value.wattage && 
           p.efficiency >= (filters.value.efficiency - 5); // Simplified logic for demo
  });
});

function resetFilters() {
  filters.value = {
    inStock: true,
    onBackorder: false,
    priceRange: 5000,
    wattage: 700,
    efficiency: 15
  };
}
</script>

<style scoped>
/* Custom styling for the range sliders if needed */
</style>
