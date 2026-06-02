<script setup lang="ts">
import { z } from 'zod'

const dealerSchema = z.object({
  businessName: z.string().min(2, 'Business name is required'),
  contactPerson: z.string().min(2, 'Contact person is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().min(5, 'Valid phone number is required'),
  address: z.string().min(5, 'Business address is required'),
})

const supabase = useSupabaseClient()
const { addToast } = useToast()

const isLoading = ref(false)
const form = reactive({
  businessName: '',
  contactPerson: '',
  email: '',
  password: '',
  phone: '',
  address: '',
})

const errors = ref<Record<string, string>>({})

const handleSubmit = async () => {
  if (isLoading.value) return

  isLoading.value = true
  errors.value = {}

  try {
    const validatedData = dealerSchema.parse(form)

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
      options: {
        data: {
          business_name: validatedData.businessName,
          contact_person: validatedData.contactPerson,
          phone: validatedData.phone,
          address: validatedData.address,
        },
      },
    })

    if (authError) throw authError

    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          role: 'dealer',
          dealer_status: 'pending',
        })
        .eq('user_id', authData.user.id)

      if (profileError) {
        console.error('Profile update error:', profileError)
      }
    }

    addToast('Registration Successful', 'Your dealer application has been submitted and is pending review.', 'success')

    // Clear form
    Object.assign(form, {
      businessName: '',
      contactPerson: '',
      email: '',
      password: '',
      phone: '',
      address: '',
    })
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      err.errors.forEach((e) => {
        if (e.path[0]) {
          errors.value[e.path[0].toString()] = e.message
        }
      })
      addToast('Validation Error', 'Please check the form for errors.', 'error')
    } else {
      addToast('Registration Failed', err.message || 'An unexpected error occurred.', 'error')
    }
  } finally {
    isLoading.value = false
  }
}

