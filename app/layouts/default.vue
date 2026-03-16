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
          <!-- Desktop Mega Menu -->
          <div class="relative group py-6 cursor-pointer">
            <div class="flex items-center gap-1.5 text-sm font-semibold text-gray-700 group-hover:text-[#002888] transition-colors">
              Product
              <span class="inline-block text-gray-500 font-light ml-1 text-lg leading-none transition-transform duration-300 group-hover:rotate-45">+</span>
            </div>
            
            <!-- Mega Dropdown -->
            <div class="absolute left-0 top-full mt-2 w-[600px] bg-white border border-gray-200 shadow-xl rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 p-6">
              <div class="grid grid-cols-3 gap-6">
                <div v-for="category in productMenu" :key="category.title">
                  <h4 class="font-bold text-[#002888] mb-3 border-b pb-1 text-sm uppercase tracking-wider">{{ category.title }}</h4>
                  <ul v-if="category.items.length > 0" class="space-y-1">
                    <li v-for="item in category.items" :key="item">
                      <NuxtLink :to="'/category/' + item.toLowerCase().replace(' ', '-')" class="text-gray-600 hover:text-[#002888] text-sm block py-1 transition-colors">
                        {{ item }}
                      </NuxtLink>
                    </li>
                  </ul>
                  <div v-else class="text-xs text-gray-400 italic">Coming soon</div>
                </div>
              </div>
            </div>
          </div>

          <div class="w-4"></div>

          <!-- Desktop Services Dropdown -->
          <div class="relative group py-6 cursor-pointer">
            <div class="flex items-center gap-1.5 text-sm font-semibold text-gray-700 group-hover:text-[#002888] transition-colors">
              Services
              <span class="inline-block text-gray-500 font-light ml-1 text-lg leading-none transition-transform duration-300 group-hover:rotate-45">+</span>
            </div>

            <div class="absolute left-0 top-full mt-2 w-80 bg-white border border-gray-200 shadow-xl rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 py-2">
              <NuxtLink 
                v-for="service in servicesMenu" 
                :key="service.title"
                :to="service.link" 
                class="block px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#002888] transition-colors border-b border-gray-100 last:border-0"
              >
                {{ service.title }}
              </NuxtLink>
            </div>
          </div>

          <div class="w-4"></div>

          <!-- Desktop Partners Dropdown -->
          <div class="relative group py-6 cursor-pointer">
            <div class="flex items-center gap-1.5 text-sm font-semibold text-gray-700 group-hover:text-[#002888] transition-colors">
              Partners
              <span class="inline-block text-gray-500 font-light ml-1 text-lg leading-none transition-transform duration-300 group-hover:rotate-45">+</span>
            </div>

            <div class="absolute left-0 top-full mt-2 w-56 bg-white border border-gray-200 shadow-xl rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 py-2">
              <NuxtLink 
                v-for="partner in partnersMenu" 
                :key="partner.title"
                :to="partner.link" 
                class="block px-6 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#002888] transition-colors"
                @click="isMobileMenuOpen = false"
              >
                {{ partner.title }}
              </NuxtLink>
              <div class="border-t border-gray-100 mt-2 pt-2">
                <NuxtLink to="/partners/become-a-partner" class="block px-6 py-2.5 text-sm font-semibold text-[#002888] hover:bg-blue-50 transition-colors">
                  Become a Partner &rarr;
                </NuxtLink>
              </div>
            </div>
          </div>

          <div class="w-4"></div>

          <!-- About Us Dropdown -->
          <div class="relative group py-6 cursor-pointer">
            <div class="flex items-center gap-1.5 text-sm font-semibold text-gray-700 group-hover:text-[#002888] transition-colors">
              About Us
              <span class="inline-block text-gray-500 font-light ml-1 text-lg leading-none transition-transform duration-300 group-hover:rotate-45">+</span>
            </div>

            <div class="absolute top-full left-0 w-48 bg-white border border-gray-100 shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
              <ul class="py-1">
                <li><NuxtLink to="/about" class="block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#002888] transition-colors" @click="isMobileMenuOpen = false">About us</NuxtLink></li>
                <li><NuxtLink to="/branch-outlets" class="block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#002888] transition-colors">Branch outlets</NuxtLink></li>
                <li><NuxtLink to="/gallery" class="block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#002888] transition-colors">Gallery</NuxtLink></li>
                <li><NuxtLink to="/news" class="block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#002888] transition-colors">News</NuxtLink></li>
              </ul>
            </div>
          </div>

          <div class="w-4"></div>

          <!-- Quote Request Dropdown -->
          <div class="relative group py-6 cursor-pointer text-sm font-semibold text-gray-700 hover:text-[#002888] transition-colors flex items-center gap-1">
            Quote Request
            <span class="inline-block text-gray-500 font-light ml-1 text-lg leading-none transition-transform duration-300 group-hover:rotate-45">+</span>

            <div class="absolute top-full left-0 w-56 bg-white border border-gray-100 shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
              <ul class="py-1">
                <li><NuxtLink to="/quote" class="block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#002888] transition-colors font-normal">Request a quote</NuxtLink></li>
                <li><NuxtLink to="/calculator" class="block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#002888] transition-colors font-normal">Load calculator</NuxtLink></li>
              </ul>
            </div>
          </div>

          <div class="w-4"></div>

          <!-- Desktop Support Dropdown -->
          <div class="relative group py-6 cursor-pointer text-sm font-semibold text-gray-700 hover:text-[#002888] transition-colors flex items-center gap-1">
            Support
            <span class="inline-block text-gray-500 font-light ml-1 text-lg leading-none transition-transform duration-300 group-hover:rotate-45">+</span>

            <div class="absolute left-0 top-full mt-2 w-48 bg-white border border-gray-200 shadow-xl rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 py-2">
              <NuxtLink 
                v-for="item in supportMenu" 
                :key="item.title"
                :to="item.link" 
                class="block px-6 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#002888] transition-colors"
                @click="isMobileMenuOpen = false"
              >
                {{ item.title }}
              </NuxtLink>
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
        <NuxtLink to="/checkout" class="text-gray-600 hover:text-black transition-colors relative group/cart">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span v-if="cartCount > 0" class="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
            {{ cartCount }}
          </span>
        </NuxtLink>

        <!-- Button -->
        <NuxtLink to="/quote" class="bg-[#002888] text-white px-5 py-2.5 rounded-md text-sm font-bold hover:bg-blue-900 transition-colors shadow-sm hidden sm:block">
          Request a Quote
        </NuxtLink>

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
          <template v-for="link in ['Product', 'Services', 'Partners', 'About Us', 'Quote Request', 'Support']" :key="link">
            <!-- Special Handling for Product in Mobile Menu -->
            <div v-if="link === 'Product'" class="px-6 py-4 border-b border-gray-50">
              <div class="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-4">Our Products</div>
              <div v-for="category in productMenu" :key="category.title" class="mb-6 last:mb-2">
                <div class="text-gray-900 font-bold text-base mb-2">{{ category.title }}</div>
                <div class="pl-4 border-l-2 border-primary/10 ml-1 space-y-1">
                  <NuxtLink 
                    v-for="item in category.items" 
                    :key="item"
                    :to="'/category/' + item.toLowerCase().replace(' ', '-')"
                    class="block text-gray-600 py-2.5 text-sm hover:text-primary transition-colors"
                    @click="isMobileMenuOpen = false"
                  >
                    {{ item }}
                  </NuxtLink>
                  <div v-if="category.items.length === 0" class="text-xs text-gray-400 italic py-2">More coming soon</div>
                </div>
              </div>
            </div>
            <!-- Special Handling for Services in Mobile Menu -->
            <div v-else-if="link === 'Services'" class="px-6 py-4 border-b border-gray-50">
              <h4 class="text-gray-900 font-bold text-base mb-2 flex items-center justify-between">
                Services
                <span class="text-gray-500 font-light text-lg leading-none">+</span>
              </h4>
              <div class="pl-4 border-l-2 border-primary/10 ml-1 space-y-1">
                <NuxtLink 
                  v-for="service in servicesMenu" 
                  :key="service.title"
                  :to="service.link"
                  class="block text-gray-600 py-3 text-sm hover:text-primary transition-colors border-b border-gray-50 last:border-0"
                  @click="isMobileMenuOpen = false"
                >
                  {{ service.title }}
                </NuxtLink>
              </div>
            </div>
            <!-- Special Handling for Partners in Mobile Menu -->
            <div v-else-if="link === 'Partners'" class="px-6 py-4 border-b border-gray-50">
              <h4 class="text-gray-900 font-bold text-base mb-2 flex items-center justify-between">
                Partners
                <span class="text-gray-500 font-light text-lg leading-none">+</span>
              </h4>
              <div class="pl-4 border-l-2 border-primary/10 ml-1 space-y-1">
                <NuxtLink 
                  v-for="partner in partnersMenu" 
                  :key="partner.title"
                  :to="partner.link"
                  class="block text-gray-600 py-2.5 text-sm hover:text-primary transition-colors"
                  @click="isMobileMenuOpen = false"
                >
                  {{ partner.title }}
                </NuxtLink>
                <NuxtLink 
                  to="/partners/become-a-partner"
                  class="block text-primary py-3 text-sm font-bold hover:text-blue-800 transition-colors border-t border-gray-50 mt-2"
                  @click="isMobileMenuOpen = false"
                >
                  Become a Partner &rarr;
                </NuxtLink>
              </div>
            </div>
            <!-- Special Handling for Support in Mobile Menu -->
            <div v-else-if="link === 'Support'" class="px-6 py-4 border-b border-gray-50">
              <h4 class="text-gray-900 font-bold text-base mb-2 flex items-center justify-between">
                Support
                <span class="text-gray-500 font-light text-lg leading-none">+</span>
              </h4>
              <div class="pl-4 border-l-2 border-primary/10 ml-1 space-y-1">
                <NuxtLink 
                  v-for="item in supportMenu" 
                  :key="item.title"
                  :to="item.link"
                  class="block text-gray-600 py-3 text-sm hover:text-primary transition-colors border-b border-gray-50 last:border-0"
                  @click="isMobileMenuOpen = false"
                >
                  {{ item.title }}
                </NuxtLink>
              </div>
            </div>
            <!-- Standard Links -->
            <NuxtLink 
              v-else
              :to="link === 'About Us' ? '/about' : '#'"
              class="block w-full text-left px-6 py-4 border-b border-gray-50 text-gray-800 font-semibold hover:bg-gray-50 hover:text-[#002888] transition-colors"
              @click="isMobileMenuOpen = false"
            >
              {{ link }}
            </NuxtLink>
          </template>
        </nav>

        <!-- CTA -->
        <div class="p-6 bg-gray-50/50">
          <NuxtLink to="/quote" class="bg-[#002888] text-white w-full py-4 flex items-center justify-center rounded-lg text-sm font-bold hover:bg-blue-900 transition-colors shadow-md" @click="isMobileMenuOpen = false">
            Request a Quote
          </NuxtLink>
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

