<template>
  <div class="min-h-screen flex flex-col bg-background font-sans text-gray-800">
    <!-- Navbar -->
    <header class="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-200 h-20 sticky top-0 z-50">
      <!-- Left Section: Logo & Links -->
      <div class="flex items-center gap-8">
        <NuxtLink to="/" class="flex items-center">
          <img src="/images/logo.png" alt="NovelSolar" class="h-8 w-auto" />
        </NuxtLink>
        <nav class="hidden lg:flex items-center gap-2">
          <!-- Product Dropdown -->
          <div class="relative group py-6 cursor-pointer">
            <div class="flex items-center gap-1.5 text-sm font-semibold text-gray-700 group-hover:text-[#002888] transition-colors">
              Product
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 ml-0.5 group-hover:text-[#002888] group-hover:rotate-45 transition-all duration-200">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
            
            <div class="absolute top-full left-0 w-56 bg-white border border-gray-100 shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
              <ul class="py-1">
                <li><NuxtLink to="/category/solar-panels" class="block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#002888] transition-colors">Solar Panels</NuxtLink></li>
                <li><NuxtLink to="/category/inverters" class="block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#002888] transition-colors">Hybrid Inverters</NuxtLink></li>
                <li><NuxtLink to="/category/batteries" class="block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#002888] transition-colors">Lithium Batteries</NuxtLink></li>
                <li><NuxtLink to="/category/mounting" class="block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#002888] transition-colors">Mounting Systems</NuxtLink></li>
                <li><NuxtLink to="/category/accessories" class="block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#002888] transition-colors">Accessories</NuxtLink></li>
              </ul>
            </div>
          </div>

          <div class="w-4"></div>

          <!-- Services Dropdown -->
          <div class="relative group py-6 cursor-pointer">
            <div class="flex items-center gap-1.5 text-sm font-semibold text-gray-700 group-hover:text-[#002888] transition-colors">
              Services
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 ml-0.5 group-hover:text-[#002888] group-hover:rotate-45 transition-all duration-200">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>

            <div class="absolute top-full left-0 w-64 bg-white border border-gray-100 shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
              <ul class="py-1">
                <li><NuxtLink to="/services/residential" class="block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#002888] transition-colors">Residential Installation</NuxtLink></li>
                <li><NuxtLink to="/services/commercial" class="block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#002888] transition-colors">Commercial & Industrial Projects</NuxtLink></li>
                <li><NuxtLink to="/services/maintenance" class="block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#002888] transition-colors">Maintenance & Repair</NuxtLink></li>
                <li><NuxtLink to="/services/consulting" class="block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#002888] transition-colors">System Design & Consulting</NuxtLink></li>
                <li><NuxtLink to="/services/audits" class="block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#002888] transition-colors">Free Energy Audits</NuxtLink></li>
              </ul>
            </div>
          </div>

          <div class="w-4"></div>

          <!-- Partners Dropdown -->
          <div class="relative group py-6 cursor-pointer">
            <div class="flex items-center gap-1.5 text-sm font-semibold text-gray-700 group-hover:text-[#002888] transition-colors">
              Partners
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 ml-0.5 group-hover:text-[#002888] group-hover:rotate-45 transition-all duration-200">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>

            <div class="absolute top-full left-0 w-56 bg-white border border-gray-100 shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
              <ul class="py-1">
                <li><NuxtLink to="/partners/installers" class="block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#002888] transition-colors">Installer Network</NuxtLink></li>
                <li><NuxtLink to="/partners/distributors" class="block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#002888] transition-colors">Distributors</NuxtLink></li>
                <li><NuxtLink to="/partners/corporate" class="block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#002888] transition-colors">Corporate Partners</NuxtLink></li>
                <li><NuxtLink to="/partners/government" class="block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#002888] transition-colors">Government Tenders</NuxtLink></li>
                <li><NuxtLink to="/partners/become" class="block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#002888] transition-colors font-bold">Become a Partner</NuxtLink></li>
              </ul>
            </div>
          </div>

          <div class="w-4"></div>

          <!-- About Us Dropdown -->
          <div class="relative group py-6 cursor-pointer">
            <div class="flex items-center gap-1.5 text-sm font-semibold text-gray-700 group-hover:text-[#002888] transition-colors">
              About Us
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 ml-0.5 group-hover:text-[#002888] group-hover:rotate-45 transition-all duration-200">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>

            <div class="absolute top-full left-0 w-48 bg-white border border-gray-100 shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
              <ul class="py-1">
                <li><NuxtLink to="/about" class="block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#002888] transition-colors">About us</NuxtLink></li>
                <li><NuxtLink to="/outlets" class="block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#002888] transition-colors">Branch outlets</NuxtLink></li>
                <li><NuxtLink to="/gallery" class="block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#002888] transition-colors">Gallery</NuxtLink></li>
                <li><NuxtLink to="/news" class="block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#002888] transition-colors">News</NuxtLink></li>
              </ul>
            </div>
          </div>

          <div class="w-4"></div>

          <!-- Quote Request Dropdown -->
          <div class="relative group py-6 cursor-pointer text-sm font-semibold text-gray-700 hover:text-[#002888] transition-colors flex items-center gap-1">
            Quote Request
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 ml-0.5 group-hover:text-[#002888] group-hover:rotate-45 transition-all duration-200">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>

            <div class="absolute top-full left-0 w-56 bg-white border border-gray-100 shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
              <ul class="py-1">
                <li><NuxtLink to="/quote-request" class="block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#002888] transition-colors font-normal">Request a quote</NuxtLink></li>
                <li><NuxtLink to="/calculator" class="block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#002888] transition-colors font-normal">Load calculator</NuxtLink></li>
              </ul>
            </div>
          </div>

          <div class="w-4"></div>

          <!-- Support Dropdown -->
          <div class="relative group py-6 cursor-pointer text-sm font-semibold text-gray-700 hover:text-[#002888] transition-colors flex items-center gap-1">
            Support
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 ml-0.5 group-hover:text-[#002888] group-hover:rotate-45 transition-all duration-200">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>

            <div class="absolute top-full left-0 w-48 bg-white border border-gray-100 shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
              <ul class="py-1">
                <li><NuxtLink to="/contact" class="block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#002888] transition-colors font-normal">Contact us</NuxtLink></li>
              </ul>
            </div>
          </div>
        </nav>
      </div>

      <!-- Center Section: Search Bar -->
      <div class="w-64 lg:w-80 ml-auto mr-8 relative hidden lg:block">
        <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input 
          type="text" 
          placeholder="Search inventory..." 
          class="w-full bg-gray-50 border border-gray-300 rounded-md py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#002288] transition-all"
        />
      </div>

      <!-- Right Section: Actions -->
      <div class="flex items-center gap-6">
        <!-- Cart -->
        <button class="text-gray-600 hover:text-black transition-colors relative">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </button>

        <!-- Button -->
        <button class="bg-[#002888] text-white px-5 py-2.5 rounded-md text-sm font-bold hover:bg-blue-900 transition-colors shadow-sm hidden sm:block">
          Request a Quote
        </button>

        <!-- Profile Icon -->
        <div class="h-9 w-9 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity">
          <span class="text-xs font-bold uppercase">NS</span>
        </div>

        <!-- Mobile Toggle Button -->
        <button @click="toggleMobileMenu" class="lg:hidden p-2 text-gray-600 hover:text-[#002888] transition-colors" aria-label="Toggle menu">
          <svg v-if="!isMobileMenuOpen" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Mobile Dropdown Drawer -->
      <div v-show="isMobileMenuOpen" class="lg:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-200 shadow-lg z-50 flex flex-col overflow-y-auto max-h-[calc(100vh-5rem)]">
        <!-- Search -->
        <div class="p-6 border-b border-gray-50">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              type="text" 
              placeholder="Search inventory..." 
              class="w-full bg-gray-50 border border-gray-300 rounded-md py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#002288]"
            />
          </div>
        </div>

        <!-- Links -->
        <nav class="flex flex-col">
          <NuxtLink 
            v-for="link in ['Product', 'Services', 'Partners', 'About Us', 'Quote Request', 'Support']" 
            :key="link"
            to="#"
            class="block w-full text-left px-6 py-4 border-b border-gray-50 text-gray-800 font-semibold hover:bg-gray-50 hover:text-[#002888] transition-colors"
            @click="isMobileMenuOpen = false"
          >
            {{ link }}
          </NuxtLink>
        </nav>

        <!-- CTA -->
        <div class="p-6 bg-gray-50/50">
          <button class="bg-[#002888] text-white w-full py-4 rounded-lg text-sm font-bold hover:bg-blue-900 transition-colors shadow-md">
            Request a Quote
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-grow">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 mt-12 py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <!-- Column 1: Brand Info -->
          <div>
            <div class="mb-4">
              <img src="/images/logo.png" alt="NovelSolar" class="h-8 w-auto" />
            </div>
            <p class="text-sm text-gray-500 mb-4">
              Providing top-tier solar solutions for a sustainable future. Empowering communities with clean energy.
            </p>
          </div>

          <!-- Column 2: Product Categories -->
          <div>
            <h3 class="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-4">Product Categories</h3>
            <ul class="space-y-3">
              <li><NuxtLink to="/category/solar-panels" class="text-sm text-gray-500 hover:text-primary transition-colors">Solar Panels</NuxtLink></li>
              <li><NuxtLink to="/category/inverters" class="text-sm text-gray-500 hover:text-primary transition-colors">Inverters</NuxtLink></li>
              <li><NuxtLink to="/category/batteries" class="text-sm text-gray-500 hover:text-primary transition-colors">Batteries</NuxtLink></li>
              <li><NuxtLink to="/category/accessories" class="text-sm text-gray-500 hover:text-primary transition-colors">Accessories</NuxtLink></li>
            </ul>
          </div>

          <!-- Column 3: Company Links -->
          <div>
            <h3 class="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-4">Company</h3>
            <ul class="space-y-3">
              <li><NuxtLink to="/about" class="text-sm text-gray-500 hover:text-primary transition-colors">About Us</NuxtLink></li>
              <li><NuxtLink to="/careers" class="text-sm text-gray-500 hover:text-primary transition-colors">Careers</NuxtLink></li>
              <li><NuxtLink to="/blog" class="text-sm text-gray-500 hover:text-primary transition-colors">Blog</NuxtLink></li>
              <li><NuxtLink to="/contact" class="text-sm text-gray-500 hover:text-primary transition-colors">Contact</NuxtLink></li>
            </ul>
          </div>

          <!-- Column 4: Newsletter -->
          <div>
            <h3 class="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-4">Newsletter</h3>
            <p class="text-sm text-gray-500 mb-4">Subscribe to get the latest updates and offers.</p>
            <form class="flex" @submit.prevent>
              <label for="newsletter-email" class="sr-only">Email address</label>
              <input id="newsletter-email" type="email" required class="appearance-none min-w-0 w-full bg-white border border-gray-300 rounded-l-md py-2 px-4 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm" placeholder="Enter your email">
              <div class="rounded-md sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                <button type="submit" class="bg-[#002888] text-white px-5 py-2.5 rounded-md text-sm font-bold hover:bg-blue-900 transition-colors shadow-sm w-full flex items-center justify-center -ml-3 rounded-l-none">
                  Subscribe
                </button>
              </div>
            </form>
          </div>

        </div>
        <div class="mt-8 pt-8 border-t border-gray-200 flex items-center justify-between">
          <p class="text-sm text-gray-400">
            &copy; 2026 NovelSolar. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
const isMobileMenuOpen = ref(false)
const toggleMobileMenu = () => { isMobileMenuOpen.value = !isMobileMenuOpen.value }
</script>
