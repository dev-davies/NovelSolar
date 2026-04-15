<script setup lang="ts">
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

definePageMeta({
  layout: 'default'
})

useHead({
  title: 'Reset Password | Novel Solar Admin',
  meta: [{ name: 'description', content: 'Reset your admin password.' }]
})

const supabase = useSupabaseClient()

const handleResetPassword = async () => {
  if (!password.value || !confirmPassword.value) {
    errorMessage.value = 'Both password fields are required.'
    return
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match.'
    return
  }

  if (password.value.length < 8) {
    errorMessage.value = 'Password must be at least 8 characters long.'
    return
  }

  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const { error } = await supabase.auth.updateUser({
      password: password.value
    })

    if (error) {
      throw error
    }

    successMessage.value = 'Password updated successfully. Redirecting to login...'

    setTimeout(() => {
      navigateTo('/admin/login')
    }, 1600)
  } catch (error: any) {
    errorMessage.value = error?.message || 'Failed to reset password. Please request a new link.'
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
          <span class="material-symbols-outlined text-3xl text-red-600">lock_reset</span>
        </div>
        <h1 class="text-3xl font-black text-slate-900 tracking-tight">Reset Password</h1>
        <p class="text-slate-500 font-medium mt-2">Create a new password for your admin account.</p>
      </div>

      <div class="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 sm:p-10 relative overflow-hidden">
        <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-red-400"></div>

        <form @submit.prevent="handleResetPassword" class="space-y-6">
          <div>
            <label for="password" class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">New Password</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">lock</span>
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter new password"
                required
                class="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-12 text-slate-900 font-medium outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all"
                :disabled="isLoading"
                autocomplete="new-password"
              />
              <button type="button" class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700" @click="showPassword = !showPassword">
                <span class="material-symbols-outlined">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
              </button>
            </div>
          </div>

          <div>
            <label for="confirm-password" class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Confirm Password</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">lock_check</span>
              <input
                id="confirm-password"
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="Confirm new password"
                required
                class="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-12 text-slate-900 font-medium outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all"
                :disabled="isLoading"
                autocomplete="new-password"
              />
              <button type="button" class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700" @click="showConfirmPassword = !showConfirmPassword">
                <span class="material-symbols-outlined">{{ showConfirmPassword ? 'visibility_off' : 'visibility' }}</span>
              </button>
            </div>
          </div>

          <div v-if="errorMessage" class="flex items-start gap-2 bg-red-50 p-3 rounded-xl border border-red-100 text-red-700">
            <span class="material-symbols-outlined text-base mt-0.5 shrink-0">error</span>
            <span class="text-sm font-bold">{{ errorMessage }}</span>
          </div>

          <div v-if="successMessage" class="flex items-start gap-2 bg-green-50 p-3 rounded-xl border border-green-100 text-green-700">
            <span class="material-symbols-outlined text-base mt-0.5 shrink-0">check_circle</span>
            <span class="text-sm font-bold">{{ successMessage }}</span>
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
          >
            <span v-if="isLoading" class="animate-spin border-2 border-white/30 border-t-white w-5 h-5 rounded-full"></span>
            {{ isLoading ? 'Updating...' : 'Reset Password' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
