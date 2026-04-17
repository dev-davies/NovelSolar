<script setup lang="ts">
const user = useSupabaseUser()
const isSyncing = ref(false)
const error = ref('')

// This function syncs the Supabase session with our CRM-based session
const syncSession = async () => {
  if (isSyncing.value) return
  isSyncing.value = true
  
  try {
    const response = await $fetch('/api/auth/session', {
      method: 'POST'
    })
    
    if (response.success) {
      return navigateTo('/account')
    }
  } catch (err: any) {
    console.error('[CONFIRMATION SYNC ERROR]:', err)
    error.value = 'We encountered a synchronization issue, but you can try heading to your account directly.'
    // Even if sync fails, let's try to go to account after a delay
    setTimeout(() => navigateTo('/account'), 3000)
  } finally {
    isSyncing.value = false
  }
}

// Watch for the Supabase module to finish the token exchange and populate the user
watch(user, () => {
  if (user.value) {
    syncSession()
  }
}, { immediate: true })
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
    <div v-if="!error" class="text-center">
      <span class="material-symbols-outlined text-4xl text-[#3c59b0] animate-spin mb-4">refresh</span>
      <h1 class="text-xl font-bold text-slate-900 mb-2">Verifying Secure Login...</h1>
      <p class="text-slate-500 text-center max-w-sm">Please wait a moment while we synchronize your CRM profile.</p>
    </div>
    
    <div v-else class="text-center animate-in fade-in duration-500">
      <span class="material-symbols-outlined text-4xl text-[#a9001d] mb-4">error</span>
      <h1 class="text-xl font-bold text-slate-900 mb-2">Sync Notice</h1>
      <p class="text-slate-500 text-center max-w-sm mb-6">{{ error }}</p>
      <NuxtLink to="/account" class="inline-flex items-center gap-2 bg-[#3c59b0] text-white px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-xs">
        Go to dashboard
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 600, 'GRAD' 0, 'opsz' 24;
}
</style>
