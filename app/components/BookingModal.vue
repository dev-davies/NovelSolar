<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" @click="closeModal"></div>

    <!-- Modal Content -->
    <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col transform transition-all">
      
      <!-- Header -->
      <div class="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <div>
          <h2 class="text-2xl font-black text-[#002888]">Book Service</h2>
          <p class="text-sm text-gray-500 font-medium mt-1">
            {{ serviceName || 'Novel Solar Professional Service' }}
          </p>
        </div>
        <button @click="closeModal" class="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <!-- Scrollable Form Area -->
      <div class="p-8 overflow-y-auto hidden-scrollbar flex-1">
        
        <div v-if="submitSuccess" class="py-12 text-center text-green-600">
           <span class="material-symbols-outlined text-[80px] mb-4 text-green-500">check_circle</span>
           <h3 class="text-2xl font-black text-slate-900 mb-2">Request Received!</h3>
           <p class="text-gray-600 font-medium">Your {{ serviceName }} request has been recorded. Our team will contact you shortly.</p>
           <button @click="closeModal" class="mt-8 bg-black text-white px-8 py-3 rounded-xl font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors">
              Done
           </button>
        </div>

        <form v-else @submit.prevent="submitBooking" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <!-- Contact Details -->
            <div class="md:col-span-2">
              <h3 class="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 border-b pb-2">Your Information</h3>
            </div>
            
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-gray-600 uppercase tracking-wider">First Name <span class="text-red-500">*</span></label>
              <input v-model="form.firstName" type="text" required
                class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#002888]/20 focus:border-[#002888] transition-all"
                placeholder="e.g. John" />
            </div>

            <div class="space-y-1.5">
              <label class="text-xs font-bold text-gray-600 uppercase tracking-wider">Last Name <span class="text-red-500">*</span></label>
              <input v-model="form.lastName" type="text" required
                class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#002888]/20 focus:border-[#002888] transition-all"
                placeholder="e.g. Doe" />
            </div>

            <div class="space-y-1.5">
              <label class="text-xs font-bold text-gray-600 uppercase tracking-wider">Email Address <span class="text-red-500">*</span></label>
              <input v-model="form.email" type="email" required
                class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#002888]/20 focus:border-[#002888] transition-all"
                placeholder="john@example.com" />
            </div>

            <div class="space-y-1.5">
              <label class="text-xs font-bold text-gray-600 uppercase tracking-wider">Phone Number <span class="text-red-500">*</span></label>
              <input v-model="form.phone" type="tel" required
                class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#002888]/20 focus:border-[#002888] transition-all"
                placeholder="0800 000 0000" />
            </div>

            <div class="md:col-span-2 space-y-1.5">
              <label class="text-xs font-bold text-gray-600 uppercase tracking-wider">Service Location Address <span class="text-red-500">*</span></label>
              <input v-model="form.address" type="text" required
                class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#002888]/20 focus:border-[#002888] transition-all"
                placeholder="Full street address in Nigeria" />
            </div>

            <!-- Booking Details -->
            <div class="md:col-span-2 mt-4">
              <h3 class="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 border-b pb-2">Scheduling</h3>
            </div>

            <div class="space-y-1.5 md:col-span-2">
              <label class="text-xs font-bold text-gray-600 uppercase tracking-wider">Requested Date <span class="text-red-500">*</span></label>
              <p class="text-xs text-gray-400 mb-2">Same-day booking is unavailable. Sundays are closed for service.</p>
              <div class="relative">
                 <input v-model="form.requestedDate" :min="tomorrowDate" type="date" required @input="validateDate"
                  class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#002888]/20 focus:border-[#002888] transition-all" />
                 <span v-if="dateError" class="absolute -bottom-6 left-0 text-red-500 text-xs font-semibold">{{ dateError }}</span>
              </div>
            </div>

            <div class="space-y-1.5 md:col-span-2 mt-4">
              <label class="text-xs font-bold text-gray-600 uppercase tracking-wider">Additional Notes (Optional)</label>
              <textarea v-model="form.notes" rows="3"
                class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#002888]/20 focus:border-[#002888] transition-all resize-none"
                placeholder="Tell us about your setup or specific requirements..."></textarea>
            </div>

          </div>
          
          <!-- Submit Action -->
          <div class="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
             <div class="text-sm font-bold text-gray-500 w-full sm:w-auto text-center sm:text-left">
                Estimated Cost: <span class="text-[#002888] text-lg">{{ formatPrice(servicePrice) }} NGN</span>
             </div>
             <button type="submit" :disabled="isSubmitting || !!dateError" class="w-full sm:w-auto bg-[#002888] text-white px-8 py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-blue-900 transition-colors shadow-lg active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                <span v-if="isSubmitting" class="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                <span v-else>Confirm Request</span>
             </button>
          </div>

        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  isOpen: Boolean,
  serviceName: String,
  servicePrice: [String, Number]
})

const emit = defineEmits(['close'])

const closeModal = () => {
  if (!isSubmitting.value) {
    emit('close')
    // Reset state after transition
    setTimeout(resetForm, 300)
  }
}

// Ensure min date is tomorrow
const tomorrow = new Date()
tomorrow.setDate(tomorrow.getDate() + 1)
const tomorrowDate = computed(() => tomorrow.toISOString().split('T')[0])

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  requestedDate: '',
  notes: ''
})

const dateError = ref('')
const isSubmitting = ref(false)
const submitSuccess = ref(false)

const validateDate = () => {
  dateError.value = ''
  if (!form.value.requestedDate) return

  const selectedDate = new Date(form.value.requestedDate)
  // getDay() returns 0 for Sunday
  if (selectedDate.getDay() === 0) {
    dateError.value = 'Sundays are not available for service bookings.'
    form.value.requestedDate = '' // Clear invalid selection
  }
}

const formatPrice = (price) => {
  if (!price) return '0'
  return Number(price).toLocaleString()
}

const resetForm = () => {
  form.value = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    requestedDate: '',
    notes: ''
  }
  submitSuccess.value = false
  dateError.value = ''
}

const submitBooking = async () => {
  if (dateError.value) return

  isSubmitting.value = true
  
  try {
    const payload = {
      serviceName: props.serviceName,
      servicePrice: props.servicePrice,
      customer: {
        firstName: form.value.firstName,
        lastName: form.value.lastName,
        email: form.value.email,
        phone: form.value.phone,
        address: form.value.address
      },
      requestedDate: form.value.requestedDate,
      notes: form.value.notes
    }

    const { error } = await useFetch('/api/book-service', {
      method: 'POST',
      body: payload
    })

    if (error.value) throw new Error(error.value.message || 'Failed to submit')

    submitSuccess.value = true
  } catch (err) {
    console.error('Booking failed:', err)
    alert('We encountered an error processing your request. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
/* Hide scrollbar for a cleaner look */
.hidden-scrollbar::-webkit-scrollbar {
  display: none;
}
.hidden-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>
