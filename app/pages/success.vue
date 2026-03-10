<template>
  <div class="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full text-center">
      <div class="mb-8 flex justify-center">
        <div class="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 shadow-lg animate-bounce">
          <svg class="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
      
      <h1 class="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Order Confirmed!</h1>
      <p class="text-lg text-gray-600 mb-10 leading-relaxed">
        Thank you for choosing NovelSolar. Your order has been successfully sent to our team, and we'll be in touch shortly to finalize the details.
      </p>
      
      <div class="space-y-4">
        <NuxtLink 
          to="/" 
          class="block w-full bg-primary text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          Return to Homepage
        </NuxtLink>
        
        <NuxtLink 
          to="/news" 
          class="block w-full text-gray-500 font-bold hover:text-gray-900 transition-colors"
        >
          Read the latest energy news
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
// Use standard layout
</script>
