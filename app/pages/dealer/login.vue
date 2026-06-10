<script setup lang="ts">
const email = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const isForgotPassword = ref(false)

const resetEmail = ref('')
const resetSuccess = ref(false)
const resetLoading = ref(false)
const resetError = ref('')

const showForgotPassword = () => {
  isForgotPassword.value = true
  resetEmail.value = email.value
}

const hideForgotPassword = () => {
  isForgotPassword.value = false
  resetSuccess.value = false
}

const supabase = useSupabaseClient()
const router = useRouter()

const handleLogin = async () => {
  if (!email.value || !password.value) {
    errorMessage.value = 'Please enter both email and password.'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    const res = await useNuxtApp().$apiFetch<{ success: boolean }>('/api/dealer/auth/login', {
      method: 'POST',
      body: { email: email.value, password: password.value },
    })

    if (res && res.success) {
      const { addToast } = useToast()
      addToast('Login Successful', 'Welcome to the Dealer Portal!', 'success')

      // The backend endpoint securely set the Nuxt Supabase cookies natively.
      // We can directly navigate to the wholesale shop dashboard.
      // Using window.location.href forces a full client reload so the Nuxt Supabase
      // module picks up the newly minted cookies from the server immediately.
      window.location.href = '/shop'
    }
  } catch (error: any) {
    errorMessage.value = error.statusMessage || error.message || 'Invalid email or password.'
  } finally {
    isLoading.value = false
  }
}

const handleReset = async () => {
  if (!resetEmail.value) {
    resetError.value = 'Please enter your email address.'
    return
  }

  resetLoading.value = true
  resetError.value = ''

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail.value, {
      redirectTo: `${window.location.origin}/dealer/reset-password`,
    })

    if (error) throw error
    resetSuccess.value = true
  } catch (error: any) {
    resetError.value = error.message || 'Failed to send reset link.'
  } finally {
    resetLoading.value = false
  }
}

