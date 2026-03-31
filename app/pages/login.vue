<script setup>
const email = ref('');
const otp = ref('');
const step = ref(1); // 1: Email, 2: OTP
const isLoading = ref(false);
const errorMessage = ref('');
const errorData = ref<any>(null);

// Resend OTP Countdown
const resendTimer = ref(0);
let timerInterval: ReturnType<typeof setInterval> | null = null;

// Rate limit countdown
const rateLimitTimer = ref(0);
let rateLimitInterval: ReturnType<typeof setInterval> | null = null;

const startResendTimer = () => {
  resendTimer.value = 60;
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (resendTimer.value > 0) {
      resendTimer.value--;
    } else {
      clearInterval(timerInterval!);
    }
  }, 1000);
};

const startRateLimitTimer = (seconds: number) => {
  rateLimitTimer.value = seconds;
  if (rateLimitInterval) clearInterval(rateLimitInterval);
  rateLimitInterval = setInterval(() => {
    if (rateLimitTimer.value > 0) {
      rateLimitTimer.value--;
    } else {
      clearInterval(rateLimitInterval!);
    }
  }, 1000);
};

const getErrorDisplay = () => {
  if (!errorData.value) return errorMessage.value;
  
  const { type, retryAfter } = errorData.value;
  
  switch (type) {
    case 'throttle':
      const secs = rateLimitTimer.value || retryAfter;
      return `Please wait ${secs} second${secs !== 1 ? 's' : ''} before requesting another code`;
    case 'hourly_limit_exceeded':
      const mins = Math.ceil((rateLimitTimer.value || retryAfter) / 60);
      return `Too many requests. Please try again in ${mins} minute${mins !== 1 ? 's' : ''}`;
    case 'failed_attempts_exceeded':
      return 'Account temporarily locked due to too many failed attempts. Please try again later';
    default:
      return errorMessage.value;
  }
};

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
  if (rateLimitInterval) clearInterval(rateLimitInterval);
});

