<template>
  <div class="min-h-screen bg-white font-sans selection:bg-emerald-500/30">
    <!-- 1. Top Partner Banner -->
    <div class="bg-white w-full py-6 flex justify-center items-center border-b border-gray-100">
      <img 
        src="/images/yinergy_partner.png" 
        alt="Novel Solar x Yinergy Partnership" 
        class="h-12 md:h-16 w-auto object-contain mx-auto"
      />
    </div>

    <!-- 2. Hero Section -->
    <section class="relative bg-slate-950 py-24 md:py-32 overflow-hidden">
      <!-- Background Glow -->
      <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-[#2CA84A]/10 rounded-full blur-[120px] -mr-64 -mt-64"></div>
      <div class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-900/10 rounded-full blur-[120px] -ml-64 -mb-64"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="grid lg:grid-cols-2 gap-16 items-center text-left">
          <div v-reveal>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[#2CA84A] text-xs font-bold uppercase tracking-widest mb-8">
              <span class="w-2 h-2 rounded-full bg-[#2CA84A] animate-pulse"></span>
              New Partnership
            </div>
            <h1 class="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-[1.1]">
              Intelligent Energy.<br />
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#2CA84A] to-emerald-600 italic">The Yinergy Advantage.</span>
            </h1>
            <p class="text-xl text-slate-400 max-w-xl mb-12 leading-relaxed font-medium">
              Novel Solar is proud to partner with Yinergy to bring you scalable, high-performance energy storage and hybrid inverter systems.
            </p>
            <NuxtLink 
              to="/partners/yinergy/shop" 
              class="inline-flex items-center gap-2 bg-[#2CA84A] text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-emerald-500 transition-all shadow-2xl shadow-[#2CA84A]/20 active:scale-95 group"
            >
              Shop the Yinergy Collection
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </NuxtLink>
          </div>
          <div v-reveal class="relative hidden lg:block">
            <div class="absolute inset-0 bg-[#2CA84A]/20 rounded-full blur-[100px] -z-10 animate-pulse"></div>
            <img 
              src="/images/yinergy1.png" 
              alt="Yinergy Industrial Solution" 
              class="w-full h-auto drop-shadow-[0_20px_50px_rgba(44,168,74,0.3)] hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- 3. The 'Why Yinergy?' Section (Tech Specs) -->
    <section class="py-24 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-20">
        <h2 v-reveal class="text-4xl font-black text-slate-900 tracking-tight uppercase italic mb-4">Why Choose Yinergy?</h2>
        <div v-reveal class="w-20 h-1.5 bg-[#2CA84A] mx-auto rounded-full"></div>
      </div>
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-3 gap-12">
          <!-- Spec 1 -->
          <div v-reveal class="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-colors group">
            <div class="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <span class="material-symbols-outlined text-3xl text-[#2CA84A]">settings_input_component</span>
            </div>
            <h3 class="text-xl font-black text-slate-900 mb-4">Hybrid Technology</h3>
            <p class="text-slate-500 font-medium leading-relaxed italic">
              Advanced power conversion systems that seamlessly manage solar, grid, and battery storage for maximum reliability.
            </p>
          </div>

          <!-- Spec 2 -->
          <div v-reveal class="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-colors group">
            <div class="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <span class="material-symbols-outlined text-3xl text-[#2CA84A]">cloud_sync</span>
            </div>
            <h3 class="text-xl font-black text-slate-900 mb-4">YiCloud Management</h3>
            <p class="text-slate-500 font-medium leading-relaxed italic">
              Real-time monitoring and smart optimization via the YiCloud platform, giving you full control over your energy ecosystem.
            </p>
          </div>

          <!-- Spec 3 -->
          <div v-reveal class="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-colors group">
            <div class="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <span class="material-symbols-outlined text-3xl text-[#2CA84A]">factory</span>
            </div>
            <h3 class="text-xl font-black text-slate-900 mb-4">C&I Scalability</h3>
            <p class="text-slate-500 font-medium leading-relaxed italic">
              Tailored for Commercial & Industrial demand, offering modular expansion to meet the growing needs of your enterprise.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. Feature Showcase (Alternating Layout) -->
    <section class="py-24 space-y-32">
      <!-- Row 1 -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-2 gap-16 items-center">
          <div v-reveal class="order-2 md:order-1">
            <div class="inline-block px-3 py-1 rounded bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest mb-6 italic">Yi-Hybrid Series</div>
            <h2 class="text-4xl font-black text-slate-900 mb-6 leading-tight">Intelligent <br /><span class="text-[#2CA84A]">Power Conversion.</span></h2>
            <p class="text-lg text-slate-600 font-medium leading-relaxed mb-8">
              Experience industry-leading efficiency and smart routing technology designed to optimize every watt of energy your system generates.
            </p>
            <div class="flex items-center gap-6">
              <div class="text-center">
                <div class="text-3xl font-black text-[#2CA84A]">98.4%</div>
                <div class="text-xs font-bold text-slate-400 uppercase tracking-tighter">Efficiency</div>
              </div>
              <div class="w-px h-10 bg-slate-200"></div>
              <div class="text-center">
                <div class="text-3xl font-black text-[#2CA84A]">Smart</div>
                <div class="text-xs font-bold text-slate-400 uppercase tracking-tighter">Routing</div>
              </div>
            </div>
          </div>
          <div v-reveal class="order-1 md:order-2">
            <div class="relative">
              <div class="absolute inset-0 bg-emerald-600/5 translate-x-4 translate-y-4 rounded-3xl"></div>
              <img 
                src="/images/Yinergy2.png" 
                alt="Yinergy Hybrid Inverter" 
                class="rounded-3xl shadow-xl w-full object-cover relative z-10 hover:-translate-y-2 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Row 2 -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-2 gap-16 items-center md:flex-row-reverse">
          <div v-reveal class="md:order-1">
            <div class="relative">
              <div class="absolute inset-0 bg-emerald-600/5 -translate-x-4 translate-y-4 rounded-3xl"></div>
              <img 
                src="/images/yinergy3.png" 
                alt="Yinergy Energy Storage" 
                class="rounded-3xl shadow-xl w-full object-cover relative z-10 hover:-translate-y-2 transition-transform duration-500"
              />
            </div>
          </div>
          <div v-reveal class="md:order-2">
            <div class="inline-block px-3 py-1 rounded bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest mb-6 italic">Yi-Storage Pro</div>
            <h2 class="text-4xl font-black text-slate-900 mb-6 leading-tight">High-Density <br /><span class="text-[#2CA84A]">Energy Storage.</span></h2>
            <p class="text-lg text-slate-600 font-medium leading-relaxed mb-8">
              Future-proof your energy with Yinergy's high-cycle LFP technology, offering unmatched durability and safety for large-scale energy requirements.
            </p>
            <div class="flex items-center gap-6 mb-10">
              <div class="text-center">
                <div class="text-3xl font-black text-[#2CA84A]">10k+</div>
                <div class="text-xs font-bold text-slate-400 uppercase tracking-tighter">Life Cycles</div>
              </div>
              <div class="w-px h-10 bg-slate-200"></div>
              <div class="text-center">
                <div class="text-3xl font-black text-[#2CA84A]">LFP</div>
                <div class="text-xs font-bold text-slate-400 uppercase tracking-tighter">Chemistry</div>
              </div>
            </div>
            <NuxtLink 
              v-reveal
              to="/partners/yinergy/shop" 
              class="inline-flex items-center gap-2 bg-[#2CA84A] text-white px-8 py-4 rounded-xl font-bold text-sm hover:bg-emerald-500 transition-all shadow-lg active:scale-95 group"
            >
              Shop Yinergy Smart Systems
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- 5. Technical Precision Gallery -->
    <section class="py-24 bg-slate-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <h2 v-reveal class="text-3xl font-black text-slate-900 tracking-tight uppercase italic mb-4">Technical Precision</h2>
        <p v-reveal class="text-slate-500 font-medium italic">Inside the Yinergy ecosystem: Engineered for performance and longevity.</p>
      </div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-3 gap-8">
          <div v-reveal class="group cursor-pointer">
            <div class="overflow-hidden rounded-2xl aspect-square bg-white border border-slate-200">
              <img src="/images/yinergy4.png" alt="Yinergy Core Technology" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
          </div>
          <div v-reveal class="group cursor-pointer">
            <div class="overflow-hidden rounded-2xl aspect-square bg-white border border-slate-200">
              <img src="/images/yinergy5.png" alt="Yinergy Smart Interface" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
          </div>
          <div v-reveal class="group cursor-pointer">
            <div class="overflow-hidden rounded-2xl aspect-square bg-white border border-slate-200">
              <img src="/images/yinergy1.png" alt="Yinergy Industrial Scale" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 6. Bottom CTA -->
    <section class="py-24 bg-[#2CA84A] relative overflow-hidden">
      <!-- Decor -->
      <div class="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
      <div class="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full -ml-48 -mb-48 blur-3xl"></div>

      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 v-reveal class="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter uppercase italic">Ready to upgrade your power?</h2>
        <p v-reveal class="text-xl text-emerald-100 mb-12 font-medium opacity-80">
          Professional installation and a 5-year replacement warranty come standard with every Yinergy system.
        </p>
        <NuxtLink 
          v-reveal
          to="/partners/yinergy/shop" 
          class="inline-block bg-white text-[#2CA84A] px-12 py-5 rounded-2xl font-black text-xl hover:bg-slate-50 transition-all shadow-2xl active:scale-95 uppercase tracking-tight"
        >
          Browse Yinergy Inventory
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup>
useHead({
  title: 'Yinergy Intelligent Energy Solutions | NovelSolar Partner',
  meta: [
    { name: 'description', content: 'Explore Yinergy intelligent energy storage and hybrid inverter systems. Engineered for performance and scalability.' }
  ]
})
</script>

<style scoped>
.font-primary {
  font-family: 'Inter', sans-serif;
}
</style>