useHead({
  title: 'Dealer Portal Login | NovelSolar',
  meta: [
    {
      name: 'description',
      content: 'Log in to your NovelSolar Authorized Dealer account to access wholesale pricing.',
    },
  ],
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

      <div
        class="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 md:p-10 border border-slate-100 overflow-hidden relative"
      >
        <!-- Login Form -->
        <div
          :class="{
            'opacity-0 pointer-events-none absolute inset-0': isForgotPassword,
            'transition-opacity duration-300': true,
          }"
        >
          <div class="text-center mb-8">
            <h1 class="text-3xl font-black text-[#002888] tracking-tight mb-2">Dealer Portal</h1>
            <p class="text-slate-500 font-medium">Log in to access your wholesale pricing.</p>
          </div>

          <form class="space-y-5" @submit.prevent="handleLogin">
            <div class="space-y-2">
              <label class="text-xs font-black text-slate-400 uppercase tracking-widest">Email Address</label>
              <input
                v-model="email"
                type="email"
                required
                class="w-full px-4 py-3.5 rounded-xl border-2 border-slate-100 focus:border-[#002888] outline-none transition-all font-medium text-slate-700"
                placeholder="name@company.com"
              />
            </div>

            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <label class="text-xs font-black text-slate-400 uppercase tracking-widest">Password</label>
                <button
                  type="button"
                  class="text-xs font-bold text-[#002888] hover:underline"
                  @click="showForgotPassword"
                >
                  Forgot Password?
                </button>
              </div>
              <input
                v-model="password"
                type="password"
                required
                class="w-full px-4 py-3.5 rounded-xl border-2 border-slate-100 focus:border-[#002888] outline-none transition-all font-medium text-slate-700"
                placeholder="••••••••"
              />
            </div>

            <div v-if="errorMessage" class="p-4 bg-red-50 rounded-xl border border-red-100">
              <p class="text-red-600 text-sm font-bold flex items-center gap-2">
                <span
                  class="w-4 h-4 bg-red-600 text-white rounded-full inline-flex items-center justify-center text-[10px] shrink-0"
                  >&times;</span
                >
                {{ errorMessage }}
              </p>
            </div>

            <button
              type="submit"
              :disabled="isLoading"
              class="w-full inline-flex items-center justify-center gap-2 bg-[#002888] text-white px-8 py-4 rounded-xl font-black uppercase tracking-wider hover:bg-blue-900 transition-all disabled:opacity-60 shadow-lg shadow-blue-900/10 active:scale-[0.99] mt-4"
            >
              <span
                v-if="isLoading"
                class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
              />
              {{ isLoading ? 'Authenticating...' : 'Sign In' }}
            </button>
          </form>

          <p class="text-center mt-8 text-sm font-medium text-slate-500">
            Want to become a dealer?
            <NuxtLink to="/partners/become-a-dealer" class="text-[#002888] font-bold hover:underline"
              >Apply Here</NuxtLink
            >
          </p>
        </div>

        <!-- Forgot Password Overlay -->
        <div
          :class="{
            'opacity-0 pointer-events-none absolute inset-0': !isForgotPassword,
            'transition-opacity duration-300': true,
          }"
        >
          <div class="text-center mb-8">
            <button
              class="inline-flex items-center gap-2 text-slate-400 hover:text-[#002888] transition-colors group mb-4"
              @click="hideForgotPassword"
            >
              <span class="material-symbols-outlined text-sm transition-transform group-hover:-translate-x-1"
                >arrow_back</span
              >
              <span class="text-xs font-bold uppercase tracking-widest">Back to Login</span>
            </button>
            <h1 class="text-3xl font-black text-[#002888] tracking-tight mb-2">Reset Password</h1>
            <p class="text-slate-500 font-medium">We'll send you a link to securely reset your password.</p>
          </div>

          <div v-if="resetSuccess" class="text-center py-6">
            <div
              class="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <span class="material-symbols-outlined text-3xl">mark_email_read</span>
            </div>
            <h3 class="text-xl font-bold text-slate-900 mb-2">Check your email</h3>
            <p class="text-slate-500 font-medium mb-6">
              We've sent password reset instructions to <strong>{{ resetEmail }}</strong
              >.
            </p>
            <button
              class="text-sm font-bold text-[#002888] uppercase tracking-wider hover:underline"
              @click="hideForgotPassword"
            >
              Return to Sign In
            </button>
          </div>

          <form v-else class="space-y-5" @submit.prevent="handleReset">
            <div class="space-y-2">
              <label class="text-xs font-black text-slate-400 uppercase tracking-widest">Email Address</label>
              <input
                v-model="resetEmail"
                type="email"
                required
                class="w-full px-4 py-3.5 rounded-xl border-2 border-slate-100 focus:border-[#002888] outline-none transition-all font-medium text-slate-700"
                placeholder="name@company.com"
              />
            </div>

            <div v-if="resetError" class="p-4 bg-red-50 rounded-xl border border-red-100">
              <p class="text-red-600 text-sm font-bold flex items-center gap-2">
                <span
                  class="w-4 h-4 bg-red-600 text-white rounded-full inline-flex items-center justify-center text-[10px] shrink-0"
                  >&times;</span
                >
                {{ resetError }}
              </p>
            </div>

            <button
              type="submit"
              :disabled="resetLoading"
              class="w-full inline-flex items-center justify-center gap-2 bg-[#002888] text-white px-8 py-4 rounded-xl font-black uppercase tracking-wider hover:bg-blue-900 transition-all disabled:opacity-60 shadow-lg shadow-blue-900/10 active:scale-[0.99] mt-4"
            >
              <span
                v-if="resetLoading"
                class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
              />
              {{ resetLoading ? 'Sending...' : 'Send Reset Link' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.material-symbols-outlined {
  font-variation-settings:
    'FILL' 0,
    'wght' 600,
    'GRAD' 0,
    'opsz' 24;
}
</style>
