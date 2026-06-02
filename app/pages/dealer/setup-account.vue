<script setup lang="ts">
const route = useRoute()
const token = route.query.token as string

const isValidating = ref(true)
const isSubmitting = ref(false)
const errorMsg = ref('')
const email = ref('')

const password = ref('')
const confirmPassword = ref('')
const formError = ref('')

const { addToast } = useToast()
const supabase = useSupabaseClient()
const router = useRouter()

onMounted(async () => {
  if (!token) {
    errorMsg.value = 'Link Expired or Invalid'
    isValidating.value = false
    return
  }

  try {
    const response = await useNuxtApp().$apiFetch<{ valid: boolean; email: string }>('/api/dealer/verify-token', {
      method: 'POST',
      body: { token },
    })

    if (response && response.valid) {
      email.value = response.email
    }
  } catch (error: unknown) {
    const err = error as { statusMessage?: string; message?: string }
    errorMsg.value = err.statusMessage || err.message || 'Link Expired or Invalid'
  } finally {
    isValidating.value = false
  }
})

const handleSetup = async () => {
  formError.value = ''
  if (password.value !== confirmPassword.value) {
    formError.value = 'Passwords do not match.'
    return
  }

  if (password.value.length < 8) {
    formError.value = 'Password must be at least 8 characters long.'
    return
  }

  isSubmitting.value = true
  try {
    // 1. Backend cleanly provisions account and burns the token
    const response = await useNuxtApp().$apiFetch<{ email: string }>('/api/dealer/create-account', {
      method: 'POST',
      body: { token, password: password.value },
    })

    // 2. Client logs into the newly created account smoothly
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: response.email,
      password: password.value,
    })

    if (signInError) throw signInError

    addToast('Account Created', 'Welcome to the NovelSolar Dealer Network!', 'success')
    router.push('/') // Direct them to storefront immediately
  } catch (error: unknown) {
    const err = error as { statusMessage?: string; message?: string }
    formError.value = err.statusMessage || err.message || 'An error occurred during account creation.'
  } finally {
    isSubmitting.value = false
  }
}

useHead({
  title: 'Set up Dealer Account | NovelSolar',
})
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 relative overflow-hidden">
    <!-- Background styling to match platform aesthetics -->
    <div class="absolute inset-0 pointer-events-none">
      <div
        class="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"
      />
      <div
        class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3"
      />
    </div>

    <div class="max-w-md w-full relative z-10">
      <div class="text-center mb-8">
        <NuxtLink to="/">
          <img src="/images/logo.png" alt="NovelSolar" class="h-10 mx-auto drop-shadow-sm" />
        </NuxtLink>
      </div>

      <div class="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-black text-[#002888] tracking-tight mb-2">Account Setup</h1>
          <p class="text-slate-500 font-medium">Complete your NovelSolar Dealer registration.</p>
        </div>

        <div v-if="isValidating" class="flex flex-col items-center justify-center py-12 gap-5">
          <div class="w-10 h-10 border-4 border-[#002888]/20 border-t-[#002888] rounded-full animate-spin" />
          <p class="text-slate-600 font-bold animate-pulse tracking-wide">Verifying secure link...</p>
        </div>

        <div v-else-if="errorMsg" class="bg-red-50 text-red-600 p-6 rounded-2xl text-center border border-red-100">
          <div
            class="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm"
          >
            <span class="text-3xl font-black">!</span>
          </div>
          <h3 class="text-lg font-black mb-2 tracking-tight">Validation Failed</h3>
          <p class="text-sm font-medium mb-6">{{ errorMsg }}</p>
          <NuxtLink
            to="/partners/become-a-dealer"
            class="inline-flex items-center justify-center px-6 py-3 bg-white text-red-600 border border-red-200 rounded-xl font-bold hover:bg-red-50 transition-colors"
            >Return to Registration</NuxtLink
          >
        </div>

        <div v-else>
          <div class="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-8">
            <p class="text-xs text-blue-600 font-bold uppercase tracking-wider text-center mb-1">
              Authorizing Dealer Account
            </p>
            <p class="text-[#002888] font-black text-center text-lg truncate" :title="email">
              {{ email }}
            </p>
          </div>

          <form class="space-y-5" @submit.prevent="handleSetup">
            <div class="space-y-2">
              <label class="text-xs font-black text-slate-400 uppercase tracking-widest">Secure Password</label>
              <input
                v-model="password"
                type="password"
                required
                class="w-full px-4 py-3.5 rounded-xl border-2 border-slate-100 focus:border-[#002888] outline-none transition-all font-medium text-slate-700"
                placeholder="••••••••"
              />
            </div>

            <div class="space-y-2">
              <label class="text-xs font-black text-slate-400 uppercase tracking-widest">Confirm Password</label>
              <input
                v-model="confirmPassword"
                type="password"
                required
                class="w-full px-4 py-3.5 rounded-xl border-2 border-slate-100 focus:border-[#002888] outline-none transition-all font-medium text-slate-700"
                placeholder="••••••••"
              />
            </div>

            <div v-if="formError" class="p-4 bg-red-50 rounded-xl border border-red-100">
              <p class="text-red-600 text-sm font-bold text-center flex items-center justify-center gap-2">
                <span
                  class="w-4 h-4 bg-red-600 text-white rounded-full inline-flex items-center justify-center text-[10px]"
                  >&times;</span
                >
                {{ formError }}
              </p>
            </div>

            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full inline-flex items-center justify-center gap-2 bg-[#002888] text-white px-8 py-4 rounded-xl font-black uppercase tracking-wider hover:bg-blue-900 transition-all disabled:opacity-60 shadow-lg shadow-blue-900/10 active:scale-[0.99] mt-4"
            >
              <span
                v-if="isSubmitting"
                class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
              />
              {{ isSubmitting ? 'Provisioning...' : 'Complete Registration' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
