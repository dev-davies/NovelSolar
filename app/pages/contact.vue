<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Header -->
    <section class="bg-white border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 class="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 italic tracking-tight">Contact Us</h1>
        <p class="text-lg text-gray-500 max-w-2xl mx-auto">
          Have questions about our solar solutions or need technical support? 
          Our team of energy experts is ready to help you power your project.
        </p>
      </div>
    </section>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        <!-- Left: Form -->
        <div class="bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-sm border border-gray-100">
          <h2 class="text-2xl font-bold text-gray-900 mb-8">Send us a message</h2>
          <form @submit.prevent class="space-y-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Full Name</label>
                <input type="text" class="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all bg-gray-50/50 hover:bg-white" placeholder="Enter your name">
              </div>
              <div class="space-y-2">
                <label class="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Email Address</label>
                <input type="email" class="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all bg-gray-50/50 hover:bg-white" placeholder="name@company.com">
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Inquiry Type</label>
              <select class="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all bg-gray-50/50 hover:bg-white appearance-none cursor-pointer">
                <option>Residential Installation</option>
                <option>Commercial Projects</option>
                <option>Technical Support</option>
                <option>Bulk Inventory Purchase</option>
                <option>Partnership Opportunities</option>
              </select>
            </div>

            <div class="space-y-2">
              <label class="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Message</label>
              <textarea rows="5" class="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all bg-gray-50/50 hover:bg-white resize-none" placeholder="How can we help you?"></textarea>
            </div>

            <button 
              type="submit"
              class="bg-[#002888] text-white w-full py-6 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:bg-blue-900 transition-all active:scale-[0.98]"
            >
              Send Message
            </button>
          </form>
        </div>

        <!-- Right: Info -->
        <div class="space-y-8">
          <!-- Support Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div class="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
              <div class="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              </div>
              <h3 class="font-bold text-gray-900 mb-2">Phone Support</h3>
              <p class="text-sm text-gray-500 mb-4">Mon-Fri from 8am to 6pm.</p>
              <a href="tel:+15551234567" class="text-primary font-bold hover:underline">+1 (555) 123-4567</a>
            </div>

            <div class="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
              <div class="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <h3 class="font-bold text-gray-900 mb-2">Email Us</h3>
              <p class="text-sm text-gray-500 mb-4">Our team typically responds within 2 hours.</p>
              <a href="mailto:support@novelsolar.com" class="text-primary font-bold hover:underline">support@novelsolar.com</a>
            </div>
          </div>

          <!-- Headquarters Card -->
          <div class="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden group">
            <div class="p-8">
              <div class="flex items-center gap-4 mb-6">
                <div class="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <div>
                  <h3 class="font-bold text-gray-900 leading-none mb-1">Our Headquarters</h3>
                  <p class="text-xs text-gray-400 font-medium">Silicon Valley Hub</p>
                </div>
              </div>
              <p class="text-gray-500 text-sm leading-relaxed mb-6">
                88 Energy Way, innovation Park <br>
                Palo Alto, CA 94304 <br>
                United States
              </p>
            </div>
            <div class="h-64 bg-gray-100 overflow-hidden border-t border-gray-50">
              <img src="/images/contact_map_graphic_1773069085205.png" alt="Map Location" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-80" />
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
</script>
