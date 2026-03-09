<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Breadcrumbs -->
    <nav class="flex mb-8 text-sm font-medium text-gray-500" aria-label="Breadcrumb">
      <ol class="flex items-center space-x-2">
        <li><NuxtLink to="/" class="hover:text-primary transition-colors">Home</NuxtLink></li>
        <li class="flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
          <NuxtLink to="/products" class="hover:text-primary transition-colors">Products</NuxtLink>
        </li>
        <li class="flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
          <span class="text-gray-900">Ultra-Efficiency 450W Panel</span>
        </li>
      </ol>
    </nav>

    <!-- Top Section (50/50 Split) -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
      
      <!-- Left side: Image Gallery -->
      <div class="space-y-4">
        <div class="aspect-square bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 flex items-center justify-center p-8">
          <img :src="activeImage" alt="Solar Panel Main" class="w-full h-full object-contain transition-all duration-500 transform hover:scale-105" />
        </div>
        <div class="grid grid-cols-4 gap-4">
          <button 
            v-for="(img, index) in gallery" 
            :key="index"
            @click="activeImage = img"
            :class="['aspect-square rounded-xl overflow-hidden border-2 transition-all p-2 bg-white', activeImage === img ? 'border-primary ring-2 ring-primary/20 shadow-md' : 'border-gray-100 hover:border-blue-200']"
          >
            <img :src="img" alt="Gallery thumbnail" class="w-full h-full object-contain" />
          </button>
        </div>
      </div>

      <!-- Right side: Product Info -->
      <div class="flex flex-col">
        <div class="mb-6">
          <div class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-green-100 text-green-700 shadow-sm border border-green-200 mb-4">
            In Stock: 142 Units
          </div>
          <h1 class="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
            Ultra-Efficiency 450W <br class="hidden sm:block" />
            Monocrystalline Panel
          </h1>
          <div class="flex items-center gap-4 mb-6">
            <div class="flex text-yellow-400">
              <span v-for="i in 5" :key="i">
                <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              </span>
            </div>
            <span class="text-sm font-medium text-gray-500">4.9 (86 Reviews)</span>
          </div>
          <div class="mb-8">
            <span class="text-4xl font-extrabold text-primary">$499.00</span>
            <span class="ml-3 text-lg text-gray-400 line-through tracking-tighter">$580.00</span>
          </div>
          <p class="text-gray-600 text-lg leading-relaxed mb-8">
            Engineered for maximum power harvesting even in low-light environments. The NovCore cell architecture ensures a 25-year reliability guarantee with minimal degradation.
          </p>
        </div>

        <div class="mt-auto space-y-4">
          <B24Button 
            color="primary" 
            size="lg" 
            class="w-full py-6 text-lg font-bold shadow-xl shadow-primary/20 hover:shadow-primary/30 rounded-2xl transition-all active:scale-[0.98]"
          >
            Buy Now - Free Express Shipping
          </B24Button>
          <B24Button 
            variant="outline" 
            size="lg" 
            class="w-full py-6 text-lg font-bold border-2 rounded-2xl transition-all active:scale-[0.98]"
          >
            Add to Cart
          </B24Button>
        </div>

        <div class="mt-8 grid grid-cols-2 gap-4">
          <div class="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <svg class="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            <div class="text-xs font-bold text-gray-900">Fast Power Delivery</div>
          </div>
          <div class="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <svg class="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            <div class="text-xs font-bold text-gray-900">25-Year Warranty</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Section (Tabs) -->
    <div class="mb-20">
      <div class="flex border-b border-gray-200 mb-8 overflow-x-auto no-scrollbar">
        <button 
          v-for="tab in ['Technical Specifications', 'Product Description', 'Downloads']" 
          :key="tab"
          @click="activeTab = tab"
          :class="['px-8 py-4 font-bold text-sm uppercase tracking-widest transition-all border-b-2 whitespace-nowrap', activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-gray-600']"
        >
          {{ tab }}
        </button>
      </div>

      <div class="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-2">
        <!-- Specs Table -->
        <div v-if="activeTab === 'Technical Specifications'">
          <table class="w-full border-collapse">
            <thead>
              <tr class="bg-gray-50">
                <th class="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider border-b">Parameter</th>
                <th class="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider border-b">Value</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr><td class="py-4 px-6 font-semibold text-gray-700">Peak Power (Pmax)</td><td class="py-4 px-6 text-gray-600">450W</td></tr>
              <tr><td class="py-4 px-6 font-semibold text-gray-700">Cell Type</td><td class="py-4 px-6 text-gray-600">Monocrystalline silicon</td></tr>
              <tr><td class="py-4 px-6 font-semibold text-gray-700">Module Efficiency</td><td class="py-4 px-6 text-gray-600">22.8%</td></tr>
              <tr><td class="py-4 px-6 font-semibold text-gray-700">Operating Temperature</td><td class="py-4 px-6 text-gray-600">-40°C to +85°C</td></tr>
              <tr><td class="py-4 px-6 font-semibold text-gray-700">Dimensions</td><td class="py-4 px-6 text-gray-600">1903 x 1134 x 30 mm</td></tr>
              <tr><td class="py-4 px-6 font-semibold text-gray-700">Weight</td><td class="py-4 px-6 text-gray-600">24.2 kg</td></tr>
            </tbody>
          </table>
        </div>

        <!-- Description -->
        <div v-if="activeTab === 'Product Description'" class="max-w-3xl prose prose-blue">
          <p class="text-gray-600 text-lg leading-relaxed">
            The Ultra-Efficiency 450W series panels represent the pinnacle of modern solar engineering. Developed for regions with variable irradiance, these panels utilize PERC technology combined with half-cut cell architecture to minimize internal resistive losses.
          </p>
          <h4 class="font-bold text-gray-900 mt-8 mb-4">Key Benefits:</h4>
          <ul class="space-y-3 text-gray-600">
            <li class="flex items-start gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-primary mt-2"></span>
              High density inter-connect technology for higher power density
            </li>
            <li class="flex items-start gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-primary mt-2"></span>
              Lower temperature coefficient for better power yield at high temperatures
            </li>
            <li class="flex items-start gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-primary mt-2"></span>
              Superior PID resistance through high quality cell materials
            </li>
          </ul>
        </div>

        <!-- Downloads -->
        <div v-if="activeTab === 'Downloads'" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a v-for="file in ['Technical Datasheet (PDF)', 'Installation Manual', 'Warranty Statement', 'Safety Credentials']" :key="file" href="#" class="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-blue-50 hover:border-blue-200 transition-all group">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm text-primary">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
              </div>
              <span class="font-bold text-gray-800 text-sm">{{ file }}</span>
            </div>
            <svg class="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          </a>
        </div>
      </div>
    </div>

    <!-- Custom Solutions Banner -->
    <section class="bg-primary rounded-[2.5rem] p-12 overflow-hidden relative group">
      <div class="absolute inset-0 bg-blue-900/50 opacity-0 group-hover:opacity-20 transition-opacity"></div>
      <div class="max-w-2xl relative z-10 text-center mx-auto">
        <h2 class="text-3xl font-extrabold text-white mb-4">Request a Custom Solution</h2>
        <p class="text-blue-100 text-lg mb-8">
          Planning a large-scale project? Get a personalized quote for bulk orders, custom logistics, and technical consulting.
        </p>
        <B24Button color="white" size="lg" class="px-10 py-4 font-bold rounded-2xl shadow-xl hover:scale-105 transition-transform active:scale-95 text-primary">
          Contact Sales Team
        </B24Button>
      </div>
      <!-- Decorative circles -->
      <div class="absolute -right-20 -top-20 w-80 h-80 bg-blue-500 rounded-full blur-3xl opacity-20 transition-transform duration-700 group-hover:scale-110"></div>
      <div class="absolute -left-20 -bottom-20 w-80 h-80 bg-blue-600 rounded-full blur-3xl opacity-20 transition-transform duration-700 group-hover:scale-110"></div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const gallery = [
  '/images/pdp_solar_panel_main_1773068744361.png',
  '/images/pdp_solar_panel_detail_1_1773068761460.png',
  '/images/pdp_solar_panel_detail_2_1773068777018.png',
  '/images/solar_panel_inventory_1773068259858.png'
];

const activeImage = ref(gallery[0]);
const activeTab = ref('Technical Specifications');
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
