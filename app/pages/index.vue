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
        <NuxtLink to="/categories" class="text-primary font-semibold hover:underline flex items-center gap-1">
          View all categories
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="9 5l7 7-7 7" /></svg>
        </NuxtLink>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <B24Card v-for="product in products" :key="product.id" class="group overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl flex flex-col">
          <template #header>
            <div class="relative aspect-[4/3] overflow-hidden bg-gray-100">
              <img :src="product.image" :alt="product.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div :class="['absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm z-10', product.stockStatus === 'In Stock' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700']">
                {{ product.stockStatus }}
              </div>
            </div>
          </template>
          <div class="p-6 flex flex-col flex-grow">
            <div class="flex justify-between items-start mb-2">
              <h3 class="text-lg font-bold text-gray-900 leading-tight">{{ product.title }}</h3>
            </div>
            <p class="text-sm text-gray-500 mb-4 flex-grow">{{ product.description }}</p>
            <div class="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
              <span class="text-2xl font-bold text-primary">${{ product.price }}</span>
              <B24Button color="primary" size="sm" class="px-6 rounded-xl">
                Quick Buy
              </B24Button>
            </div>
          </div>
        </B24Card>
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
const products = [
  {
    id: 1,
    title: 'UltraMax 550W Panels',
    description: 'High-efficiency monocrystalline panels with advanced multi-busbar technology.',
    price: '289.00',
    stockStatus: 'In Stock',
    image: '/images/solar_panel_inventory_1773068259858.png'
  },
  {
    id: 2,
    title: 'NovaCore Hybrid Inverter',
    description: 'Smart 10kW hybrid inverter with integrated energy management system.',
    price: '1450.00',
    stockStatus: 'Limited',
    image: '/images/solar_inverter_inventory_1773068280393.png'
  },
  {
    id: 3,
    title: 'TerraWall Storage (15kWh)',
    description: 'Stackable high-voltage lithium battery storage for residential power backup.',
    price: '3800.00',
    stockStatus: 'In Stock',
    image: '/images/solar_battery_inventory_1773068296812.png'
  }
];

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