const productMenu = [
  { title: 'Solar Panels', items: ['Regular', 'Half Cut'] },
  { title: 'Inverters', items: ['Hybrid', 'Regular', 'Solar Generator'] },
  { title: 'Batteries', items: ['Lithium', 'Tubular', 'Dry Cell'] },
  { title: 'Charge Controllers', items: ['MPPT', 'PWM'] },
  { title: 'Accessories', items: [] }
]

const servicesMenu = [
  { title: 'Power & Load Audit Service', link: '/services/audit' },
  { title: 'Inverter, Solar Panel & Battery Installation', link: '/services/installation' },
  { title: 'Inverter Repair (Solar Panel, Battery etc Repairs)', link: '/services/repair' },
  { title: 'Solar Panel, Tubular Battery & Inverter Maintenance', link: '/services/maintenance' }
]

const partnersMenu = [
  { title: 'Itel', link: '/partners/itel' },
  { title: 'Haisic', link: '/partners/haisic' },
  { title: 'Yinergy', link: '/partners/yinergy' },
  { title: 'Hithium', link: '/partners/hithium' },
  { title: 'Livoltek', link: '/partners/livoltek' }
]

const supportMenu = [
  { title: 'FAQ', link: '/faq' },
  { title: 'Contact Us', link: '/contact' }
]

const cart = useState('cart', () => [])
const cartCount = computed(() => cart.value.length)
</script>
