<template>
  <div>
    <!-- Hero Section -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
      <div class="relative min-h-[460px] sm:min-h-[560px] rounded-3xl overflow-hidden shadow-2xl shadow-slate-900/10">
        <div
          v-for="(slide, index) in heroSlides"
          :key="slide.image"
          class="absolute inset-0 transition-opacity duration-700"
          :class="index === activeHeroSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'"
        >
          <NuxtLink
            to="/shop"
            class="absolute inset-0 z-10"
            :aria-label="`Shop products from ${slide.title}`"
          />
          <NuxtImg
            :src="slide.image"
            :alt="slide.title"
            class="absolute inset-0 h-full w-full object-cover"
          />

          <div class="relative z-10 flex h-full items-end px-5 py-8 sm:px-12 sm:py-12">
            <div class="max-w-2xl">
              <div class="mt-6 flex flex-wrap items-center gap-3 sm:mt-10 sm:gap-4">
                <NuxtLink
                  to="/shop"
                  class="relative z-20 inline-flex items-center gap-2 rounded-full bg-white/95 px-6 py-3 text-sm font-black text-[#002888] shadow-lg transition-all hover:bg-white sm:px-8 sm:py-4 sm:text-base"
                >
                  Shop Now
                  <span class="material-symbols-outlined text-base">arrow_forward</span>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>

        <div class="absolute bottom-5 left-5 right-5 z-20 flex items-center justify-between gap-4 sm:bottom-8 sm:left-12 sm:right-12">
          <div class="flex items-center gap-2">
            <button
              v-for="(slide, index) in heroSlides"
              :key="`${slide.image}-dot`"
              type="button"
              class="h-2.5 rounded-full transition-all"
              :class="index === activeHeroSlide ? 'w-10 bg-white' : 'w-2.5 bg-white/45 hover:bg-white/70'"
              :aria-label="`Go to hero slide ${index + 1}`"
              @click="activeHeroSlide = index"
            />
          </div>

          <div class="hidden sm:flex items-center gap-2 rounded-full border border-white/15 bg-black/20 px-3 py-2 text-white backdrop-blur-md">
            <button type="button" class="grid h-9 w-9 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white/20" @click="goToPreviousHeroSlide">
              <span class="material-symbols-outlined text-lg">west</span>
            </button>
            <button type="button" class="grid h-9 w-9 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white/20" @click="goToNextHeroSlide">
              <span class="material-symbols-outlined text-lg">east</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Our Ecosystem Selection -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-16">
      <div class="flex flex-col h-[280px] overflow-y-auto snap-y snap-mandatory md:h-auto md:overflow-visible md:grid md:grid-cols-2 gap-4 md:gap-8 rounded-xl no-scrollbar">
        <!-- Card 1 - Novel Academy -->
        <a href="https://novel-academy.com" target="_blank" rel="noopener noreferrer" class="group relative block overflow-hidden rounded-xl bg-[#2C75D8] p-8 text-white shadow-md transition-transform hover:-translate-y-1 min-h-[280px] flex flex-col justify-end shrink-0 h-full w-full snap-center">
          <!-- Background Image -->
          <NuxtImg src="/images/Website BannersNovel Academy.jpg.jpeg" alt="Novel Academy" class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          <!-- Overlay Gradient for Readability -->
          <div class="absolute inset-0 bg-gradient-to-t from-[#06132d]/90 via-[#0f2d68]/45 to-transparent"></div>
          
          <!-- Content -->
          <div class="relative z-10">
            <h3 class="text-2xl font-bold mb-2 text-white">Novel Academy</h3>
            <p class="text-blue-50 mb-6 max-w-sm">Launch your career with our hands-on technical training courses. Learn professional solar installation, maintenance, and system design.</p>
            <span class="inline-flex items-center gap-2 rounded-full bg-[#2C75D8] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#2C75D8]/30 transition-all group-hover:bg-[#1f5db4]">
              Explore Courses
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </div>
        </a>

        <!-- Card 2 - Solar Product Exchange -->
        <a href="https://solarproductexchange.com" target="_blank" rel="noopener noreferrer" class="group relative block overflow-hidden rounded-xl bg-white border border-gray-200 p-8 shadow-md transition-transform hover:-translate-y-1 min-h-[280px] flex flex-col justify-end shrink-0 h-full w-full snap-center">
          <!-- Background Image -->
          <NuxtImg src="/images/Website BannersTokunbo shop.jpg.jpeg" alt="Solar Product Exchange" class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          <!-- Overlay Gradient for Readability -->
          <div class="absolute inset-0 bg-gradient-to-t from-[#0a111f]/90 via-[#8a3b09]/35 to-transparent"></div>

          <!-- Content -->
          <div class="relative z-10">
            <h3 class="text-2xl font-bold text-white mb-2">Solar Product Exchange</h3>
            <p class="text-gray-100 mb-6 max-w-sm">Looking for budget-friendly options? Shop our certified pre-owned, tokunbo, and open-box solar panels and inverters at unbeatable prices.</p>
            <span class="inline-flex items-center gap-2 rounded-full bg-[#ea580c] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#ea580c]/30 transition-all group-hover:bg-[#c2410c]">
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
        <ProductCard v-for="product in featuredProducts" :key="product.ID" :product="product" />
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
    <section v-if="recentInsights && recentInsights.length > 0" class="bg-gray-50 py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-gray-900">Industry Insights</h2>
          <p class="text-gray-500 mt-4 max-w-2xl mx-auto">Latest updates from the solar sector, logistics reports, and technology breakthroughs.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <article v-for="post in recentInsights || []" :key="post._path" class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
            <div class="aspect-video relative overflow-hidden">
              <NuxtImg
                v-if="post.image"
                :src="post.image"
                :alt="post.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <NuxtImg
                v-else
                src="/images/fallback-post.png"
                :alt="post.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div class="p-8">
              <div class="flex items-center gap-2 mb-4 text-xs font-medium text-gray-400">
                <span>{{ post.category || 'Industry Insight' }}</span>
                <span v-if="post.date" class="w-1 h-1 rounded-full bg-gray-300"></span>
                <span>{{ formatPublishedAt(post.date) }}</span>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-4 leading-snug group-hover:text-primary transition-colors">
                {{ post.title }}
              </h3>
              <p class="text-gray-500 text-sm line-clamp-2 mb-6">
                {{ post.description || post.excerpt || 'Read the latest update from Novel Solar insights.' }}
              </p>
              <NuxtLink :to="`/blog/${post._path.replace('/blog/', '')}`" class="text-primary font-bold text-sm inline-flex items-center gap-2">
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

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { excludeServiceProducts } from '~/utils/productFilters'

