<script setup lang="ts">
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

definePageMeta({
  layout: 'default'
})

useHead({
  title: 'Admin Login | Novel Solar',
  meta: [{ name: 'description', content: 'Secure admin portal login' }]
})

const handleLogin = async () => {
  if (!email.value || !password.value) {
    errorMessage.value = 'Email and password are required.'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    await $fetch('/api/admin/auth/login', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value
      }
    })

    await navigateTo('/admin/manage-products')
  } catch (error: any) {
    console.error('Login failed:', error)
    errorMessage.value = error?.data?.statusMessage || 'Invalid email or password.'
    password.value = ''
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-[80vh] bg-slate-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div class="text-center mb-10">
        <div class="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border-2 border-red-100 shadow-inner">
          <span class="material-symbols-outlined text-3xl text-red-600">admin_panel_settings</span>
        </div>
        <h1 class="text-3xl font-black text-slate-900 tracking-tight">Admin Portal</h1>
        <p class="text-slate-500 font-medium mt-2">Sign in with your admin email and password to access inventory controls.</p>
      </div>

      <div class="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 sm:p-10 relative overflow-hidden">
        <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-red-400"></div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label for="email" class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Admin Email</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">mail</span>
              <input
                id="email"
                v-model="email"
                type="email"
                placeholder="admin@novelsolar.com"
                required
                class="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-900 font-medium outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all"
                :disabled="isLoading"
                autocomplete="email"
              />
            </div>
          </div>

          <div>
            <label for="password" class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Password</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">lock</span>
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter your password"
                required
                class="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-12 text-slate-900 font-medium outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all"
                :disabled="isLoading"
                autocomplete="current-password"
              />
              <button
                type="button"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                @click="showPassword = !showPassword"
              >
                <span class="material-symbols-outlined text-xl">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
              </button>
            </div>
            <div class="flex justify-end mt-2">
              <NuxtLink to="/admin/forgot-password" class="text-xs font-bold text-red-600 hover:text-red-700 transition-colors">
                Forgot password?
              </NuxtLink>
            </div>
          </div>

          <div v-if="errorMessage" class="flex items-start gap-2 bg-red-50 p-3 rounded-xl border border-red-100 text-red-700">
            <span class="material-symbols-outlined text-base mt-0.5 shrink-0">error</span>
            <span class="text-sm font-bold">{{ errorMessage }}</span>
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
          >
            <span v-if="isLoading" class="animate-spin border-2 border-white/30 border-t-white w-5 h-5 rounded-full"></span>
            {{ isLoading ? 'Authenticating...' : 'Sign In' }}
            <span v-if="!isLoading" class="material-symbols-outlined text-xl">login</span>
          </button>
        </form>
      </div>

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
