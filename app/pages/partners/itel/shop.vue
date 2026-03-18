<template>
  <div class="min-h-screen bg-gray-50 p-8 lg:p-12">
    <div class="max-w-7xl mx-auto">
      <header class="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <NuxtLink to="/partners/itel" class="inline-flex items-center text-gray-500 hover:text-[#002888] transition-colors mb-4 group">
            <span class="mr-2 transform group-hover:-translate-x-1 transition-transform">&larr;</span>
            Back to itel overview
          </NuxtLink>
          <h1 class="text-4xl font-bold text-[#002888]">itel Solar Shop</h1>
          <p class="text-gray-600 mt-2">Premium solar energy solutions for your home.</p>
        </div>
        <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <img src="/images/logo-new-novel.-itel.png" alt="itel Logo" class="h-8 w-auto object-contain" />
          <div class="h-8 w-px bg-gray-200"></div>
          <span class="text-xs font-bold text-gray-400 uppercase tracking-widest">Official Store</span>
        </div>
      </header>

      <!-- Loading State -->
      <div v-if="pending" class="flex flex-col items-center justify-center py-20 text-center">
        <div class="w-12 h-12 border-4 border-[#002888]/20 border-t-[#002888] rounded-full animate-spin mb-4"></div>
        <p class="text-xl text-gray-500 font-medium">Loading itel inventory...</p>
      </div>

      <!-- Product Grid -->
      <div v-else-if="itelProducts && itelProducts.length > 0" class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <NuxtLink v-for="product in itelProducts" :key="product.ID" :to="'/shop/' + product.ID" class="group block bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col relative overflow-hidden border border-gray-100">
          <!-- Official Badge -->
          <div class="absolute top-4 left-4 z-10 px-2.5 py-1 bg-blue-50 text-[#002888] text-[10px] font-bold uppercase tracking-wider rounded-md border border-blue-100 shadow-sm">
            itel Original
          </div>

          <!-- Product Image -->
          <div class="aspect-square bg-gray-50 flex items-center justify-center border-b border-gray-50 overflow-hidden relative">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
              <svg class="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <!-- Quick View Overlay -->
            <div class="absolute inset-0 bg-[#002888]/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span class="bg-white text-[#002888] px-4 py-2 rounded-lg text-xs font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                View Specs
              </span>
            </div>
          </div>

          <!-- Content -->
          <div class="pt-5 flex flex-col flex-grow">
            <h3 class="text-sm font-bold text-gray-900 line-clamp-2 leading-snug mb-4 min-h-[2.5rem]">
              {{ product.NAME }}
            </h3>
            
            <div class="mt-auto">
              <div class="flex items-baseline gap-1 mb-4">
                <span class="font-bold text-lg text-gray-900">₦{{ Number(product.PRICE).toLocaleString() }}</span>
              </div>
              
              <button 
                class="w-full bg-[#002888] text-white py-3 rounded-xl text-xs font-bold hover:bg-blue-900 transition-all shadow-md active:scale-[0.98]"
                @click.stop.prevent="addToCart(product)"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-100 min-h-[400px] flex flex-col items-center justify-center">
        <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
          <svg class="w-10 h-10 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">Inventory Arriving Soon</h3>
        <p class="text-gray-500 max-w-sm mx-auto">We're currently updating our itel shop collection. Check back shortly for the latest smart solar bundles.</p>
        <NuxtLink to="/products" class="mt-8 text-[#002888] font-bold text-sm hover:underline">
          Browse All Products &rarr;
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
const { data: itelProducts, pending } = await useFetch('/api/itel-products')

const cart = useState('cart', () => [])

const addToCart = (product) => {
  cart.value.push(product)
  // Simple notification logic would go here
  alert(`${product.NAME} added to cart!`)
}

// SEO
useHead({
  title: 'itel Solar Shop | Official itel Home Energy Store',
  meta: [
    { name: 'description', content: 'Shop official itel inverters, batteries, and smart home energy bundles. 24/7 power solutions designed for Nigerian homes.' }
  ]
})
</script>
