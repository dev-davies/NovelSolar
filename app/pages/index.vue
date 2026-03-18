<template>
  <div>
    <!-- Hero Section -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
      <div class="bg-primary rounded-3xl overflow-hidden py-16 sm:py-24 px-8 sm:px-12 relative">
        <div class="max-w-2xl relative z-10">
          <h1 class="text-4xl sm:text-6xl font-extrabold text-white leading-tight">
            Reliable Solar Inventory, <br />
            <span class="text-blue-200">On-Demand.</span>
          </h1>
          <p class="mt-6 text-xl text-blue-100 max-w-lg">
            Sourcing the world's best solar components for residential and commercial projects. Instant quotes and same-day logistics.
          </p>
          <div class="mt-10 flex flex-wrap gap-4">
            <NuxtLink to="/shop" class="bg-white text-primary px-8 py-3 rounded-md text-lg font-bold hover:bg-gray-100 transition-colors shadow-lg">
              Browse Stock
            </NuxtLink>
            <button class="border-2 border-white text-white px-8 py-3 rounded-md text-lg font-bold hover:bg-white/10 transition-colors">
              Spec Sheets
            </button>
          </div>
        </div>
        <!-- Decorative background element -->
        <div class="absolute right-[-10%] top-[-20%] w-[500px] h-[500px] bg-blue-500 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
      </div>
    </section>

    <!-- Our Ecosystem Selection -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-16">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Card 1 - Novel Academy -->
        <a href="https://novel-academy.com" target="_blank" rel="noopener noreferrer" class="group relative block overflow-hidden rounded-xl bg-[#2C75D8] p-8 text-white shadow-md transition-transform hover:-translate-y-1 min-h-[280px] flex flex-col justify-end">
          <!-- Background Image -->
          <img src="/images/novel academy.png" alt="Novel Academy" class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          <!-- Overlay Gradient for Readability -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          
          <!-- Content -->
          <div class="relative z-10">
            <h3 class="text-2xl font-bold mb-2 text-white">Novel Academy</h3>
            <p class="text-blue-50 mb-6 max-w-sm">Launch your career with our hands-on technical training courses. Learn professional solar installation, maintenance, and system design.</p>
            <span class="inline-flex items-center gap-2 font-semibold text-white group-hover:underline">
              Explore Courses 
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </div>
        </a>

        <!-- Card 2 - Solar Product Exchange -->
        <a href="https://solarproductexchange.com" target="_blank" rel="noopener noreferrer" class="group relative block overflow-hidden rounded-xl bg-white border border-gray-200 p-8 shadow-md transition-transform hover:-translate-y-1 min-h-[280px] flex flex-col justify-end">
          <!-- Background Image -->
          <img src="/images/solarexchange.png" alt="Solar Product Exchange" class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          <!-- Overlay Gradient for Readability -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

          <!-- Content -->
          <div class="relative z-10">
            <h3 class="text-2xl font-bold text-white mb-2">Tokunbo & Open-Box Store</h3>
            <p class="text-gray-100 mb-6 max-w-sm">Looking for budget-friendly options? Shop our certified pre-owned, tokunbo, and open-box solar panels and inverters at unbeatable prices.</p>
            <span class="inline-flex items-center gap-2 text-white font-semibold group-hover:underline">
              Shop Used Inventory 
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </div>
        </a>
      </div>
    </section>

    <!-- All Inventory Product Grid -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div class="mb-6 md:mb-8">
        <div class="flex items-end justify-between mb-2 gap-4">
          <h2 class="text-2xl md:text-3xl font-bold text-slate-900 leading-none">Featured Products</h2>
          
          <NuxtLink to="/shop" class="text-sm font-bold text-[#002888] flex items-center gap-1 hover:text-blue-700 transition-colors whitespace-nowrap pb-1">
            See All <span class="material-symbols-outlined text-sm md:text-base">chevron_right</span>
          </NuxtLink>
        </div>
        
        <p class="text-slate-500 text-sm md:text-base">Ready for immediate dispatch from our regional hubs.</p>
      </div>

      <!-- Loading State -->
      <div v-if="pending" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
        <div v-for="i in 4" :key="i" class="bg-white rounded-2xl border border-gray-100 p-4 space-y-4 animate-pulse">
          <div class="aspect-square bg-gray-100 rounded-xl"></div>
          <div class="h-4 bg-gray-100 rounded w-3/4"></div>
          <div class="h-4 bg-gray-100 rounded w-1/2"></div>
        </div>
      </div>

      <!-- Product Grid -->
      <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
        <ProductCard v-for="product in products?.slice(0, 8)" :key="product.ID" :product="product" />
      </div>

      <!-- View All Button -->
      <div class="mt-12 text-center">
        <NuxtLink 
          to="/shop" 
          class="inline-flex items-center gap-2 bg-[#002888] text-white px-10 py-4 rounded-xl font-bold hover:bg-blue-900 transition-all shadow-lg hover:shadow-blue-900/20 active:scale-95"
        >
          View All Products
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </NuxtLink>
      </div>
    </section>

    <!-- Industry Insights Section -->
    <section class="bg-gray-50 py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-gray-900">Industry Insights</h2>
          <p class="text-gray-500 mt-4 max-w-2xl mx-auto">Latest updates from the solar sector, logistics reports, and technology breakthroughs.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <article v-for="post in posts" :key="post.id" class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
            <div class="aspect-video relative overflow-hidden">
              <img :src="post.image" :alt="post.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div class="p-8">
              <div class="flex items-center gap-2 mb-4 text-xs font-medium text-gray-400">
                <span>{{ post.category }}</span>
                <span class="w-1 h-1 rounded-full bg-gray-300"></span>
                <span>{{ post.readTime }}</span>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-4 leading-snug group-hover:text-primary transition-colors">
                {{ post.title }}
              </h3>
              <p class="text-gray-500 text-sm line-clamp-2 mb-6">
                {{ post.excerpt }}
              </p>
              <NuxtLink :to="`/blog/${post.id}`" class="text-primary font-bold text-sm inline-flex items-center gap-2">
                Read Article
                <svg class="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </NuxtLink>
            </div>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const { data: products, pending } = useFetch('/api/inventory')

const cart = useState('cart', () => [])

const buyNow = (product) => {
  // Set the cart to contains only this product for a direct checkout experience
  cart.value = [product]
  // Redirect to checkout
  navigateTo('/checkout')
}

const posts = [
  {
    id: 1,
    title: 'The Future of bifacial solar technology in 2026',
    excerpt: 'Exploring how recent breakthroughs in cell architecture are driving down double-sided yields.',
    category: 'Technology',
    readTime: '5 min read',
    image: '/images/industry_insights_1_1773068313772.png'
  },
  {
    id: 2,
    title: 'Optimizing supply chain for utility-scale solar',
    excerpt: 'Best practices for managing multi-megawatt components dispatch and local warehousing.',
    category: 'Logistics',
    readTime: '8 min read',
    image: '/images/industry_insights_2_1773068331524.png'
  },
  {
    id: 3,
    title: 'Smart cities: The role of building integrated PV',
    excerpt: 'How BIPV is transforming urban energy landscapes and increasing property value.',
    category: 'Architecture',
    readTime: '4 min read',
    image: '/images/industry_insights_3_1773068348559.png'
  }
];
</script>
