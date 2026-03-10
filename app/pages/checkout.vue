<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="flex flex-col lg:flex-row gap-8">
      
      <!-- Left Column: Checkout Steps -->
      <div class="lg:w-2/3 space-y-6">
        <h1 class="text-3xl font-extrabold text-gray-900 mb-8">Secure Checkout</h1>

        <!-- Step 1: Shipping & Delivery -->
        <section class="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <div class="flex items-center gap-4 mb-8">
            <div class="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">1</div>
            <h2 class="text-xl font-bold text-gray-900">Shipping & Delivery</h2>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="text-sm font-bold text-gray-700">First Name</label>
              <input v-model="checkoutForm.firstName" type="text" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50/50" placeholder="John">
            </div>
            <div class="space-y-2">
              <label class="text-sm font-bold text-gray-700">Last Name</label>
              <input v-model="checkoutForm.lastName" type="text" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50/50" placeholder="Doe">
            </div>
            <div class="md:col-span-2 space-y-2">
              <label class="text-sm font-bold text-gray-700">Shipping Address</label>
              <input v-model="checkoutForm.address" type="text" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50/50" placeholder="123 Solar Way, Sunnyville, CA">
            </div>
          </div>
        </section>

        <!-- Step 2: Payment Method -->
        <section class="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <div class="flex items-center gap-4 mb-8">
            <div class="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">2</div>
            <h2 class="text-xl font-bold text-gray-900">Payment Method</h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <!-- Debit Card -->
            <label 
              @click="paymentMethod = 'debit_card'"
              :class="['flex items-center justify-between p-6 rounded-2xl border-2 cursor-pointer transition-all', paymentMethod === 'debit_card' ? 'border-primary bg-blue-50/50' : 'border-gray-100 hover:border-blue-200']"
            >
              <div class="flex items-center gap-4">
                <div class="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center" :class="{'border-primary': paymentMethod === 'debit_card'}">
                  <div v-show="paymentMethod === 'debit_card'" class="w-2.5 h-2.5 rounded-full bg-primary"></div>
                </div>
                <span class="font-bold text-gray-800">Debit Card</span>
              </div>
            </label>

            <!-- Bank Transfer -->
            <label 
              @click="paymentMethod = 'transfer'"
              :class="['flex items-center justify-between p-6 rounded-2xl border-2 cursor-pointer transition-all', paymentMethod === 'transfer' ? 'border-primary bg-blue-50/50' : 'border-gray-100 hover:border-blue-200']"
            >
              <div class="flex items-center gap-4">
                <div class="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center" :class="{'border-primary': paymentMethod === 'transfer'}">
                  <div v-show="paymentMethod === 'transfer'" class="w-2.5 h-2.5 rounded-full bg-primary"></div>
                </div>
                <span class="font-bold text-gray-800">Bank Transfer</span>
              </div>
            </label>

            <!-- Pay at Pickup -->
            <label 
              @click="paymentMethod = 'pay_at_pickup'"
              :class="['flex items-center justify-between p-6 rounded-2xl border-2 cursor-pointer transition-all', paymentMethod === 'pay_at_pickup' ? 'border-primary bg-blue-50/50' : 'border-gray-100 hover:border-blue-200']"
            >
              <div class="flex items-center gap-4">
                <div class="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center" :class="{'border-primary': paymentMethod === 'pay_at_pickup'}">
                  <div v-show="paymentMethod === 'pay_at_pickup'" class="w-2.5 h-2.5 rounded-full bg-primary"></div>
                </div>
                <span class="font-bold text-gray-800">Pay at Pickup</span>
              </div>
            </label>

            <!-- Financing -->
            <label 
              @click="paymentMethod = 'financing'"
              :class="['flex items-center justify-between p-6 rounded-2xl border-2 cursor-pointer transition-all', paymentMethod === 'financing' ? 'border-primary bg-blue-50/50' : 'border-gray-100 hover:border-blue-200']"
            >
              <div class="flex items-center gap-4">
                <div class="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center" :class="{'border-primary': paymentMethod === 'financing'}">
                  <div v-show="paymentMethod === 'financing'" class="w-2.5 h-2.5 rounded-full bg-primary"></div>
                </div>
                <div class="flex flex-col">
                  <span class="font-bold text-gray-800">Financing</span>
                  <span class="text-[10px] font-extrabold text-primary uppercase tracking-widest">As low as 0% APR</span>
                </div>
              </div>
            </label>
          </div>

          <!-- Conditional Payment Info -->
          <div class="mb-8">
            <!-- Debit Card Details -->
            <div v-if="checkoutForm.paymentMethod === 'debit_card'" class="space-y-4">
              <div class="space-y-2">
                <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Cardholder Name</label>
                <input type="text" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50/50" placeholder="John Doe">
              </div>
              <div class="space-y-2">
                <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Card Number</label>
                <input type="text" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50/50" placeholder="0000 0000 0000 0000">
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Expiry Date</label>
                  <input type="text" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50/50" placeholder="MM/YY">
                </div>
                <div class="space-y-2">
                  <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">CVC</label>
                  <input type="text" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50/50" placeholder="123">
                </div>
              </div>
            </div>

            <!-- Bank Transfer Helper -->
            <div v-if="checkoutForm.paymentMethod === 'transfer'" class="p-4 bg-blue-50 text-blue-800 rounded-md text-sm border border-blue-100 flex items-start gap-3">
              <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>Please transfer the total amount to NovelSolar GTBank Account: <strong>0123456789</strong>. Your order will be processed upon confirmation.</span>
            </div>

            <!-- Pay at Pickup Helper -->
            <div v-if="checkoutForm.paymentMethod === 'pay_at_pickup'" class="p-4 bg-gray-50 text-gray-800 rounded-md text-sm border border-gray-200 flex items-start gap-3">
              <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <span>You can pay via POS or Cash at our main warehouse during pickup.</span>
            </div>

            <!-- Financing Helper -->
            <div v-if="checkoutForm.paymentMethod === 'financing'" class="p-4 bg-green-50 text-green-800 rounded-md text-sm border border-green-100 flex items-start gap-3">
              <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              <span>A representative will contact you to set up your 12-month installment plan.</span>
            </div>
          </div>

          <button 
            class="bg-[#002888] text-white w-full py-6 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:bg-blue-900 transition-all active:scale-[0.98]"
            @click.prevent="processCheckout"
          >
            Complete Secure Purchase
          </button>
          
          <p class="text-center text-xs text-gray-400 mt-6 flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            SSL Encrypted & PCI Compliant Payment
          </p>
        </section>
      </div>

      <!-- Right Column: Sticky Order Summary -->
      <aside class="lg:w-1/3">
        <div class="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sticky top-24">
          <h2 class="text-xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-50">Order Summary</h2>
          
          <div class="space-y-4 mb-8">
            <div v-for="item in cart" :key="item.ID" class="flex items-center gap-4">
              <div class="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 p-2 overflow-hidden flex-shrink-0 flex items-center justify-center">
                <!-- Fallback icon if no image -->
                <svg class="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div class="flex-grow">
                <h4 class="text-sm font-bold text-gray-800 line-clamp-1">{{ item.NAME }}</h4>
                <p class="text-xs text-gray-400">Qty: 1</p>
              </div>
              <div class="text-sm font-bold text-gray-900">{{ new Intl.NumberFormat('en-NG', { style: 'currency', currency: item.CURRENCY_ID || 'NGN' }).format(item.PRICE) }}</div>
            </div>
          </div>

          <div class="space-y-4 pt-6 border-t border-gray-50 mb-8">
            <div class="flex justify-between text-sm text-gray-500">
              <span>Subtotal</span>
              <span class="font-bold text-gray-900">{{ new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(subtotal) }}</span>
            </div>
            <div class="flex justify-between text-sm text-gray-500">
              <span>Professional Installation</span>
              <span class="font-bold text-green-600">FREE</span>
            </div>
            <div class="flex justify-between text-sm text-gray-500">
              <div class="flex items-center gap-1">
                <span>Federal Tax Credit</span>
                <svg class="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <span class="font-bold text-primary">-${{ taxCredit.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between text-lg font-extrabold text-gray-900 pt-4 border-t border-gray-50">
              <span>Total Due Today</span>
              <span class="text-primary">{{ new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(finalTotal) }}</span>
            </div>
          </div>

          <div class="bg-green-50 rounded-2xl p-4 border border-green-100 flex items-center gap-3">
            <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center text-green-600 shadow-sm">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
            </div>
            <div>
              <div class="text-xs font-extrabold text-green-800 uppercase tracking-widest leading-none mb-1">Guaranteed Savings</div>
              <div class="text-[10px] text-green-700">Protected by our price match and performance guarantee.</div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';

const cart = useState('cart', () => [])

const subtotal = computed(() => {
  return cart.value.reduce((sum, item) => sum + Number(item.PRICE || 0), 0)
})

const taxCredit = computed(() => {
  return Math.round(subtotal.value * 0.3); // 30% Federal credit approximation
});

const finalTotal = computed(() => {
  return subtotal.value - taxCredit.value;
});

// Create reactive form state for the user inputs
const checkoutForm = reactive({
  firstName: '',
  lastName: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  paymentMethod: 'debit_card'
})

const paymentMethod = computed({
  get: () => checkoutForm.paymentMethod,
  set: (val) => checkoutForm.paymentMethod = val
})

// Placeholder function for the final button
const processCheckout = async () => {
  try {
    const response = await $fetch<{ success: boolean; dealId: string }>('/api/checkout', {
      method: 'POST',
      body: {
        user: checkoutForm,
        items: cart.value,
        total: finalTotal.value
      }
    })
    
    if (response.success) {
      // Clear the cart
      cart.value = []
      // Redirect to a simple success page
      navigateTo('/success')
    }
  } catch (error) {
    console.error('Checkout failed', error)
    alert('There was an issue processing your order. Please try again.')
  }
}
</script>
