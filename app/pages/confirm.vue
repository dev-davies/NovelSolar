<script setup lang="ts">
const user = useSupabaseUser()

// Watch for the Supabase module to finish the token exchange and populate the user
watch(user, () => {
  if (user.value) {
    // Once verified, send them securely to their account dashboard
    return navigateTo('/account')
  }
}, { immediate: true })
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
    <span class="material-symbols-outlined text-4xl text-[#002888] animate-spin mb-4">refresh</span>
    <h1 class="text-xl font-bold text-slate-900 mb-2">Verifying Secure Login...</h1>
    <p class="text-slate-500 text-center max-w-sm">Please wait a moment while we authenticate your session.</p>
  </div>
</template>