const handleSendOtp = async () => {
  if (!email.value) {
    errorMessage.value = 'Please enter your email address.';
    errorData.value = null;
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';
  errorData.value = null;

  try {
    await $fetch('/api/auth/send-otp', {
      method: 'POST',
      body: { email: email.value }
    });
    step.value = 2;
    startResendTimer();
  } catch (error: any) {
    errorMessage.value = error.data?.statusMessage || 'Failed to send code. Please try again.';
    errorData.value = error.data?.data || null;
    
    // Start rate limit timer if rate limited
    if (error.status === 429 && errorData.value?.retryAfter) {
      startRateLimitTimer(errorData.value.retryAfter);
    }
  } finally {
    isLoading.value = false;
  }
};

const handleVerifyOtp = async () => {
  if (otp.value.length !== 6) {
    errorMessage.value = 'Please enter the 6-digit verification code.';
    errorData.value = null;
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';
  errorData.value = null;

  try {
    await $fetch('/api/auth/verify-otp', {
      method: 'POST',
      body: { 
        email: email.value, 
        otp: otp.value 
      }
    });
    // Redirect to account page on success
    navigateTo('/account');
  } catch (error: any) {
    errorMessage.value = error.data?.statusMessage || 'Invalid or expired code.';
    errorData.value = error.data?.data || null;
  } finally {
    isLoading.value = false;
  }
};

useHead({
  title: 'Login | Novel Solar',
  meta: [{ name: 'description', content: 'Secure login to your Novel Solar account.' }]
});
</script>

<template>
  <div class="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4 py-12">
    <div class="max-w-md w-full">
      <!-- Logo / Back Link -->
      <div class="text-center mb-8">
        <NuxtLink to="/" class="inline-flex items-center gap-2 text-slate-400 hover:text-[#3c59b0] transition-colors group mb-6">
          <span class="material-symbols-outlined text-sm transition-transform group-hover:-translate-x-1">arrow_back</span>
          <span class="text-sm font-bold uppercase tracking-widest">Back to Home</span>
        </NuxtLink>
        <h1 class="text-3xl font-black text-[#3c59b0] tracking-tight">Novel Solar</h1>
      </div>

      <!-- Main Login Card -->
      <div class="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8 md:p-10 relative overflow-hidden">
        <!-- Progress Bar (Subtle) -->
        <div class="absolute top-0 left-0 w-full h-1 bg-slate-50">
          <div 
            class="h-full bg-[#a9001d] transition-all duration-500 ease-out"
            :style="{ width: step === 1 ? '50%' : '100%' }"
          ></div>
        </div>

        <!-- Step 1: Email Input -->
        <div v-if="step === 1" class="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div class="mb-8">
            <h2 class="text-2xl font-bold text-slate-900 mb-2">Sign In or Create Account</h2>
            <p class="text-slate-500 font-medium">Enter your email to receive a secure login code.</p>
          </div>

          <form @submit.prevent="handleSendOtp" class="space-y-6">
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Email Address</label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">mail</span>
                <input 
                  v-model="email"
                  type="email" 
                  placeholder="name@company.com"
                  required
                  class="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-900 font-medium outline-none focus:border-[#3c59b0] focus:ring-4 focus:ring-blue-100 transition-all placeholder:text-slate-300"
                  :disabled="isLoading"
                />
              </div>
              <p class="text-[11px] text-slate-400 mt-2 font-medium">If you don't have an account, we will securely create one for you.</p>
            </div>

            <p v-if="errorMessage" class="text-[#a9001d] text-sm font-bold flex items-start gap-2 bg-red-50 p-3 rounded-xl border border-red-100">
              <span class="material-symbols-outlined text-base flex-shrink-0 mt-0.5">error</span>
              <span>{{ getErrorDisplay() }}</span>
            </p>

            <button 
              type="submit"
              :disabled="isLoading || rateLimitTimer > 0"
              class="w-full bg-[#3c59b0] text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-900 transition-all shadow-lg shadow-blue-900/10 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span v-if="isLoading" class="animate-spin border-2 border-white/30 border-t-white w-4 h-4 rounded-full"></span>
              {{ isLoading ? 'Sending...' : 'Send Login Code' }}
              <span v-if="!isLoading" class="material-symbols-outlined text-lg">bolt</span>
            </button>
          </form>
        </div>

        <!-- Step 2: OTP Verification -->
        <div v-if="step === 2" class="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div class="mb-8">
            <h2 class="text-2xl font-bold text-slate-900 mb-2">Check Your Inbox</h2>
            <p class="text-slate-500 font-medium">We've sent a 6-digit verification code to <span class="text-[#3c59b0] font-bold">{{ email }}</span></p>
          </div>

          <form @submit.prevent="handleVerifyOtp" class="space-y-6">
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-4 uppercase tracking-wide text-center">Enter Verification Code</label>
              <input 
                v-model="otp"
                type="text" 
                maxlength="6"
                placeholder="000000"
                required
                class="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-5 text-center text-4xl font-black tracking-[1em] text-slate-900 outline-none focus:border-[#3c59b0] focus:ring-4 focus:ring-blue-100 transition-all placeholder:text-slate-200"
                :disabled="isLoading"
              />
            </div>

            <p v-if="errorMessage" class="text-[#a9001d] text-sm font-bold flex items-start gap-2 bg-red-50 p-3 rounded-xl border border-red-100">
              <span class="material-symbols-outlined text-base flex-shrink-0 mt-0.5">error</span>
              <span>{{ getErrorDisplay() }}</span>
            </p>

            <button 
              type="submit"
              :disabled="isLoading"
              class="w-full bg-[#3c59b0] text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-900 transition-all shadow-lg shadow-blue-900/10 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span v-if="isLoading" class="animate-spin border-2 border-white/30 border-t-white w-4 h-4 rounded-full"></span>
              {{ isLoading ? 'Verifying...' : 'Verify & Login' }}
              <span v-if="!isLoading" class="material-symbols-outlined text-lg">verified_user</span>
            </button>

            <div class="flex flex-col items-center gap-4 mt-6">
              <button 
                type="button" 
                @click="step = 1; errorMessage = ''; errorData = null" 
                class="text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-colors flex items-center gap-1"
                :disabled="isLoading"
              >
                <span class="material-symbols-outlined text-sm">edit</span>
                Change Email
              </button>
              <button 
                type="button" 
                @click="handleSendOtp" 
                :disabled="isLoading || resendTimer > 0 || rateLimitTimer > 0"
                class="text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-1"
                :class="(isLoading || resendTimer > 0 || rateLimitTimer > 0) ? 'text-slate-300 cursor-not-allowed' : 'text-[#3c59b0] hover:text-blue-800'"
              >
                <span class="material-symbols-outlined text-xs">refresh</span>
                {{ resendTimer > 0 ? `Resend in ${resendTimer}s` : rateLimitTimer > 0 ? `Try again in ${rateLimitTimer}s` : 'Resend Code' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Help Text -->
      <p class="text-center mt-8 text-slate-400 text-xs font-medium">
        Having trouble? <a href="#" class="text-[#3c59b0] font-bold hover:underline">Contact Support</a>
      </p>
    </div>
  </div>
</template>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 600, 'GRAD' 0, 'opsz' 24;
}

input::placeholder {
  letter-spacing: normal;
}
</style>
