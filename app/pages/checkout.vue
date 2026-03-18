<script setup>
const { cart, cartTotalAmount } = useCart();

const selectedFulfillment = ref('delivery'); // 'delivery' or 'pickup'
const selectedState = ref('');
const selectedBranch = ref(null);

const suggestedBranches = computed(() => {
  if (!selectedState.value) return [];
  
  // 1. If we have exact matches, return them immediately
  if (exactMatches.value.length > 0) {
    return exactMatches.value;
  }
  
  // 2. Otherwise, find the closest branches via coordinates
  const stateData = nigerianStates.find(s => s.name === selectedState.value);
  if (!stateData) return [];
  
  const sorted = [...branches].sort((a, b) => {
    const distA = getDistance(stateData.coords[0], stateData.coords[1], a.coordinates[0], a.coordinates[1]);
    const distB = getDistance(stateData.coords[0], stateData.coords[1], b.coordinates[0], b.coordinates[1]);
    return distA - distB;
  });
  
  return sorted.slice(0, 3);
});

const exactMatches = computed(() => {
  if (!selectedState.value) return [];
  // Clean the string: If it's 'FCT - Abuja', just search for 'abuja'
  const searchState = selectedState.value.replace('FCT - ', '').toLowerCase();
  return branches.filter(b => b.address && b.address.toLowerCase().includes(searchState));
});

// Form state
const form = ref({
  email: '',
  firstName: '',
  lastName: '',
  address: '',
  phone: '',
  orderNote: '',
  paymentMethod: 'cod'
});

const isSubmitting = ref(false);

const handleCompleteOrder = async () => {
  if (cart.value.length === 0) return;
  
  isSubmitting.value = true;
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Clear cart and navigate to success
  // cart.value = []; // This should be handled by a clearCart function in useCart if needed
  navigateTo('/success');
};
</script>

