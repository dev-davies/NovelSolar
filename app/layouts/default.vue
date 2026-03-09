<template>
  <div class="min-h-screen flex flex-col bg-background font-sans text-gray-800">
    <!-- Navbar -->
    <header class="bg-white shadow-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <!-- Logo -->
          <div class="flex-shrink-0 flex items-center -ml-2">
            <NuxtLink to="/" class="flex items-center">
              <img src="/images/logo.png" alt="NovelSolar" class="h-10 w-auto" />
            </NuxtLink>
          </div>
          
          <!-- Navigation Links -->
          <nav class="hidden md:flex space-x-8">
            <NuxtLink to="/categories" class="text-gray-600 hover:text-primary transition-colors">Product Categories</NuxtLink>
            <NuxtLink to="/partners" class="text-gray-600 hover:text-primary transition-colors">Partners</NuxtLink>
          </nav>

          <!-- Search Bar -->
          <div class="flex-1 flex px-8 justify-center hidden lg:flex">
            <div class="w-full max-w-lg">
              <label for="search" class="sr-only">Search</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                  </svg>
                </div>
                <input id="search" name="search" class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition duration-150 ease-in-out" placeholder="Search for products..." type="search">
              </div>
            </div>
          </div>

          <!-- Right side actions -->
          <div class="flex items-center space-x-6">
            <!-- Cart Icon -->
            <button class="text-gray-500 hover:text-primary transition-colors relative">
              <span class="sr-only">Cart</span>
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <!-- Badge could go right here -->
            </button>
            <B24Button color="primary" class="hidden md:inline-flex shadow-sm hover:shadow transition-shadow">
              Request a Quote
            </B24Button>
          </div>
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
                <B24Button color="primary" type="submit" class="w-full flex items-center justify-center -ml-3 rounded-l-none">
                  Subscribe
                </B24Button>
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
</script>
