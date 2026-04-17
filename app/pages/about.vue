<template>
  <div>
    <!-- Hero Section -->
    <section class="@container">
      <div class="p-0 @[480px]:p-4 max-w-7xl mx-auto">
        <div class="flex min-h-[520px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-xl items-center justify-center p-6 text-center" data-alt="Solar panels reflecting sunlight on a Nigerian roof" style='background-image: linear-gradient(rgba(13, 57, 140, 0.7) 0%, rgba(13, 57, 140, 0.9) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuAUleS9NdbgEzcALMpvnOo5_pYgzqwwNam92Nvbi180gu4G8da_8xZtBEYOnEMH1RPXg_1Tzu_tZTwfzI1V9XhHVJ21vgWpFjftmEU6WeR1vYjTDZZqu164jeIhi5-QgQrJLv39VzP7awFCBikooEaiuvlhxOpHZQq6mcEgMOR8DLq1B6cSAJHR3KNEniu_i4_ZnOJwtm4w0DjvO0yBRDy2Ap_2DydIHGW3AKKe7LM_56Q7kQWLlo5hgXkppm6wwLOwxlOYHKwVhFw");'>
          <div class="flex flex-col gap-4 max-w-3xl">
            <h1 class="text-white text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-6xl">
              Empowering Nigeria with sustainable energy solutions.
            </h1>
            <p class="text-white/90 text-lg font-normal leading-relaxed @[480px]:text-xl">
              Leading the charge towards a greener, brighter future for every Nigerian home and business.
            </p>
          </div>
          <div class="flex flex-wrap gap-4 justify-center">
            <button class="flex min-w-[140px] cursor-pointer items-center justify-center rounded-lg h-12 px-6 bg-white text-primary text-base font-bold transition-transform active:scale-95">
              Our Mission
            </button>
            <button class="flex min-w-[140px] cursor-pointer items-center justify-center rounded-lg h-12 px-6 bg-primary/20 border border-white/30 text-white text-base font-bold backdrop-blur-sm">
              View Impact
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Our Story Section -->
    <section class="max-w-7xl mx-auto px-4 py-16 md:py-24">
      <div class="grid md:grid-cols-2 gap-12 items-center">
        <div class="order-2 md:order-1">
          <h2 class="text-primary text-sm font-bold uppercase tracking-widest mb-3">Our Journey</h2>
          <h3 class="text-3xl md:text-4xl font-extrabold mb-6 leading-tight">A decade of lighting up Nigeria</h3>
          <p class="text-slate-600 dark:text-slate-400 text-lg mb-6">
            Founded with a vision to tackle Nigeria's energy challenges, Novel Solar has grown from a small startup to a leader in renewable energy. Our journey began with a single installation in Lagos and has since expanded nationwide.
          </p>
          <p class="text-slate-600 dark:text-slate-400 text-lg">
            We are driven by a passion for innovation and a commitment to sustainable development. Today, we don't just sell solar panels; we provide energy independence to thousands of families and businesses across the continent.
          </p>
        </div>
        <div class="order-1 md:order-2 relative">
          <div class="aspect-square bg-primary/10 rounded-2xl overflow-hidden">
            <img loading="lazy" alt="Engineers working on a solar farm" class="w-full h-full object-cover" data-alt="Engineers installing high-efficiency solar panels" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAp9i-W1AJUW5HVrRnO3eV4M7iTNUBhCbNe5Cj8ZPb3Z8MXKKK9d8is90qGRULlQqPUqcRSdQ6nfFf7A32_tHVLaN2-XyN68cmuQRDHmNEij3NWKaClUQI0nnOOkrJZr2UiVFiqcjxseyvrTsitQqc_18k7LnITZ1HjoDuLf4q-e5mSVplpojU2UDEJUfrZubdm-GvWVsFLWK1O5F3zx8JeYLckyt2_K5E3aRPhJU-OtDkGVhlxL2qAE9wft3OTBkXmbLIkHfR9Tyw"/>
          </div>
          <div class="absolute -bottom-6 -left-6 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-xl hidden lg:block">
            <div class="text-primary font-bold text-4xl">10+</div>
            <div class="text-slate-500 text-sm">Years of Excellence</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Impact Stats -->
    <section class="bg-[#002888] py-16">
      <div class="max-w-7xl mx-auto px-4">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div class="flex flex-col gap-2">
            <span class="text-white text-4xl md:text-5xl font-black">5,000+</span>
            <span class="text-white/70 text-sm font-medium uppercase tracking-wider">Installations</span>
          </div>
          <div class="flex flex-col gap-2">
            <span class="text-white text-4xl md:text-5xl font-black">12MW</span>
            <span class="text-white/70 text-sm font-medium uppercase tracking-wider">Energy Generated</span>
          </div>
          <div class="flex flex-col gap-2">
            <span class="text-white text-4xl md:text-5xl font-black">25k</span>
            <span class="text-white/70 text-sm font-medium uppercase tracking-wider">Tons CO2 Saved</span>
          </div>
          <div class="flex flex-col gap-2">
            <span class="text-white text-4xl md:text-5xl font-black">36</span>
            <span class="text-white/70 text-sm font-medium uppercase tracking-wider">States Reached</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Core Values -->
    <section class="max-w-7xl mx-auto px-4 py-16 md:py-24">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-extrabold mb-4">Our Core Values</h2>
        <div class="w-20 h-1.5 bg-primary mx-auto rounded-full"></div>
      </div>
      <div class="grid md:grid-cols-3 gap-8">
        <!-- Value 1 -->
        <div class="bg-white dark:bg-slate-800/50 p-8 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
          <div class="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-6">
            <span class="material-symbols-outlined text-3xl">eco</span>
          </div>
          <h4 class="text-xl font-bold mb-3">Sustainability</h4>
          <p class="text-slate-600 dark:text-slate-400">
            We prioritize environmental health and long-term viability in every project we undertake.
          </p>
        </div>
        <!-- Value 2 -->
        <div class="bg-white dark:bg-slate-800/50 p-8 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
          <div class="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-6">
            <span class="material-symbols-outlined text-3xl">lightbulb</span>
          </div>
          <h4 class="text-xl font-bold mb-3">Innovation</h4>
          <p class="text-slate-600 dark:text-slate-400">
            Constantly seeking better technologies to improve energy efficiency for the African market.
          </p>
        </div>
        <!-- Value 3 -->
        <div class="bg-white dark:bg-slate-800/50 p-8 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
          <div class="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-6">
            <span class="material-symbols-outlined text-3xl">verified</span>
          </div>
          <h4 class="text-xl font-bold mb-3">Integrity</h4>
          <p class="text-slate-600 dark:text-slate-400">
            Transparent processes and honest communication form the foundation of our client relationships.
          </p>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="max-w-7xl mx-auto px-4 pb-24">
      <div class="bg-primary/5 dark:bg-primary/10 rounded-3xl p-8 md:p-16 flex flex-col items-center text-center">
        <h2 class="text-3xl md:text-4xl font-black mb-6">Ready to switch to clean energy?</h2>
        <p class="text-slate-600 dark:text-slate-400 text-lg mb-8 max-w-2xl">
          Join thousands of Nigerians who have already secured their energy future with Novel Solar.
        </p>
        <div class="flex gap-4">
          <button class="bg-primary text-white px-8 py-4 rounded-xl font-bold hover:opacity-90 transition-opacity">Contact Sales</button>
          <button class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-8 py-4 rounded-xl font-bold">Learn More</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
useHead({
  title: 'About Us',
  meta: [
    { name: 'description', content: 'Empowering Nigeria with sustainable energy solutions. Leading the charge towards a greener, brighter future.' }
  ]
})
</script>

<style scoped>
.bg-primary {
  background-color: #0d398c;
}
.text-primary {
  color: #0d398c;
}
</style>
