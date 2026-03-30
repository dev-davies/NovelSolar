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
    <article v-else-if="post" class="pb-32">
      <!-- Title / Header Hero -->
      <header class="max-w-4xl mx-auto px-4 text-center mb-16 relative">
        <div class="absolute -top-12 left-1/2 -translate-x-1/2 opacity-[0.03] text-8xl font-black text-[#002888] uppercase select-none pointer-events-none">
          Insights
        </div>
        <div class="mb-6 inline-block px-4 py-1.5 rounded-full bg-slate-50 border border-slate-100 shadow-sm">
           <span class="text-xs font-bold text-[#002888] uppercase tracking-[0.2em]">{{ formatDate(post.publishedAt) }}</span>
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
          <SanityImage 
            v-if="post.mainImage"
            :asset-id="post.mainImage.asset._ref"
            auto="format"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms]"
          />
          <div v-else class="w-full h-full flex flex-col items-center justify-center text-slate-200">
             <span class="material-symbols-outlined text-8xl mb-4">image</span>
             <span class="text-sm font-black uppercase tracking-widest">Image Coming Soon</span>
          </div>
        </div>
      </div>

      <!-- Main Column Content (Rich Text) -->
      <div class="max-w-3xl mx-auto px-4">
        <!-- Prose Wrapper for Portable Text Rendering -->
        <div class="prose prose-slate lg:prose-xl prose-headings:text-slate-900 prose-headings:font-black prose-headings:tracking-tight prose-a:text-[#002888] prose-a:font-bold prose-strong:text-slate-900 prose-blockquote:border-[#002888] prose-blockquote:bg-slate-50 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-2xl prose-img:rounded-[30px] prose-img:shadow-xl">
          <SanityContent v-if="post.body" :blocks="post.body" />
          
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

const route = useRoute()
const query = groq`*[_type == "post" && slug.current == $slug][0]`
const { data: post, pending } = await useSanityQuery(query, { slug: route.params.slug })

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

/**
 * SEO / Head Management
 */
useHead({
  title: post.value?.title ? `${post.value.title} | Novel Solar Insights` : 'Solar Insight Loading...',
  meta: [
    { 
      name: 'description', 
      content: post.value?.excerpt || 'Discover in-depth solar technology expertise, maintenance guides, and sustainable energy news.' 
    }
  ]
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
