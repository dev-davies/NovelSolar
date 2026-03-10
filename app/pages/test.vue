<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 font-sans">
    <div class="w-full max-w-3xl bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <!-- Header -->
      <div class="px-8 py-6 border-b border-gray-50">
        <h1 class="text-2xl font-semibold text-gray-900">Bitrix24 Diagnostic Tool</h1>
        <p class="text-sm text-gray-500 mt-1">Verifying connection to NovelSolar CRM</p>
      </div>

      <!-- Content -->
      <div class="p-8">
        <!-- Loading State -->
        <div v-if="pending" class="flex flex-col items-center py-12">
          <div class="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
          <p class="mt-4 text-gray-600 font-medium">Pinging NovelSolar CRM...</p>
        </div>

        <!-- Success State -->
        <div v-else-if="data?.success" class="space-y-6">
          <div class="flex items-center gap-3 bg-green-50 text-green-700 px-4 py-3 rounded-lg border border-green-100">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span class="font-medium">Connection Successful</span>
          </div>

          <div>
            <h3 class="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Raw Response Payload</h3>
            <pre class="bg-gray-900 text-gray-100 p-6 rounded-xl overflow-x-auto text-xs leading-relaxed shadow-inner">{{ data.products }}</pre>
          </div>
        </div>

        <!-- Error State -->
        <div v-else class="space-y-6">
          <div class="flex items-center gap-3 bg-red-50 text-red-700 px-4 py-3 rounded-lg border border-red-100">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            <span class="font-medium">Connection Failed</span>
          </div>
          
          <div class="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <p class="text-sm text-gray-600 font-mono">{{ data?.error || 'Unknown error occurred' }}</p>
          </div>

          <button 
            @click="refresh" 
            class="px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
          >
            Retry Connection
          </button>
        </div>
      </div>
    </div>
    
    <NuxtLink to="/" class="mt-8 text-sm text-gray-400 hover:text-gray-600 transition-colors underline underline-offset-4">
      Back to Dashboard
    </NuxtLink>
  </div>
</template>

<script setup>
const { data, pending, error, refresh } = useFetch('/api/test-connection')
</script>

<style scoped>
pre::-webkit-scrollbar {
  height: 8px;
}
pre::-webkit-scrollbar-track {
  background: transparent;
}
pre::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 4px;
}
</style>
