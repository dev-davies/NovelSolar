<template>
  <div class="min-h-screen bg-[#FDFDFD]">
    <!-- Section 1: The Top Logo Banner -->
    <div class="w-full bg-white border-b border-gray-100 py-4 px-8 flex justify-center">
      <div class="h-12 md:h-16 flex items-center justify-center font-black text-2xl text-[#002888] italic tracking-tighter uppercase">
        NovelSolar <span class="text-blue-400 mx-2">×</span> HAISIC
      </div>
    </div>

    <!-- Section 2: The Hero Section -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div class="grid md:grid-cols-2 gap-12 items-center">
        <div v-reveal>
          <h1 class="text-5xl font-extrabold text-[#002888] mb-6 leading-tight">
            Next-Gen Smart Energy for Your Business & Home
          </h1>
          <p class="text-xl text-gray-700 max-w-2xl mb-12 leading-relaxed font-medium">
            Discover the future of power with Haisic. Specialized solar solutions designed for maximum efficiency and durability.
          </p>
          <NuxtLink to="/partners/haisic/shop" class="inline-block bg-[#002888] text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-900 transition-all shadow-lg hover:shadow-[#002888]/20 active:scale-95">
            Shop Haisic Collection &rarr;
          </NuxtLink>
        </div>
        <div class="relative" v-reveal>
          <div class="rounded-3xl shadow-2xl w-full aspect-[4/3] bg-slate-100 flex items-center justify-center overflow-hidden">
             <span class="material-symbols-outlined text-9xl text-slate-200">business</span>
          </div>
          <div class="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl hidden lg:block border border-slate-100">
            <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Efficiency Rating</div>
            <div class="text-3xl font-black text-[#002888]">A+++</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 3: The Introduction -->
    <section class="bg-white py-32 border-y border-slate-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-2 gap-16 items-center">
          <div v-reveal>
            <div class="rounded-2xl shadow-lg w-full aspect-video bg-slate-50 flex items-center justify-center border border-slate-100 overflow-hidden">
                <span class="material-symbols-outlined text-8xl text-slate-200">settings_suggest</span>
            </div>
          </div>
          <div v-reveal>
            <h2 class="text-4xl font-black text-gray-900 mb-6 tracking-tight">The Haisic Advantage</h2>
            <p class="text-lg text-gray-600 mb-8 leading-relaxed font-medium">
              We specialize in high-load industrial and residential solar systems that handle heavy appliances with ease. No more compromise on your comfort or productivity.
            </p>
            <div class="space-y-5">
              <div v-for="(item, i) in ['High Load Capacity', 'Industrial Grade Build', 'Smart Power Balancing']" :key="i" class="flex items-center gap-4">
                <div class="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
                  <svg class="w-4 h-4 text-[#002888]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
                </div>
                <span class="font-bold text-gray-800 tracking-tight">{{ item }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 6: Final CTA -->
    <section class="bg-[#002888] text-white py-32 text-center px-4 relative overflow-hidden">
      <!-- Decor -->
      <div class="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl"></div>
      <div class="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full -ml-48 -mb-48 blur-3xl"></div>
      
      <div class="relative z-10 max-w-3xl mx-auto" v-reveal>
        <h2 class="text-4xl md:text-6xl font-black mb-8 tracking-tighter uppercase italic">Step into the Light.</h2>
        <p class="text-xl mb-12 opacity-80 max-w-xl mx-auto leading-relaxed font-medium">
          Haisic energy systems are now available with exclusive launch-day bundles.
        </p>
        <NuxtLink to="/partners/haisic/shop" class="inline-block bg-white text-[#002888] px-12 py-5 rounded-full text-xl font-black hover:bg-gray-100 transition-all shadow-2xl active:scale-95 uppercase tracking-tight">
          Browse Haisic Inventory
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup>
useHead({
  title: 'Haisic High-Performance Solar | NovelSolar Partner',
  meta: [
    { name: 'description', content: 'Explore Haisic industrial and residential solar solutions. Built for power, designed for durability.' }
  ]
})
</script>

<style scoped>
.font-primary {
  font-family: 'Inter', sans-serif;
}
</style>
