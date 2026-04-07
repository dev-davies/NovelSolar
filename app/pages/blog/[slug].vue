<template>
  <div class="min-h-screen bg-white font-sans selection:bg-[#002888]/10">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <NuxtLink to="/blog" class="inline-flex items-center text-[#002888] font-bold text-sm hover:underline group">
        <span class="material-symbols-outlined text-sm mr-2 transform group-hover:-translate-x-1 transition-all">arrow_back</span>
        Back to Blog Hub
      </NuxtLink>
    </div>

    <ContentDoc v-slot="{ doc }">
      <Head>
        <Title>{{ `${doc.title} | Novel Solar Insights` }}</Title>
        <Meta name="description" :content="doc.description || defaultDescription" />
        <Meta property="og:title" :content="doc.title" />
        <Meta property="og:description" :content="doc.description || defaultDescription" />
        <Meta property="og:image" :content="doc.image ? toAbsoluteImage(doc.image) : fallbackOgImage" />
        <Meta property="og:url" :content="`${siteBaseUrl}${route.path}`" />
        <Meta name="twitter:card" content="summary_large_image" />
      </Head>

      <article class="max-w-4xl mx-auto px-4 pb-24">
        <header class="text-center mb-14">
          <p class="text-sm text-slate-500 mb-5">{{ formatDate(doc.date) }}</p>
          <h1 class="text-4xl md:text-6xl font-black text-slate-900 leading-tight tracking-tight">
            {{ doc.title }}
          </h1>
        </header>

        <div class="aspect-video bg-slate-50 rounded-3xl overflow-hidden shadow-xl border border-slate-100 mb-14">
          <NuxtImg
            v-if="doc.image"
            :src="doc.image"
            width="1200"
            height="675"
            loading="lazy"
            format="webp"
            class="w-full h-full object-cover"
            :alt="doc.title"
          />
          <NuxtImg
            v-else
            src="/images/fallback-post.png"
            width="1200"
            height="675"
            loading="lazy"
            format="webp"
            class="w-full h-full object-cover"
            :alt="doc.title"
          />
        </div>

        <div class="prose prose-slate lg:prose-xl max-w-none prose-headings:font-black prose-a:text-[#002888] prose-a:font-bold">
          <ContentRenderer :value="doc" />
        </div>
      </article>

      <template #not-found>
        <div class="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
          <h1 class="text-4xl md:text-5xl font-black text-slate-900 mb-4">Insight Not Found</h1>
          <p class="text-slate-500 mb-8">The article you are looking for does not exist.</p>
          <NuxtLink to="/blog" class="inline-flex items-center gap-2 bg-[#002888] text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-900 transition-all">
            Back to Blog
          </NuxtLink>
        </div>
      </template>
    </ContentDoc>
  </div>
</template>

<script setup>
const route = useRoute()
const runtimeConfig = useRuntimeConfig()
const siteBaseUrl = runtimeConfig.public.baseUrl?.replace(/\/$/, '') || 'https://novel-solar.vercel.app'
const fallbackOgImage = `${siteBaseUrl}/images/fallback-post.png`
const defaultDescription = 'Discover in-depth solar technology expertise.'

const formatDate = (dateString) => {
  if (!dateString) return 'Latest Release'
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(dateString))
}

const toAbsoluteImage = (path) => {
  if (!path) return fallbackOgImage
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return `${siteBaseUrl}${path.startsWith('/') ? path : `/${path}`}`
}

useSeoMeta({
  title: 'Novel Solar Insights',
  description: defaultDescription,
  ogUrl: () => `${siteBaseUrl}${route.path}`,
  twitterCard: 'summary_large_image'
})
</script>
