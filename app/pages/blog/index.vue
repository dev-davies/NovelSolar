<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Header -->
    <section class="bg-slate-50 py-16">
      <div class="max-w-7xl mx-auto px-4 text-center sm:text-left">
        <h1 class="text-4xl font-black text-[#002888] mb-4 tracking-tight">
          Novel Solar Insights
        </h1>
        <p class="text-lg text-slate-600 max-w-2xl leading-relaxed font-medium">
          Stay informed with the latest in solar technology, industry innovations, and expert advice for a sustainable energy future.
        </p>
      </div>
    </section>

    <!-- Post Grid -->
    <main class="max-w-7xl mx-auto px-4 py-16">
      
      <!-- Loading State -->
      <div v-if="pending" class="py-20 text-center text-slate-500 font-medium">
        Loading insights...
      </div>

      <!-- Grid -->
      <div v-else-if="allPosts && allPosts.length > 0">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <NuxtLink 
            v-for="post in allPosts" 
            :key="post._path" 
            :to="'/blog/' + post._path.replace('/blog/', '')"
            class="group bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col h-full overflow-hidden border border-gray-50"
          >
            <!-- Image Layer -->
            <div class="aspect-video bg-slate-100 overflow-hidden relative group-hover:scale-105 transition-transform duration-700">
              <NuxtImg
                v-if="post.image"
                :src="post.image"
                loading="lazy"
                class="w-full h-full object-cover"
                :alt="post.title"
              />
              <div v-else class="w-full h-full relative overflow-hidden bg-slate-900 flex items-center justify-center">
                <img loading="lazy" src="/images/fallback-post.png" class="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay" />
                <div class="relative z-10 text-center px-4">
                  <div class="text-[#3c59b0] font-black text-[10px] uppercase tracking-[0.2em] mb-1">Novel Solar</div>
                  <span class="material-symbols-outlined text-white/20 text-2xl">solar_power</span>
                </div>
              </div>
            </div>

            <!-- Content Layer -->
            <div class="p-8 flex flex-col flex-grow">
              <!-- Date Display -->
              <div class="flex items-center gap-2 mb-4">
                 <span class="text-xs font-bold text-[#002888] uppercase tracking-widest">{{ formatDate(post.date) }}</span>
              </div>

              <!-- Title -->
              <h3 class="text-xl font-bold text-slate-900 mb-4 group-hover:text-[#002888] transition-colors line-clamp-2 leading-tight">
                {{ post.title }}
              </h3>

              <!-- Excerpt -->
              <p v-if="post.excerpt" class="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-6 font-medium">
                {{ post.excerpt }}
              </p>

              <!-- Bottom CTA -->
              <div class="mt-auto flex items-center gap-2 text-[#002888] font-bold text-xs uppercase tracking-widest">
                Read More
                <span class="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-20 border-2 border-dashed border-slate-200 rounded-2xl">
        <div class="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 mx-auto shadow-sm">
          <span class="material-symbols-outlined text-4xl text-slate-200">article</span>
        </div>
        <h3 class="text-2xl font-black text-slate-900 mb-3 uppercase tracking-tighter italic">First Insights Coming Soon</h3>
        <p class="text-slate-500 max-w-sm mx-auto font-medium">We're currently preparing our first batch of high-performance solar insights. Check back shortly!</p>
        <NuxtLink to="/" class="mt-8 text-[#002888] font-bold text-sm hover:underline block">
          &larr; Back to Home
        </NuxtLink>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const { data: allPosts, pending } = await useAsyncData('blog-hub', () => {
  return queryContent('blog').sort({ date: -1 }).find()
})

const formatDate = (dateString) => {
  if (!dateString) return 'Latest Release'
  return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(dateString))
}

useHead({
  title: 'Blog | Novel Solar Insights & Technology News',
  meta: [
    { name: 'description', content: 'Explore latest solar technology insights, maintenance guides, and sustainable energy news from the experts at Novel Solar.' }
  ]
})
</script>

<style scoped>
/* Optional: Adding custom hover smoothing for the whole card */
.group {
  backface-visibility: hidden;
  transform: translateZ(0);
}
</style>