<template>
  <main class="max-w-6xl mx-auto w-full px-4 md:px-6 py-8 md:py-12">
    <div v-if="cart.length === 0" class="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
      <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <span class="material-symbols-outlined text-4xl text-gray-300">shopping_cart</span>
      </div>
      <h2 class="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
      <p class="text-gray-500 mb-8">Add some solar equipment to your cart before checking out.</p>
      <NuxtLink to="/products" class="bg-[#002888] text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-900 transition-all shadow-lg inline-block">
        Return to Shop
      </NuxtLink>
    </div>

    <div v-else class="flex flex-col lg:flex-row gap-12">
      <!-- Left Column: Forms -->
      <div class="flex-1 space-y-10">
        <!-- Contact Information -->
        <section class="space-y-4">
          <div class="flex items-center gap-2 mb-2">
            <span class="w-8 h-8 rounded-full bg-[#002888] text-white flex items-center justify-center text-sm font-bold">1</span>
            <h2 class="text-xl font-bold text-slate-900">Contact Information</h2>
          </div>
          <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
              <input 
                v-model="form.email"
                type="email" 
                placeholder="you@example.com"
                class="rounded-lg border-slate-200 bg-slate-50 focus:ring-2 focus:ring-[#002888]/20 focus:border-[#002888] p-3 w-full transition-all outline-none"
              >
            </div>
          </div>
        </section>

        <!-- Shipping Address -->
        <section class="space-y-4">
          <div class="flex items-center gap-2 mb-2">
            <span class="w-8 h-8 rounded-full bg-[#002888] text-white flex items-center justify-center text-sm font-bold">2</span>
            <h2 class="text-xl font-bold text-slate-900">Shipping Address</h2>
          </div>
          <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-1.5">First Name</label>
                <input 
                  v-model="form.firstName"
                  type="text" 
                  placeholder="John"
                  class="rounded-lg border-slate-200 bg-slate-50 focus:ring-2 focus:ring-[#002888]/20 focus:border-[#002888] p-3 w-full transition-all outline-none"
                >
              </div>
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-1.5">Last Name</label>
                <input 
                  v-model="form.lastName"
                  type="text" 
                  placeholder="Doe"
                  class="rounded-lg border-slate-200 bg-slate-50 focus:ring-2 focus:ring-[#002888]/20 focus:border-[#002888] p-3 w-full transition-all outline-none"
                >
              </div>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-semibold text-slate-700 mb-1.5">Street Address</label>
              <input 
                v-model="form.address"
                type="text" 
                placeholder="123 Solar Street, Phase 1"
                class="rounded-lg border-slate-200 bg-slate-50 focus:ring-2 focus:ring-[#002888]/20 focus:border-[#002888] p-3 w-full transition-all outline-none"
              >
            </div>
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number</label>
              <input 
                v-model="form.phone"
                type="tel" 
                placeholder="+234..."
                class="rounded-lg border-slate-200 bg-slate-50 focus:ring-2 focus:ring-[#002888]/20 focus:border-[#002888] p-3 w-full transition-all outline-none"
              >
            </div>
          </div>
        </section>

        <!-- Fulfillment Setup (Smart Router) -->
        <section class="space-y-6">
          <div class="flex items-center gap-2 mb-2">
            <span class="w-8 h-8 rounded-full bg-[#002888] text-white flex items-center justify-center text-sm font-bold">3</span>
            <h2 class="text-xl font-bold text-slate-900">Fulfillment Options</h2>
          </div>

          <!-- Fulfillment Toggle -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              @click="selectedFulfillment = 'delivery'"
              class="p-6 rounded-2xl border-2 transition-all flex items-center gap-4 text-left"
              :class="selectedFulfillment === 'delivery' ? 'border-[#002888] bg-blue-50/30' : 'border-gray-100 bg-white hover:border-gray-200'"
            >
              <div class="w-12 h-12 rounded-xl bg-[#002888] text-white flex items-center justify-center">
                <span class="material-symbols-outlined">local_shipping</span>
              </div>
              <div>
                <p class="font-bold text-slate-900">Local Delivery</p>
                <p class="text-xs text-slate-500">Doorstep delivery within Nigeria</p>
              </div>
            </button>
            <button 
              @click="selectedFulfillment = 'pickup'"
              class="p-6 rounded-2xl border-2 transition-all flex items-center gap-4 text-left"
              :class="selectedFulfillment === 'pickup' ? 'border-[#002888] bg-blue-50/30' : 'border-gray-100 bg-white hover:border-gray-200'"
            >
              <div class="w-12 h-12 rounded-xl bg-orange-500 text-white flex items-center justify-center">
                <span class="material-symbols-outlined">storefront</span>
              </div>
              <div>
                <p class="font-bold text-slate-900">Store Pickup</p>
                <p class="text-xs text-slate-500">Free pickup from closest branch</p>
              </div>
            </button>
          </div>

          <!-- State Selector -->
          <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">Select your shipping state:</label>
              <select 
                v-model="selectedState"
                class="rounded-lg border-slate-200 bg-slate-50 focus:ring-2 focus:ring-[#002888]/20 focus:border-[#002888] p-3 w-full transition-all outline-none"
              >
                <option value="" disabled>Choose a state...</option>
                <option v-for="state in nigerianStates" :key="state.name" :value="state.name">
                  {{ state.name }}
                </option>
              </select>
            </div>
          </div>

          <!-- Branch Suggestions Section -->
          <div v-if="suggestedBranches.length > 0" class="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
            <div class="flex items-center gap-2 px-1">
              <span class="material-symbols-outlined text-[#002888] text-lg">hub</span>
              <h4 class="font-bold text-slate-800 text-sm">
                {{ exactMatches.length > 0 ? 'Expert branches available in your state:' : 'No branches in your state. Here are the closest options:' }}
              </h4>
            </div>
            
            <div class="grid gap-3">
              <label 
                v-for="branch in suggestedBranches" 
                :key="branch.name"
                class="flex items-center gap-4 p-5 rounded-xl border cursor-pointer transition-all hover:shadow-md"
                :class="selectedBranch?.name === branch.name ? 'border-[#002888] bg-blue-50/30 ring-1 ring-[#002888]' : 'border-gray-100 bg-white'"
              >
                <input type="radio" v-model="selectedBranch" :value="branch" class="w-5 h-5 text-[#002888] border-gray-300 focus:ring-[#002888]">
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-0.5">
                    <p class="font-bold text-slate-900 truncate uppercase text-sm">{{ branch.name }}</p>
                    <span v-if="exactMatches.some(e => e.name === branch.name)" class="bg-green-100 text-green-700 text-[8px] font-black px-1.5 py-0.5 rounded uppercase">In State</span>
                  </div>
                  <p class="text-xs text-slate-500 line-clamp-1 italic">{{ branch.address }}</p>
                </div>
                <div class="text-right shrink-0">
                  <p class="text-[10px] font-black text-[#002888] uppercase tracking-tighter">
                    {{ branch.city }}
                  </p>
                </div>
              </label>
            </div>
          </div>
        </section>

        <!-- Payment Options -->
        <section class="space-y-4">
          <div class="flex items-center gap-2 mb-2">
            <span class="w-8 h-8 rounded-full bg-[#002888] text-white flex items-center justify-center text-sm font-bold">4</span>
            <h2 class="text-xl font-bold text-slate-900">Payment Options</h2>
          </div>
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <label class="flex items-center gap-4 p-6 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100">
              <input type="radio" v-model="form.paymentMethod" value="cod" class="w-5 h-5 text-[#002888] border-gray-300 focus:ring-[#002888]">
              <div class="flex-1">
                <p class="font-bold text-slate-900 uppercase text-sm tracking-wide">Cash on Delivery</p>
                <p class="text-xs text-slate-500">Pay when your items arrive</p>
              </div>
              <span class="material-symbols-outlined text-gray-400">payments</span>
            </label>
            <label class="flex items-center gap-4 p-6 cursor-pointer hover:bg-gray-50 transition-colors">
              <input type="radio" v-model="form.paymentMethod" value="financing" class="w-5 h-5 text-[#002888] border-gray-300 focus:ring-[#002888]">
              <div class="flex-1">
                <p class="font-bold text-slate-900 uppercase text-sm tracking-wide">Financing / Installment</p>
                <p class="text-xs text-slate-500">Flexible payment plans available</p>
              </div>
              <span class="material-symbols-outlined text-gray-400">account_balance</span>
            </label>
          </div>
        </section>

        <!-- Order Note -->
        <section class="space-y-4">
          <div class="flex items-center gap-2 mb-2">
            <span class="w-8 h-8 rounded-full bg-[#002888] text-white flex items-center justify-center text-sm font-bold">5</span>
            <h2 class="text-xl font-bold text-slate-900">Special Instructions</h2>
          </div>
          <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <textarea 
              v-model="form.orderNote"
              rows="3" 
              placeholder="Any additional notes for delivery..."
              class="rounded-lg border-slate-200 bg-slate-50 focus:ring-2 focus:ring-[#002888]/20 focus:border-[#002888] p-3 w-full transition-all outline-none resize-none"
            ></textarea>
          </div>
        </section>

        <!-- Submit Button -->
        <button 
          @click="handleCompleteOrder"
          :disabled="isSubmitting"
          class="w-full bg-[#002888] text-white font-bold py-5 rounded-2xl shadow-xl hover:bg-blue-900 transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-[0.98]"
        >
          <span v-if="isSubmitting" class="animate-spin border-2 border-white/30 border-t-white w-5 h-5 rounded-full"></span>
          {{ isSubmitting ? 'Processing Order...' : 'Complete Order' }}
          <span v-if="!isSubmitting" class="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>

      <!-- Right Column: Sticky Order Summary -->
      <div class="w-full lg:w-[400px]">
        <div class="sticky top-24 space-y-6">
          <div class="bg-white p-8 rounded-2xl border border-gray-100 shadow-xl">
            <h2 class="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span class="material-symbols-outlined text-[#002888]">receipt_long</span>
              Order Summary
            </h2>

            <!-- Dynamic Cart Loop -->
            <div class="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              <div v-for="item in cart" :key="item.id" class="flex gap-4">
                <div class="relative w-16 h-16 shrink-0">
                  <div class="w-full h-full bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 overflow-hidden">
                    <span class="material-symbols-outlined text-gray-300 text-2xl">solar_power</span>
                  </div>
                  <span class="absolute -top-2 -right-2 bg-[#002888] text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white z-10">
                    {{ item.quantity }}
                  </span>
                </div>
                <div class="flex-1 flex flex-col justify-center min-w-0">
                  <h3 class="text-sm font-bold text-slate-900 line-clamp-1 uppercase tracking-tight">{{ item.name }}</h3>
                  <p class="text-xs text-slate-500 font-medium">₦{{ Number(item.price).toLocaleString() }} each</p>
                </div>
                <div class="flex flex-col items-end justify-center">
                  <span class="text-sm font-black text-slate-900 italic">₦{{ Number(item.price * item.quantity).toLocaleString() }}</span>
                </div>
              </div>
            </div>

            <!-- Totals Section -->
            <div class="space-y-4 pt-6 border-t border-dashed border-gray-200">
              <div class="flex justify-between text-sm text-slate-600 font-medium">
                <span>Subtotal</span>
                <span>₦{{ Number(cartTotalAmount).toLocaleString() }}</span>
              </div>
              <div class="flex justify-between text-sm text-slate-600 font-medium">
                <span>Shipping</span>
                <span class="text-green-600 font-bold uppercase text-[10px] bg-green-50 px-2 py-0.5 rounded">Calculated at next step</span>
              </div>
              <div class="flex justify-between items-end pt-4 border-t border-gray-100">
                <span class="text-sm font-bold text-slate-900">Total Due</span>
                <div class="flex flex-col items-end">
                  <span class="text-3xl font-black text-[#002888]">₦{{ Number(cartTotalAmount).toLocaleString() }}</span>
                  <span class="text-[10px] text-slate-400 font-bold uppercase mt-1">Inclusive of all taxes</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Trust Badges -->
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex flex-col items-center text-center">
              <span class="material-symbols-outlined text-[#002888] mb-2">verified_user</span>
              <p class="text-[10px] font-bold text-slate-900 uppercase tracking-wider mb-1">Secure Payment</p>
              <p class="text-[9px] text-slate-500 leading-tight">SSL encrypted checkout process</p>
            </div>
            <div class="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex flex-col items-center text-center">
              <span class="material-symbols-outlined text-[#002888] mb-2">support_agent</span>
              <p class="text-[10px] font-bold text-slate-900 uppercase tracking-wider mb-1">24/7 Support</p>
              <p class="text-[9px] text-slate-500 leading-tight">Expert help for solar systems</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
</style>
