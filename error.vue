<template>
  <div class="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-16 selection:bg-[#002888]/10 text-center">
    
    <div class="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center mb-8 border border-slate-100">
      <span class="material-symbols-outlined text-6xl text-[#002888]">solar_power</span>
    </div>
    
    <h1 class="text-7xl md:text-9xl font-black text-[#002888] mb-4 tracking-tighter drop-shadow-sm">
      {{ error?.statusCode || '404' }}
    </h1>
    
    <h2 class="text-2xl md:text-3xl font-bold text-slate-900 mb-6 uppercase tracking-tight">
      System Disconnected
    </h2>
    
    <p class="text-lg text-slate-500 max-w-md mx-auto mb-10 font-medium leading-relaxed">
      {{ error?.message || "The page you're looking for has been moved, deleted, or doesn't exist in our current grid." }}
    </p>
    
    <button 
      @click="handleError" 
      class="inline-flex items-center gap-2 bg-[#002888] text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-900 transition-all shadow-lg hover:shadow-[#002888]/20 active:scale-95 uppercase tracking-widest text-sm"
    >
      <span class="material-symbols-outlined text-lg">home</span>
      Return to Homepage
    </button>

  </div>
</template>

<script setup>
// Nuxt automatically passes the error object to this page
const props = defineProps({
  error: Object
})

// Safely clear the error state and route home
const handleError = () => {
  clearError({ redirect: '/' })
}
</script>
