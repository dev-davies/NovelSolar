<template>
  <div class="min-h-screen bg-white font-sans selection:bg-[#002888]/10">
    
    <!-- Navigation / Top Bar -->
    <div class="max-w-7xl mx-auto px-4 py-8 flex items-center justify-between">
      <NuxtLink to="/blog" class="inline-flex items-center text-[#002888] font-bold text-sm hover:underline group">
        <span class="material-symbols-outlined text-sm mr-2 transform group-hover:-translate-x-1 transition-all">arrow_back</span>
        Back to Blog Hub
      </NuxtLink>
      <div v-if="post && !pending" class="hidden md:flex items-center gap-2">
        <span class="text-[10px] font-black text-slate-300 uppercase tracking-widest">Currently Reading Index</span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="flex flex-col items-center justify-center py-32 text-center">
      <div class="w-16 h-16 border-4 border-[#002888]/10 border-t-[#002888] rounded-full animate-spin mb-8"></div>
      <p class="text-xl text-slate-400 font-extrabold tracking-tight italic uppercase animate-pulse">Syncing solar data...</p>
    </div>

    <!-- Dynamic Content -->
    <div v-else-if="post" class="max-w-7xl mx-auto py-16 px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
      <article class="lg:col-span-8 pb-32">
      <!-- Title / Header Hero -->
      <header class="max-w-4xl mx-auto px-4 text-center mb-16 relative">
        <div class="absolute -top-12 left-1/2 -translate-x-1/2 opacity-[0.03] text-8xl font-black text-[#002888] uppercase select-none pointer-events-none">
          Insights
        </div>
        <div class="mb-6 flex flex-col items-center gap-4">
          <div v-if="post.categories && post.categories.length > 0" class="flex flex-wrap justify-center gap-2">
            <span 
              v-for="category in post.categories" 
              :key="category.title"
              class="bg-red-600 text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-sm"
            >
              {{ category.title }}
            </span>
          </div>

          <div class="flex flex-wrap items-center justify-center gap-2 text-sm text-slate-500 font-medium">
            <span class="flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              By {{ post.author?.name || 'Novel Solar Admin' }}
            </span>
            <span>&bull;</span>
            <span>
              {{ formatDate(post.publishedAt) }}
            </span>
          </div>
        </div>
        <h1 class="text-4xl md:text-7xl font-black text-slate-900 leading-[1.05] tracking-tighter mb-8 max-w-3xl mx-auto">
          {{ post.title }}
        </h1>
        <div class="w-20 h-1.5 bg-[#002888] mx-auto rounded-full"></div>
      </header>

      <!-- Featured Image Container -->
      <div class="max-w-6xl mx-auto px-4 mb-20">
        <div class="aspect-video bg-slate-50 rounded-[40px] overflow-hidden shadow-2xl border-8 border-white group relative">
          <div class="absolute inset-0 bg-[#002888]/10 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10"></div>
          <NuxtImg
            v-if="post.mainImage?.asset?._ref"
            provider="sanity"
            :src="post.mainImage.asset._ref"
            width="1200"
            height="675"
            loading="lazy"
            format="webp"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms]"
            :alt="post.title"
          />
          <div v-else class="w-full h-full relative overflow-hidden bg-slate-900 flex items-center justify-center">
            <img src="/images/fallback-post.png" class="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay" />
            <div class="relative z-10 text-center">
              <div class="text-[#3c59b0] font-black text-xs uppercase tracking-[0.4em] mb-4">Novel Solar Insights</div>
              <span class="material-symbols-outlined text-white/10 text-9xl">solar_power</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Column Content (Rich Text) -->
      <div class="max-w-3xl mx-auto px-4">
        <!-- Prose Wrapper for Portable Text Rendering -->
        <div class="prose prose-slate lg:prose-xl prose-headings:text-slate-900 prose-headings:font-black prose-headings:tracking-tight prose-a:text-[#002888] prose-a:font-bold prose-strong:text-slate-900 prose-blockquote:border-[#002888] prose-blockquote:bg-slate-50 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-2xl prose-img:rounded-[30px] prose-img:shadow-xl">
          <PortableText v-if="post && post.body" :value="post.body" :components="myPortableTextComponents" />
          
          <!-- Fallback if body is somehow missing -->
          <div v-else class="py-12 text-center text-slate-400 font-medium italic">
            This insight is currently being updated with data from our solar analytics laboratory.
          </div>
        </div>

        <!-- Post Footer / Share -->
        <div class="mt-24 pt-12 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
          <div class="flex items-center gap-6">
            <NuxtLink to="/blog" class="text-sm font-black text-[#002888] uppercase tracking-widest hover:bg-slate-50 px-6 py-3 rounded-full transition-colors">
              Explore More Insights
            </NuxtLink>
          </div>
          <div class="flex items-center gap-4 text-slate-400">
            <span class="text-[10px] font-black uppercase tracking-tighter">Share this insight</span>
            <!-- (Placeholders for social links could go here) -->
          </div>
        </div>
      </div>
    </article>

    <aside class="lg:col-span-4 space-y-10">
      <div class="bg-slate-50 p-6 rounded-2xl border border-slate-100">
        <h3 class="font-bold text-lg text-slate-900 mb-4">Search</h3>
        <div class="relative">
          <input v-model="searchQuery" @keyup.enter="handleSearch" type="text" placeholder="Search insights..." class="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#002888] focus:border-transparent outline-none transition-all">
          <svg class="w-5 h-5 text-slate-400 absolute right-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
      </div>

      <div v-if="allCategories && allCategories.length > 0" class="bg-slate-50 p-6 rounded-2xl border border-slate-100">
        <h3 class="font-bold text-lg text-slate-900 mb-4 border-b border-slate-200 pb-3">Categories</h3>
        <ul class="space-y-3">
          <li v-for="cat in allCategories" :key="cat.title">
            <NuxtLink :to="'/blog?category=' + encodeURIComponent(cat.title)" class="text-slate-600 hover:text-[#002888] hover:underline font-medium transition-colors flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-red-600"></span>
              {{ cat.title }}
            </NuxtLink>
          </li>
        </ul>
      </div>

      <div v-if="recentPosts && recentPosts.length > 0" class="bg-slate-50 p-6 rounded-2xl border border-slate-100">
        <h3 class="font-bold text-lg text-slate-900 mb-4 border-b border-slate-200 pb-3">Latest Posts</h3>
        <div class="space-y-6">
          <NuxtLink v-for="recent in recentPosts" :key="recent.slug.current" :to="'/blog/' + recent.slug.current" class="group flex gap-4 items-start">
            <div class="w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-slate-200 relative">
              <NuxtImg
                v-if="recent.mainImage?.asset?._ref"
                provider="sanity"
                :src="recent.mainImage.asset._ref"
                width="200"
                height="200"
                loading="lazy"
                format="webp"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                :alt="recent.title"
              />
              <div v-else class="w-full h-full bg-slate-900 flex items-center justify-center">
                <img src="/images/fallback-post.png" class="absolute inset-0 w-full h-full object-cover opacity-20" />
                <span class="material-symbols-outlined text-white/20 text-xl relative z-10">solar_power</span>
              </div>
            </div>
            <div>
              <h4 class="font-bold text-sm text-slate-900 group-hover:text-[#002888] transition-colors line-clamp-2 leading-snug mb-1">{{ recent.title }}</h4>
              <span class="text-xs text-slate-500">{{ new Date(recent.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </aside>
  </div>

    <!-- Error / Not Found State -->
    <div v-else class="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center pt-32 pb-32">
       <div class="w-24 h-24 bg-white rounded-full shadow-2xl flex items-center justify-center mb-10 border-2 border-slate-50">
          <span class="material-symbols-outlined text-6xl text-slate-100">search_off</span>
       </div>
       <h1 class="text-4xl md:text-6xl font-black text-slate-900 mb-6 uppercase tracking-tighter italic">Insight Not Found</h1>
       <p class="text-xl text-slate-400 mb-12 font-medium max-w-lg mx-auto leading-relaxed">
          The article you are searching for might have been archived or re-categorized in our recent system update.
       </p>
       <NuxtLink to="/blog" class="inline-flex items-center gap-2 bg-[#002888] text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-blue-900 transition-all shadow-2xl active:scale-95 uppercase tracking-tight">
          &larr; Back to the hub
       </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed, h, ref } from 'vue'
import { PortableText } from '@portabletext/vue'
import PortableTextImage from '~/components/PortableTextImage.vue'

const myPortableTextComponents = {
  types: {
    image: PortableTextImage,
  },
  marks: {
    link: ({ value, slots }) => {
      const href = value?.href || '#'
      const rel = !href.startsWith('/') ? 'noreferrer noopener' : undefined
      const target = !href.startsWith('/') ? '_blank' : undefined
      return h('a', { href, rel, target, class: 'text-[#002888] font-bold hover:underline' }, slots.default?.())
    }
  }
}

const route = useRoute()
const sanity = useSanity()
const { urlFor } = useSanityImage()

// Make the slug a reactive computed property
const activeSlug = computed(() => route.params.slug)

// Fetch the main post, recent posts (excluding current), and all categories
const query = groq`{
  "post": *[_type == "post" && slug.current == $slug][0]{
    ...,
    mainImage { asset, hotspot, crop },
    "excerpt": pt::text(body),
    author->{name},
    categories[]->{title}
  },
  "recentPosts": *[_type == "post" && slug.current != $slug] | order(publishedAt desc)[0...3]{
    title,
    slug,
    mainImage { asset, hotspot, crop },
    publishedAt
  },
  "categories": *[_type == "category"]{
    title
  }
}`

const { data, pending } = await useAsyncData(
  `blog-layout-${activeSlug.value}`,
  () => sanity.fetch(query, { slug: activeSlug.value }),
  { watch: [activeSlug] }
)

// Keep the 'post' variable working for the existing template
const post = computed(() => data.value?.post)
const recentPosts = computed(() => data.value?.recentPosts)
const allCategories = computed(() => data.value?.categories)
const searchQuery = ref('')

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    navigateTo({ path: '/blog', query: { q: searchQuery.value } })
  }
}

/**
 * Format the Sanity timestamp into a human-readable date
 */
const formatDate = (dateString) => {
  if (!dateString) return 'Newly Published'
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(dateString))
}

useSeoMeta({
  title: () => post.value?.title ? `${post.value.title} | Novel Solar Insights` : 'Novel Solar Insights',
  description: () => post.value?.excerpt || 'Discover in-depth solar technology expertise.',
  ogTitle: () => post.value?.title,
  ogDescription: () => post.value?.excerpt,
  ogImage: () => post.value?.mainImage ? urlFor(post.value.mainImage).width(1200).height(630).url() : 'https://novel-solar.vercel.app/images/fallback-post.png',
  twitterCard: 'summary_large_image',
})
</script>

<style scoped>
/* Ensure smooth transitions for any custom micro-animations */
.article-enter-active, .article-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.article-enter-from, .article-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
