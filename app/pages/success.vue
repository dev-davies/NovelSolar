<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-6">
    <div class="bg-white max-w-lg w-full rounded-3xl shadow-sm border border-gray-200 p-10 text-center flex flex-col items-center">
      <!-- Success Indicator -->
      <div class="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-green-600 shadow-inner">
        <svg class="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <!-- Content -->
      <h1 class="text-[#002888] font-bold text-3xl mt-8">Order Confirmed</h1>
      <p class="text-gray-900 font-semibold text-lg mt-2">Thank you for choosing NovelSolar.</p>
      <p class="text-gray-600 mt-4 leading-relaxed">
        Your order is successful. A representative will contact you shortly regarding fulfillment and delivery.
      </p>

      <!-- Actions -->
      <div class="mt-10 flex flex-col sm:flex-row gap-4 w-full">
        <NuxtLink 
          to="/" 
          class="flex-1 bg-[#002888] text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-900 transition-all shadow-lg shadow-blue-900/10 active:scale-[0.98] flex items-center justify-center"
        >
          Return to Shop
        </NuxtLink>
        <button 
          class="flex-1 border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-xl font-bold hover:bg-gray-50 transition-all active:scale-[0.98] flex items-center justify-center"
        >
          Download Invoice
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Final checkout success state
</script>
