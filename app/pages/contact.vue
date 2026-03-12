<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 py-16 px-4 text-center">
      <h1 class="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
        Contact NovelSolar
      </h1>
      <p class="text-lg text-gray-500 max-w-2xl mx-auto">
        Have questions? Our team is here to help you find the best solar solutions for your needs.
      </p>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-16">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        <!-- Left: Form Placeholder -->
        <div class="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 italic">
          <h2 class="text-2xl font-bold text-gray-900 mb-8 not-italic">Send us a message</h2>
          <div class="space-y-6">
            <div class="h-12 bg-gray-50 rounded-xl border border-gray-100 flex items-center px-4 text-gray-400">Your Full Name</div>
            <div class="h-12 bg-gray-50 rounded-xl border border-gray-100 flex items-center px-4 text-gray-400">Email Address</div>
            <div class="h-32 bg-gray-50 rounded-xl border border-gray-100 p-4 text-gray-400">Your Inquiry...</div>
            <div class="h-14 bg-[#002888]/10 rounded-xl border border-[#002888]/20 flex items-center justify-center text-[#002888] font-bold">
              Submit Form (Coming Soon)
            </div>
          </div>
        </div>

        <!-- Right: Contact Details -->
        <div class="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
          <h2 class="text-2xl font-bold text-gray-900 mb-8">Contact Details</h2>
          <div class="space-y-8">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#002888]">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <h3 class="font-bold text-gray-900">Phone</h3>
                <p class="text-gray-500">+234 800 SOLAR NG</p>
              </div>
            </div>

            <div class="flex items-start gap-4">
              <div class="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#002888]">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 class="font-bold text-gray-900">Email</h3>
                <p class="text-gray-500">hello@novelsolar.ng</p>
              </div>
            </div>

            <div class="flex items-start gap-4">
              <div class="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#002888]">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 class="font-bold text-gray-900">Location</h3>
                <p class="text-gray-500">Lagos, Nigeria</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'Contact | NovelSolar',
  meta: [
    { name: 'description', content: 'Contact NovelSolar for all your solar energy needs in Nigeria.' }
  ]
})
</script>
