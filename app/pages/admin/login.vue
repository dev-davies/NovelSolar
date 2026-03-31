<script setup>
const passcode = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

definePageMeta({
  layout: 'default' // Using the default layout so navbar works, though custom layout could be added later
})

useHead({
  title: 'Admin Login | Novel Solar',
  meta: [{ name: 'description', content: 'Secure admin portal login' }]
})

const handleLogin = async () => {
  if (!passcode.value) {
    errorMessage.value = 'Passcode is required.'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    await $fetch('/api/admin/auth/login', {
      method: 'POST',
      body: { passcode: passcode.value }
    })
    
    // Redirect to manage products on success
    navigateTo('/admin/manage-products')
  } catch (error) {
    console.error('Login failed:', error)
    errorMessage.value = error.data?.statusMessage || 'Invalid passcode.'
    passcode.value = '' // Clear passcode on failure
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-[80vh] bg-slate-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <!-- Premium Header -->
      <div class="text-center mb-10">
        <div class="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border-2 border-red-100 shadow-inner">
          <span class="material-symbols-outlined text-3xl text-red-600">admin_panel_settings</span>
        </div>
        <h1 class="text-3xl font-black text-slate-900 tracking-tight">Admin Portal</h1>
        <p class="text-slate-500 font-medium mt-2">Enter your secure passcode to access inventory controls.</p>
      </div>

      <!-- Login Card -->
      <div class="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 sm:p-10 relative overflow-hidden">
        <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-red-400"></div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label for="passcode" class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Admin Passcode</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">key</span>
              <input
                id="passcode"
                v-model="passcode"
                type="password"
                placeholder="••••••••"
                required
                class="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-900 font-bold outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all placeholder:font-normal font-mono"
                :disabled="isLoading"
                autocomplete="current-password"
              />
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="flex items-start gap-2 bg-red-50 p-3 rounded-xl border border-red-100 text-red-700">
            <span class="material-symbols-outlined text-base mt-0.5 shrink-0">error</span>
            <span class="text-sm font-bold">{{ errorMessage }}</span>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
          >
            <span v-if="isLoading" class="animate-spin border-2 border-white/30 border-t-white w-5 h-5 rounded-full"></span>
            {{ isLoading ? 'Authenticating...' : 'Access Pipeline' }}
            <span v-if="!isLoading" class="material-symbols-outlined text-xl">login</span>
          </button>
        </form>
      </div>
      
      <!-- Footer Note -->
      <p class="text-center mt-8 text-xs font-bold text-slate-400 uppercase tracking-widest">
        Novel Solar Operations
      </p>

    </div>
  </div>
</template>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 600, 'GRAD' 0, 'opsz' 24;
}
</style>
