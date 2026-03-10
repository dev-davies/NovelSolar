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
            <B24Button color="white" size="lg" class="shadow-lg hover:bg-gray-100 text-primary">
              Browse Stock
            </B24Button>
            <B24Button variant="outline" size="lg" class="border-white text-white hover:bg-white/10">
              Spec Sheets
            </B24Button>
          </div>
        </div>
        <!-- Decorative background element -->
        <div class="absolute right-[-10%] top-[-20%] w-[500px] h-[500px] bg-blue-500 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
      </div>
    </section>

    <!-- All Inventory Product Grid -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div class="flex justify-between items-end mb-10">
        <div>
          <h2 class="text-3xl font-bold text-gray-900">All Inventory</h2>
          <p class="text-gray-500 mt-2">Ready for immediate dispatch from our regional hubs.</p>
        </div>
        <NuxtLink to="/products" class="text-primary font-semibold hover:underline flex items-center gap-1">
          View all products
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="9 5l7 7-7 7" /></svg>
        </NuxtLink>
      </div>

      <!-- Loading State -->
      <div v-if="pending" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div v-for="i in 4" :key="i" class="bg-white rounded-2xl border border-gray-100 p-4 space-y-4 animate-pulse">
          <div class="aspect-square bg-gray-100 rounded-xl"></div>
          <div class="h-4 bg-gray-100 rounded w-3/4"></div>
          <div class="h-4 bg-gray-100 rounded w-1/2"></div>
        </div>
      </div>

      <!-- Product Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div v-for="product in products" :key="product.ID" class="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col relative overflow-hidden">
          <!-- In Stock Badge -->
          <div class="absolute top-4 left-4 z-10 px-2.5 py-1 bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-wider rounded-md border border-green-100 shadow-sm">
            In Stock
          </div>

          <!-- Link to Product Detail Page -->
          <NuxtLink :to="'/products/' + product.ID" class="block group/link">
            <!-- Image Placeholder -->
            <div class="aspect-square bg-gray-50 flex items-center justify-center border-b border-gray-50 overflow-hidden transition-opacity duration-300 group-hover/link:opacity-80">
              <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <svg class="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            <!-- Content Title -->
            <div class="px-5 pt-5">
              <h3 class="text-sm font-bold text-gray-900 line-clamp-2 leading-snug group-hover/link:text-blue-800 transition-colors">
                {{ product.NAME }}
              </h3>
            </div>
          </NuxtLink>

          <!-- Price and Actions -->
          <div class="px-5 pb-5 flex flex-col flex-grow">
            <div class="mt-auto">
              <div class="flex items-baseline gap-1 mb-4">
                <span class="text-lg font-extrabold text-gray-900">{{ product.PRICE }}</span>
                <span class="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{{ product.CURRENCY_ID }}</span>
              </div>
              
              <div class="grid grid-cols-2 gap-2 mt-4">
                <B24Button 
                  color="primary" 
                  size="sm" 
                  class="w-full text-[11px] font-bold py-2 rounded-lg"
                  @click="buyNow(product)"
                >
                  Buy Now
                </B24Button>
                <B24Button variant="outline" size="sm" class="w-full text-[11px] font-bold py-2 rounded-lg border-gray-200 text-gray-600 hover:bg-gray-50">
                  Specs
                </B24Button>
              </div>
            </div>
          </div>
        </div>
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
