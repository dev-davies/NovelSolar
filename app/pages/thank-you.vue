<template>
  <div class="min-h-[80vh] flex items-center justify-center px-4">
    <div class="max-w-xl w-full text-center py-12 px-8 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-blue-900/5">
      <div class="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
        <span class="material-symbols-outlined text-5xl text-green-500">check_circle</span>
      </div>
      
      <h1 class="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight uppercase">Order Received!</h1>
      <p class="text-slate-500 text-lg mb-10 leading-relaxed font-bold italic">
        "Powering your world, one panel at a time."
      </p>

      <div class="bg-slate-50 p-6 rounded-2xl mb-10 text-left border border-slate-100">
        <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Next Steps</h3>
        <ul class="space-y-3">
          <li class="flex items-start gap-3 text-sm text-slate-700 font-bold">
            <span class="w-5 h-5 rounded-full bg-[#002888] text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5">1</span>
            Check your email for a detailed order receipt.
          </li>
          <li class="flex items-start gap-3 text-sm text-slate-700 font-bold">
            <span class="w-5 h-5 rounded-full bg-[#002888] text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5">2</span>
            Our logistics team will call you to confirm delivery.
          </li>
          <li class="flex items-start gap-3 text-sm text-slate-700 font-bold">
            <span class="w-5 h-5 rounded-full bg-[#002888] text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5">3</span>
            Your assigned branch is preparing your items.
          </li>
        </ul>
      </div>

      <div class="flex flex-col sm:flex-row gap-4">
        <NuxtLink to="/" class="flex-1 bg-[#002888] text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-blue-900 transition-all shadow-lg active:scale-95">
          Return Home
        </NuxtLink>
        <NuxtLink to="/shop" class="flex-1 bg-white border-2 border-slate-100 text-slate-700 py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95">
          Keep Shopping
        </NuxtLink>
      </div>
      
      <p class="mt-12 text-slate-400 text-xs font-bold uppercase tracking-widest">
        Questions? <a href="#" class="text-[#002888] hover:underline">Chat with Sales</a>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Thank You! | NovelSolar',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
});
</script>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 1, 'wght' 600, 'GRAD' 0, 'opsz' 48;
}
</style>
