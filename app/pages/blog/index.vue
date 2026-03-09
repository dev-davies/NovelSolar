<template>
  <div>
    <!-- Featured Article Hero -->
    <section class="relative h-[600px] flex items-center overflow-hidden">
      <!-- Background Image -->
      <div class="absolute inset-0 z-0">
        <img src="/images/blog_featured_hero_1773069104174.png" alt="Featured Article" class="w-full h-full object-cover brightness-[0.4]" />
      </div>
      
      <!-- Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div class="max-w-3xl">
          <div class="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-primary text-white mb-8 border border-white/20">
            Featured Article
          </div>
          <h1 class="text-4xl sm:text-6xl font-extrabold text-white leading-tight mb-8">
            The 2026 Global Solar Outlook: <span class="text-blue-400">Paving the Way to Net Zero</span>
          </h1>
          <p class="text-xl text-gray-300 mb-10 leading-relaxed">
            Leading experts analyze how the next generation of perovskite technology and smart grid integration is accelerating our transition to a 100% renewable future.
          </p>
          <B24Button 
            color="white" 
            size="lg" 
            class="px-10 py-5 text-lg font-extrabold rounded-2xl shadow-2xl hover:bg-gray-100 transition-all text-primary"
          >
            Read the Full Report
          </B24Button>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      
      <!-- Section Header -->
      <div class="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
        <div>
          <h2 class="text-3xl font-extrabold text-gray-900 tracking-tight italic">Latest Articles</h2>
          <p class="text-gray-500 mt-2 text-lg">Curated insights from the frontlines of energy innovation.</p>
        </div>
        <div class="flex gap-4">
          <B24Button variant="outline" size="sm" class="rounded-xl font-bold bg-white">All Topics</B24Button>
          <B24Button variant="outline" size="sm" class="rounded-xl font-bold bg-white opacity-40">Technology</B24Button>
          <B24Button variant="outline" size="sm" class="rounded-xl font-bold bg-white opacity-40">Logistics</B24Button>
        </div>
      </div>

      <!-- Blog Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <B24Card v-for="post in posts" :key="post.id" class="group h-full border-none shadow-sm hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden bg-white flex flex-col">
          <template #header>
            <div class="aspect-[16/10] overflow-hidden relative">
              <img :src="post.image" :alt="post.title" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
              <div class="absolute bottom-4 left-4">
                <span class="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[10px] font-extrabold text-gray-900 uppercase tracking-widest shadow-lg">
                  {{ post.category }}
                </span>
              </div>
            </div>
          </template>
          
          <div class="p-8 flex flex-col flex-grow">
            <div class="flex items-center gap-3 mb-4 text-xs font-semibold text-gray-400">
              <time>{{ post.date }}</time>
              <span class="w-1 h-1 rounded-full bg-gray-200"></span>
              <span>{{ post.readTime }}</span>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-primary transition-colors line-clamp-2">
              {{ post.title }}
            </h3>
            <p class="text-gray-500 text-sm mb-8 line-clamp-3 leading-relaxed flex-grow">
              {{ post.excerpt }}
            </p>
            <div class="pt-6 border-t border-gray-50 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-gray-100 border border-gray-100 overflow-hidden flex items-center justify-center font-bold text-[10px] text-primary">
                  {{ post.author.initials }}
                </div>
                <span class="text-xs font-bold text-gray-700">{{ post.author.name }}</span>
              </div>
              <NuxtLink :to="`/blog/${post.id}`" class="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-primary hover:bg-primary hover:text-white hover:border-primary transition-all group-hover:shadow-lg">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </NuxtLink>
            </div>
          </div>
        </B24Card>
      </div>

      <!-- Pagination -->
      <div class="mt-20 flex justify-center">
        <div class="inline-flex items-center p-1.5 bg-white rounded-2xl shadow-sm border border-gray-100 gap-1">
          <B24Button variant="outline" size="sm" class="w-10 h-10 p-0 rounded-xl border-none hover:bg-gray-50">
            <svg class="w-4 h-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
          </B24Button>
          <B24Button size="sm" color="primary" class="w-10 h-10 p-0 rounded-xl font-bold">1</B24Button>
          <B24Button variant="outline" size="sm" class="w-10 h-10 p-0 rounded-xl border-none hover:bg-gray-50 font-bold text-gray-400">2</B24Button>
          <B24Button variant="outline" size="sm" class="w-10 h-10 p-0 rounded-xl border-none hover:bg-gray-50 font-bold text-gray-400">3</B24Button>
          <span class="px-2 text-gray-300">...</span>
          <B24Button variant="outline" size="sm" class="w-10 h-10 p-0 rounded-xl border-none hover:bg-gray-50 font-bold text-gray-400">12</B24Button>
          <B24Button variant="outline" size="sm" class="w-10 h-10 p-0 rounded-xl border-none hover:bg-gray-50">
            <svg class="w-4 h-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
          </B24Button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
const posts = [
  {
    id: 1,
    title: 'Optimizing supply chain for utility-scale solar',
    excerpt: 'Best practices for managing multi-megawatt components dispatch and local warehousing in the new era of energy demand.',
    category: 'Logistics',
    date: 'March 08, 2026',
    readTime: '8 min read',
    image: '/images/blog_article_logistic_1773069124505.png',
    author: { name: 'Sarah Chen', initials: 'SC' }
  },
  {
    id: 2,
    title: 'The Future of bifacial solar technology',
    excerpt: 'Exploring how recent breakthroughs in cell architecture are driving down double-sided yields and ROI cycles.',
    category: 'Technology',
    date: 'March 05, 2026',
    readTime: '5 min read',
    image: '/images/industry_insights_1_1773068313772.png',
    author: { name: 'Marcus Bell', initials: 'MB' }
  },
  {
    id: 3,
    title: 'Smart cities: Building integrated PV',
    excerpt: 'How BIPV is transforming urban energy landscapes and increasing property value through aesthetic innovation.',
    category: 'Architecture',
    date: 'Feb 28, 2026',
    readTime: '4 min read',
    image: '/images/industry_insights_3_1773068348559.png',
    author: { name: 'Dr. Elena Rossi', initials: 'ER' }
  },
  {
    id: 4,
    title: 'Residential storage: The lithium vs sodium debate',
    excerpt: 'Comparing energy density, cost, and safety for next-gen home backup systems. Is sodium-ion finally ready?',
    category: 'Technology',
    date: 'Feb 24, 2026',
    readTime: '12 min read',
    image: '/images/solar_battery_inventory_1773068296812.png',
    author: { name: 'Sarah Chen', initials: 'SC' }
  },
  {
    id: 5,
    title: 'Navigating federal solar tax credits in 2026',
    excerpt: 'A comprehensive guide to the latest legislative updates and how to maximize your project ROI.',
    category: 'Finance',
    date: 'Feb 20, 2026',
    readTime: '6 min read',
    image: '/images/blog_featured_hero_1773069104174.png',
    author: { name: 'James Miller', initials: 'JM' }
  },
  {
    id: 6,
    title: 'Automation in large-scale solar O&M',
    excerpt: 'How drone inspections and automated cleaning robots are drastically reducing long-term maintenance costs.',
    category: 'Logistics',
    date: 'Feb 15, 2026',
    readTime: '9 min read',
    image: '/images/industry_insights_2_1773068331524.png',
    author: { name: 'Dr. Elena Rossi', initials: 'ER' }
  }
];
</script>