useHead({
  title: 'Become a Dealer | Novel Solar',
  meta: [
    {
      name: 'description',
      content: 'Apply to become a Novel Solar dealer to access wholesale pricing, training, and support.',
    },
  ],
})
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <section class="bg-[#002888] py-16 md:py-24 relative overflow-hidden">
      <div class="absolute inset-0 opacity-10 pointer-events-none">
        <div class="absolute top-0 left-0 w-72 h-72 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
        <div
          class="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"
        />
      </div>

      <div class="max-w-7xl mx-auto px-4 relative z-10">
        <nav class="text-xs font-black uppercase tracking-widest text-blue-100/80 flex items-center gap-2 mb-8">
          <NuxtLink to="/" class="hover:text-white transition-colors">Home</NuxtLink>
          <span>/</span>
          <NuxtLink to="/partners" class="hover:text-white transition-colors">Partners</NuxtLink>
          <span>/</span>
          <span class="text-white">Become a Dealer</span>
        </nav>

        <div class="max-w-3xl">
          <h1 class="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight mb-6">
            Join Our Authorized Dealer Network
          </h1>
          <p class="text-lg md:text-xl text-blue-100 font-medium leading-relaxed max-w-2xl">
            Register for a dealer account to access wholesale pricing, comprehensive training, priority support, and
            exclusive marketing resources.
          </p>
        </div>
      </div>
    </section>

    <section class="max-w-7xl mx-auto px-4 py-16 md:py-24">
      <div
        class="max-w-3xl mx-auto bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-200/40 overflow-hidden"
      >
        <div class="p-8 md:p-10 border-b border-slate-100">
          <h2 class="text-3xl font-black text-slate-900 tracking-tight mb-2">Dealer Registration</h2>
          <p class="text-slate-500 font-medium">
            Fill out the form below to apply. Our team will review your application within 1-2 business days.
          </p>
        </div>

        <div class="p-8 md:p-10">
          <form class="grid grid-cols-1 md:grid-cols-2 gap-6" @submit.prevent="handleSubmit">
            <!-- Business Name -->
            <div class="space-y-2 md:col-span-2">
              <label class="text-xs font-black text-slate-400 uppercase tracking-widest"
                >Business Name <span class="text-red-500">*</span></label
              >
              <input
                v-model="form.businessName"
                type="text"
                :class="[
                  'w-full px-4 py-3 rounded-xl border-2 outline-none transition-all',
                  errors.businessName
                    ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                    : 'border-slate-100 focus:border-[#002888] focus:ring-4 focus:ring-blue-100',
                ]"
              />
              <p v-if="errors.businessName" class="text-red-500 text-xs font-bold mt-1">{{ errors.businessName }}</p>
            </div>

            <!-- Contact Person -->
            <div class="space-y-2">
              <label class="text-xs font-black text-slate-400 uppercase tracking-widest"
                >Contact Person <span class="text-red-500">*</span></label
              >
              <input
                v-model="form.contactPerson"
                type="text"
                :class="[
                  'w-full px-4 py-3 rounded-xl border-2 outline-none transition-all',
                  errors.contactPerson
                    ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                    : 'border-slate-100 focus:border-[#002888] focus:ring-4 focus:ring-blue-100',
                ]"
              />
              <p v-if="errors.contactPerson" class="text-red-500 text-xs font-bold mt-1">{{ errors.contactPerson }}</p>
            </div>

            <!-- Email -->
            <div class="space-y-2">
              <label class="text-xs font-black text-slate-400 uppercase tracking-widest"
                >Email Address <span class="text-red-500">*</span></label
              >
              <input
                v-model="form.email"
                type="email"
                :class="[
                  'w-full px-4 py-3 rounded-xl border-2 outline-none transition-all',
                  errors.email
                    ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                    : 'border-slate-100 focus:border-[#002888] focus:ring-4 focus:ring-blue-100',
                ]"
              />
              <p v-if="errors.email" class="text-red-500 text-xs font-bold mt-1">{{ errors.email }}</p>
            </div>

            <!-- Password -->
            <div class="space-y-2">
              <label class="text-xs font-black text-slate-400 uppercase tracking-widest"
                >Password <span class="text-red-500">*</span></label
              >
              <input
                v-model="form.password"
                type="password"
                :class="[
                  'w-full px-4 py-3 rounded-xl border-2 outline-none transition-all',
                  errors.password
                    ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                    : 'border-slate-100 focus:border-[#002888] focus:ring-4 focus:ring-blue-100',
                ]"
              />
              <p v-if="errors.password" class="text-red-500 text-xs font-bold mt-1">{{ errors.password }}</p>
            </div>

            <!-- Phone Number -->
            <div class="space-y-2">
              <label class="text-xs font-black text-slate-400 uppercase tracking-widest"
                >Phone Number <span class="text-red-500">*</span></label
              >
              <input
                v-model="form.phone"
                type="tel"
                :class="[
                  'w-full px-4 py-3 rounded-xl border-2 outline-none transition-all',
                  errors.phone
                    ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                    : 'border-slate-100 focus:border-[#002888] focus:ring-4 focus:ring-blue-100',
                ]"
              />
              <p v-if="errors.phone" class="text-red-500 text-xs font-bold mt-1">{{ errors.phone }}</p>
            </div>

            <!-- Business Address -->
            <div class="space-y-2 md:col-span-2">
              <label class="text-xs font-black text-slate-400 uppercase tracking-widest"
                >Business Address <span class="text-red-500">*</span></label
              >
              <textarea
                v-model="form.address"
                rows="3"
                :class="[
                  'w-full px-4 py-3 rounded-xl border-2 outline-none transition-all resize-none',
                  errors.address
                    ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                    : 'border-slate-100 focus:border-[#002888] focus:ring-4 focus:ring-blue-100',
                ]"
              />
              <p v-if="errors.address" class="text-red-500 text-xs font-bold mt-1">{{ errors.address }}</p>
            </div>

            <div class="md:col-span-2 pt-4">
              <button
                type="submit"
                :disabled="isLoading"
                class="w-full inline-flex items-center justify-center gap-2 bg-[#002888] text-white px-8 py-4 rounded-xl font-black uppercase tracking-wider hover:bg-blue-900 transition-all disabled:opacity-60 shadow-lg shadow-blue-900/10 active:scale-[0.99]"
              >
                <span
                  v-if="isLoading"
                  class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
                />
                {{ isLoading ? 'Submitting Application...' : 'Register as Dealer' }}
              </button>
              <p class="text-center mt-6 text-sm text-slate-500 font-medium">
                Already have an account?
                <NuxtLink to="/login" class="text-[#002888] font-bold hover:underline">Sign In</NuxtLink>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>
