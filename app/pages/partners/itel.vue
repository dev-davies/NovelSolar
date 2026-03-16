<template>
  <div class="min-h-screen bg-[#FDFDFD]">
    <!-- Section 1: The Top Logo Banner -->
    <div class="w-full bg-white border-b border-gray-100 py-4 px-8 flex justify-center">
      <img src="/images/logo-new-novel.-itel.png" alt="NovelSolar x itel" class="h-12 md:h-16 w-auto object-contain" />
    </div>

    <!-- Section 2: The Hero Section -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div class="grid md:grid-cols-2 gap-12 items-center">
        <div v-reveal>
          <h1 class="text-5xl font-extrabold text-[#002888] mb-6 leading-tight">
            NovelSolar x itel: A Powerful Strategic Alliance
          </h1>
          <p class="text-xl text-gray-700 max-w-2xl mb-12 leading-relaxed">
            Bringing world-class energy reliability and smart storage innovations to Nigeria’s commercial landscape.
          </p>
          <NuxtLink to="/quote" class="inline-block bg-[#002888] text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-900 transition-all shadow-lg hover:shadow-[#002888]/20">
            Request a Partner Quote &rarr;
          </NuxtLink>
        </div>
        <div class="relative" v-reveal>
          <img src="/images/itel 3.png" alt="itel Solar Solution" class="rounded-3xl shadow-2xl w-full object-cover aspect-[4/3]" />
          <div class="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl hidden lg:block">
            <div class="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Reliability Rate</div>
            <div class="text-3xl font-black text-[#002888]">99.9%</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 3: The Introduction -->
    <section class="bg-white py-32">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-2 gap-16 items-center">
          <div v-reveal>
            <img src="/images/itel.jpg" alt="itel Brand Power" class="rounded-2xl shadow-lg w-full" />
          </div>
          <div v-reveal>
            <h2 class="text-4xl font-bold text-gray-900 mb-6">Powering African Business</h2>
            <p class="text-lg text-gray-600 mb-6 leading-relaxed">
              Our partnership combines NovelSolar’s deep local logistics expertise with itel’s global leadership in electronics and smart energy storage. Together, we are bridging the energy gap for Nigerian enterprises through sustainable, scalable technology.
            </p>
            <div class="space-y-4">
              <div v-for="(item, i) in ['High-Efficiency Cells', 'Cloud-Based Monitoring', 'Local Technical Support']" :key="i" class="flex items-center gap-3">
                <div class="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center">
                  <svg class="w-4 h-4 text-[#002888]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
                </div>
                <span class="font-semibold text-gray-800">{{ item }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 4: itel Product Spotlight -->
    <section class="bg-gray-50 py-32">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-3 gap-12 items-center">
          <div class="md:col-span-2" v-reveal>
            <img src="/images/itel-5-600x600.webp" alt="itel Smart Inverter" class="max-w-md mx-auto drop-shadow-2xl hover:scale-105 transition-transform duration-700" />
          </div>
          <div v-reveal>
            <h3 class="text-3xl font-bold text-gray-900 mb-6 font-primary">itel Smart Inverter Series</h3>
            <ul class="space-y-4 mb-8">
              <li class="flex flex-col">
                <span class="text-sm font-bold text-gray-400 uppercase tracking-tighter">Peak Efficiency</span>
                <span class="text-lg font-medium text-gray-800">Up to 98.4% Efficiency</span>
              </li>
              <li class="flex flex-col">
                <span class="text-sm font-bold text-gray-400 uppercase tracking-tighter">Surge Capacity</span>
                <span class="text-lg font-medium text-gray-800">3X Rated Output for Motor Loads</span>
              </li>
              <li class="flex flex-col">
                <span class="text-sm font-bold text-gray-400 uppercase tracking-tighter">Protection</span>
                <span class="text-lg font-medium text-gray-800">IP65 Rated Weatherproofing</span>
              </li>
            </ul>
            <NuxtLink to="/quote" class="inline-block border border-[#002888] text-[#002888] px-8 py-3 rounded-full font-bold hover:bg-blue-50 transition-colors">
              Download Datasheet
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 5: Key Technical Benefits -->
    <section class="py-32">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-2 gap-16">
          <!-- Benefit 1 -->
          <div class="flex flex-col gap-8" v-reveal>
            <div class="h-[400px] overflow-hidden rounded-3xl">
              <img src="/images/itel 2.jpg" alt="Integration" class="w-full h-full object-cover" />
            </div>
            <div>
              <h4 class="text-2xl font-bold text-gray-900 mb-4">Seamless System Integration</h4>
              <p class="text-gray-600 leading-relaxed">Designed for rapid deployment. The itel ecosystem allows for plug-and-play synchronization between inverters, batteries, and solar arrays, reducing installation time by 40%.</p>
            </div>
          </div>
          <!-- Benefit 2 -->
          <div class="flex flex-col gap-8" v-reveal>
            <div class="h-[400px] overflow-hidden rounded-3xl">
              <img src="/images/itel 1.jpg" alt="Management" class="w-full h-full object-cover" />
            </div>
            <div>
              <h4 class="text-2xl font-bold text-gray-900 mb-4">Intelligent Energy Management & Warranty</h4>
              <p class="text-gray-600 leading-relaxed">Backed by a comprehensive 5-year replacement warranty and itel’s proprietary AI-driven battery management system (BMS) for longer cycle life.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 6: The Final High-Conversion CTA -->
    <section class="bg-[#002888] text-white py-24 text-center mt-32 px-4 relative overflow-hidden">
      <!-- Decor -->
      <div class="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
      <div class="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32"></div>
      
      <div class="relative z-10 max-w-3xl mx-auto" v-reveal>
        <h2 class="text-4xl md:text-5xl font-extrabold mb-8">Ready to Scale with itel & NovelSolar?</h2>
        <p class="text-lg mb-12 opacity-90 max-w-xl mx-auto leading-relaxed">
          Contact our enterprise team for special partner pricing, technical support, and prioritized inventory allocation.
        </p>
        <NuxtLink to="/quote" class="inline-block bg-white text-[#002888] px-12 py-5 rounded-full text-xl font-bold hover:bg-gray-100 transition-all shadow-2xl active:scale-95">
          Let's Discuss Partnership &rarr;
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup>
useHead({
  title: 'NovelSolar x itel | Strategic Energy Partnership',
  meta: [
    { name: 'description', content: 'Specialist B2B energy partnership between NovelSolar and itel providing smart storage and reliable solar solutions for Nigerian businesses.' }
  ]
})
</script>

<style scoped>
.font-primary {
  font-family: 'Inter', sans-serif;
}
</style>