const heroSlides = [
  {
    image: '/images/Website BannersItel 500W SG.jpg.jpeg',
    eyebrow: 'Fast-Moving Solar Stock',
    title: 'Power Projects With Ready-to-Dispatch Solar Inventory.',
    description: 'Browse trusted modules, batteries, charge controllers, and inverters sourced for installers, EPCs, and growing energy businesses.',
    caption: 'Install-ready products'
  },
  {
    image: '/images/Website BannersHithium SG.jpg.jpeg',
    eyebrow: 'Battery Storage',
    title: 'Scale Faster With Premium Lithium Storage Solutions.',
    description: 'Source dependable storage systems built for residential backup, commercial resilience, and modern energy independence.',
    caption: 'High-capacity energy backup'
  },
  {
    image: '/images/Website Banners17.5kWh Lithium Battery.jpg.jpeg',
    eyebrow: 'Commercial Performance',
    title: 'Deliver Bigger Energy Systems Without Procurement Delays.',
    description: 'Keep timelines moving with stocked solar essentials, reliable fulfillment, and quick access to the products your team needs most.',
    caption: 'Project-ready logistics'
  },
  {
    image: '/images/Website Banners1100VA Hybrid Inveretr.jpg.jpeg',
    eyebrow: 'Hybrid Inverters',
    title: 'Match Smarter Inverter Options To Every Customer Need.',
    description: 'From compact backup setups to robust hybrid systems, find efficient inverter options that help you quote and close faster.',
    caption: 'Built for daily demand'
  },
  {
    image: '/images/Website Banners230ah Tubular Battery.jpg.jpeg',
    eyebrow: 'Reliable Backup',
    title: 'Keep Homes and Businesses Running Through Grid Downtime.',
    description: 'Stock proven backup components that support dependable power delivery and long-term performance in the field.',
    caption: 'Reliable field performance'
  },
  {
    image: '/images/Website Banners200A MMPT CC.jpg.jpeg',
    eyebrow: 'System Components',
    title: 'Complete Your Solar Builds With High-Performance Accessories.',
    description: 'Source the charge controllers and balance-of-system essentials that keep every installation efficient, safe, and scalable.',
    caption: 'Everything your build needs'
  },
  {
    image: '/images/Website Banners100A MMPT CC copy.jpg.jpeg',
    eyebrow: 'Installer Essentials',
    title: 'Stay Ready for Daily Sales With Popular Solar Bestsellers.',
    description: 'Move quickly with the products customers ask for most, supported by dependable fulfillment and instant access to stock.',
    caption: 'Always ready to ship'
  },
  {
    image: '/images/Website Banners1250 SG.jpg.jpeg',
    eyebrow: 'Residential Solar',
    title: 'Build Efficient Home Power Packages That Customers Trust.',
    description: 'Curate clean, practical solar packages for everyday users with dependable components and strong value at every tier.',
    caption: 'Home-ready energy kits'
  },
  {
    image: '/images/Website Banners1260 SG copy.jpg.jpeg',
    eyebrow: 'Energy Growth',
    title: 'Support Growing Demand With Better Stock Visibility.',
    description: 'From first inquiry to final delivery, keep your solar pipeline moving with a shop built for quick product discovery.',
    caption: 'Designed for fast quoting'
  }
]

const activeHeroSlide = ref(0)
let heroCarouselInterval: ReturnType<typeof setInterval> | null = null

const goToNextHeroSlide = () => {
  activeHeroSlide.value = (activeHeroSlide.value + 1) % heroSlides.length
}

const goToPreviousHeroSlide = () => {
  activeHeroSlide.value = (activeHeroSlide.value - 1 + heroSlides.length) % heroSlides.length
}

onMounted(() => {
  heroCarouselInterval = setInterval(() => {
    goToNextHeroSlide()
  }, 4500)
})

onUnmounted(() => {
  if (heroCarouselInterval) {
    clearInterval(heroCarouselInterval)
  }
})

const { data: products, pending } = useFetch('/api/inventory')
const featuredProducts = computed(() => excludeServiceProducts(products.value || []).slice(0, 8))

const { data: recentInsights } = await useAsyncData('home-insights', () => {
  return queryContent('blog').sort({ date: -1 }).limit(3).find()
})

const { addToCart } = useCart()

const buyNow = (product) => {
  addToCart(product)
  navigateTo('/checkout')
}

const formatPublishedAt = (dateString) => {
  if (!dateString) return 'Latest release'
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(dateString))
}
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
