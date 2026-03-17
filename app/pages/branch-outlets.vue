<template>
  <div class="min-h-screen bg-gray-50 pb-20">
    <ClientOnly>
      <div class="relative h-[40vh] w-full bg-gray-200 overflow-hidden shadow-inner z-[10]">
        <div id="branch-map" class="h-full w-full" />
        
        <!-- Overlay Badge -->
        <div class="absolute bottom-6 left-6 z-[40] bg-white border border-gray-200 p-4 rounded-2xl shadow-xl flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div class="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-[#002888]">
            <span class="material-symbols-outlined">explore</span>
          </div>
          <div>
            <h1 class="text-xl font-black text-gray-900 uppercase tracking-tighter leading-none mb-1">Interactive Map</h1>
            <p class="text-xs font-bold text-gray-500 uppercase tracking-widest">{{ branches.length }} Outlets Nationwide</p>
          </div>
        </div>
      </div>
      <template #fallback>
        <div class="h-[40vh] w-full bg-slate-100 animate-pulse flex items-center justify-center text-slate-400 font-bold">
          Loading Interactive Map...
        </div>
      </template>
    </ClientOnly>

    <!-- Content Grid (Ported Stitch UI) -->
    <div class="max-w-[1400px] mx-auto py-12 px-4 md:px-10">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        <!-- Left: Locations List -->
        <div class="lg:col-span-12 xl:col-span-7 space-y-6">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 class="text-3xl font-black text-gray-900 tracking-tight">Explore Our Locations</h2>
              <p class="text-gray-500 font-medium">Find a NovelSolar expert in your city</p>
            </div>
            
            <div class="relative w-full md:w-80">
              <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
              <input 
                v-model="searchQuery"
                type="text" 
                placeholder="Search by city or branch name..."
                class="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-white focus:ring-4 focus:ring-[#002888]/10 focus:border-[#002888] outline-none transition-all text-sm font-medium shadow-sm"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[1000px] overflow-y-auto pr-2 custom-scrollbar pb-4">
            <button 
              v-for="branch in filteredBranches" 
              :key="branch.name"
              @click="selectBranch(branch)"
              class="group p-5 border-2 rounded-2xl transition-all duration-300 flex items-center gap-4 text-left"
              :class="selectedBranch.name === branch.name 
                ? 'border-[#002888] bg-[#002888]/5 shadow-xl shadow-[#002888]/10 ring-1 ring-[#002888]' 
                : 'border-gray-100 bg-white hover:bg-white hover:border-gray-200 hover:shadow-md'"
            >
              <div 
                class="w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300 shadow-sm"
                :class="selectedBranch.name === branch.name ? 'bg-[#002888] text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-[#002888]/10 group-hover:text-[#002888]'"
              >
                <span class="material-symbols-outlined">location_on</span>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="font-bold text-gray-900 truncate" :class="selectedBranch.name === branch.name ? 'text-[#002888]' : ''">
                  {{ branch.name }}
                </h3>
                <p class="text-xs text-gray-500 font-medium uppercase tracking-wider">{{ branch.city }}</p>
              </div>
              <div v-if="selectedBranch.name === branch.name" class="text-[#002888]">
                <span class="material-symbols-outlined">verified</span>
              </div>
            </button>
          </div>
        </div>

        <!-- Right: Branch Details Sidebar -->
        <div class="lg:col-span-12 xl:col-span-5 relative">
          <div class="sticky top-24 space-y-6">
            <div v-if="selectedBranch" class="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 flex flex-col">
              
              <!-- Card Header / Mini-hero -->
              <div class="h-48 relative bg-gray-900 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?auto=format&fit=crop&q=80&w=800" alt="Solar Branch" class="w-full h-full object-cover opacity-60 mix-blend-overlay scale-110 group-hover:scale-100 transition-transform duration-1000" />
                <div class="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                <div class="absolute bottom-6 left-8">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    <span class="text-white text-[10px] font-black uppercase tracking-widest opacity-80">Outlet Live</span>
                  </div>
                  <h4 class="text-white text-2xl font-black uppercase tracking-tighter leading-tight">{{ selectedBranch.name }}</h4>
                </div>
              </div>

              <!-- Card Content -->
              <div class="p-8 space-y-8">
                <div class="grid gap-6">
                  <!-- Address -->
                  <div class="flex gap-5">
                    <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#002888] shrink-0">
                      <span class="material-symbols-outlined">home_pin</span>
                    </div>
                    <div>
                      <h5 class="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1 text-xs">Address</h5>
                      <p class="text-gray-900 font-bold text-sm leading-relaxed">{{ selectedBranch.address }}</p>
                    </div>
                  </div>

                  <!-- Telephone -->
                  <div class="flex gap-5 border-t border-gray-50 pt-6">
                    <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#002888] shrink-0">
                      <span class="material-symbols-outlined">call</span>
                    </div>
                    <div>
                      <h5 class="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1 text-xs">Telephone</h5>
                      <p class="text-gray-900 font-bold text-sm">{{ selectedBranch.phone }}</p>
                    </div>
                  </div>

                  <!-- Email -->
                  <div class="flex gap-5 border-t border-gray-50 pt-6">
                    <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#002888] shrink-0">
                      <span class="material-symbols-outlined">mail</span>
                    </div>
                    <div>
                      <h5 class="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1 text-xs">Email</h5>
                      <p class="text-gray-900 font-bold text-sm">{{ selectedBranch.email1 }} <span v-if="selectedBranch.email2">and {{ selectedBranch.email2 }}</span></p>
                    </div>
                  </div>

                  <!-- Business Hours -->
                  <div class="flex gap-5 border-t border-gray-50 pt-6">
                    <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#002888] shrink-0">
                      <span class="material-symbols-outlined">schedule</span>
                    </div>
                    <div>
                      <h5 class="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1 text-xs">Business Hours</h5>
                      <div class="text-sm">
                        <p class="text-gray-900 font-bold">Mon - Fri: <span class="font-medium text-gray-600 ml-2">{{ selectedBranch.hoursWeekdays || '08:00 AM - 05:00 PM' }}</span></p>
                        <p class="text-gray-900 font-bold">Saturday: <span class="font-medium text-gray-600 ml-2">{{ selectedBranch.hoursSaturday || '09:00 AM - 02:00 PM' }}</span></p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Navigation Action -->
                <div class="pt-6 border-t border-gray-50 flex gap-4">
                  <a 
                    :href="'https://www.google.com/maps/dir/?api=1&destination=' + selectedBranch.coords[0] + ',' + selectedBranch.coords[1]" 
                    target="_blank"
                    class="flex-1 bg-[#002888] text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-900 transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20 active:scale-[0.98]"
                  >
                    <span class="material-symbols-outlined text-lg">directions</span>
                    Start Navigation
                  </a>
                  <button class="w-16 h-16 border-2 border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors">
                    <span class="material-symbols-outlined">share</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
const branches = [
  {
    name: 'Head Office (Ibadan)',
    address: 'Novel Solar Akinjide Plaza, No. 76, Adekunle Fajuyi Road, Ekotedo, Ibadan, Oyo State, Nigeria.',
    phone: '08022119908',
    email1: 'sales@novelsolar.com',
    email2: 'info@novelsolar.com',
    hoursWeekdays: '08:00 AM - 05:30 PM',
    hoursSaturday: '10:00 AM - 05:30 PM',
    coordinates: [7.3964, 3.8724],
    coords: [7.3964, 3.8724],
    city: 'Ibadan',
    state: 'Oyo'
  },
  { name: 'Ilorin Branch (Regional Hub)', city: 'Ilorin', state: 'Kwara', address: 'Plot 14, Unity Road, Beside Diamond Bank Building, Ilorin', contactPerson: 'Engr. Taiwo Adeyemi', phone: '+234 805 123 4567', coords: [8.4799, 4.5418], email1: 'ilorin.sales@novelsolar.com' },
  { name: 'Ilesha Branch', city: 'Ilesha', state: 'Osun', address: 'Specific street address coming soon...', contactPerson: 'Branch Manager', phone: '+234 000 000 0000', coords: [7.6295, 4.7397] },
  { name: 'Oshogbo Branch', city: 'Oshogbo', state: 'Osun', address: 'Specific street address coming soon...', contactPerson: 'Branch Manager', phone: '+234 000 000 0000', coords: [7.7827, 4.5418] },
  { name: 'Ile-ife Branch', city: 'Ile-Ife', state: 'Osun', address: 'Specific street address coming soon...', contactPerson: 'Branch Manager', phone: '+234 000 000 0000', coords: [7.4833, 4.5667] },
  { name: 'Ondo Branch', city: 'Ondo', state: 'Ondo', address: 'Specific street address coming soon...', contactPerson: 'Branch Manager', phone: '+234 000 000 0000', coords: [7.1000, 4.8333] },
  { name: 'Ibadan Tipper Garage', city: 'Ibadan', state: 'Oyo', address: 'Tipper Garage, Liberty Road, Ibadan', contactPerson: 'Branch Manager', phone: '+234 000 000 0000', coords: [7.3775, 3.8964] },
  { name: 'Abuja Kubwa', city: 'Kubwa', state: 'FCT', address: 'Specific street address coming soon...', contactPerson: 'Branch Manager', phone: '+234 000 000 0000', coords: [9.1578, 7.3328] },
  { name: 'Minna Branch', city: 'Minna', state: 'Niger', address: 'Specific street address coming soon...', contactPerson: 'Branch Manager', phone: '+234 000 000 0000', coords: [9.5833, 6.5500] },
  { name: 'Obantoko Branch', city: 'Obantoko', state: 'Ogun', address: 'Specific street address coming soon...', contactPerson: 'Branch Manager', phone: '+234 000 000 0000', coords: [7.1475, 3.3614] },
  { name: 'Benni 2 Branch', city: 'Benin City', state: 'Edo', address: 'Specific street address coming soon...', contactPerson: 'Branch Manager', phone: '+234 000 000 0000', coords: [6.3350, 5.6037] },
  { name: 'Sagamu Branch', city: 'Sagamu', state: 'Ogun', address: 'Specific street address coming soon...', contactPerson: 'Branch Manager', phone: '+234 000 000 0000', coords: [6.8322, 3.6532] },
  { name: 'Ado 2 Branch', city: 'Ado-Ekiti', state: 'Ekiti', address: 'Specific street address coming soon...', contactPerson: 'Branch Manager', phone: '+234 000 000 0000', coords: [7.6233, 5.2214] },
  { name: 'Lekki Office', city: 'Lekki', state: 'Lagos', address: 'Lekki, Lagos', contactPerson: 'Branch Manager', phone: '+234 000 000 0000', coords: [6.4589, 3.6015] },
  { name: 'Sangotedo Branch', city: 'Sangotedo', state: 'Lagos', address: 'Sangotedo, Lagos', contactPerson: 'Branch Manager', phone: '+234 000 000 0000', coords: [6.4714, 3.6414] },
  { name: 'Ikeja Branch', city: 'Ikeja', state: 'Lagos', address: 'Allen Avenue, Ikeja', contactPerson: 'Branch Manager', phone: '+234 000 000 0000', coords: [6.5967, 3.3541] },
  { name: 'Ikota Branch', city: 'Ikota', state: 'Lagos', address: 'Ikota Shopping Complex, Lagos', contactPerson: 'Branch Manager', phone: '+234 000 000 0000', coords: [6.4633, 3.5417] },
  { name: 'Oke-ilewo Branch', city: 'Abeokuta', state: 'Ogun', address: 'Oke-ilewo, Abeokuta', contactPerson: 'Branch Manager', phone: '+234 000 000 0000', coords: [7.1500, 3.3400] },
  { name: 'Ogbomosho Branch', city: 'Ogbomosho', state: 'Oyo', address: 'Specific street address coming soon...', contactPerson: 'Branch Manager', phone: '+234 000 000 0000', coords: [8.1333, 4.2500] },
  { name: 'Ado 1 Branch', city: 'Ado-Ekiti', state: 'Ekiti', address: 'Specific street address coming soon...', contactPerson: 'Branch Manager', phone: '+234 000 000 0000', coords: [7.6200, 5.2100] },
  { name: 'Ore Branch', city: 'Ore', state: 'Ondo', address: 'Specific street address coming soon...', contactPerson: 'Branch Manager', phone: '+234 000 000 0000', coords: [6.7441, 4.8778] },
  { name: 'Iwo-road Branch', city: 'Ibadan', state: 'Oyo', address: 'Iwo-road, Ibadan', contactPerson: 'Branch Manager', phone: '+234 000 000 0000', coords: [7.4000, 3.9300] },
  { name: 'Mararaba Branch', city: 'Mararaba', state: 'Nasarawa', address: 'Specific street address coming soon...', contactPerson: 'Branch Manager', phone: '+234 000 000 0000', coords: [9.0200, 7.5800] },
  { name: 'Kano Branch', city: 'Kano', state: 'Kano', address: 'Kano City Center', contactPerson: 'Branch Manager', phone: '+234 000 000 0000', coords: [12.0022, 8.5920] },
  { name: 'Isheri Branch', city: 'Isheri', state: 'Lagos', address: 'Isheri, Lagos/Ogun', contactPerson: 'Branch Manager', phone: '+234 000 000 0000', coords: [6.6333, 3.3833] },
  { name: 'Oyo Branch', city: 'Oyo', state: 'Oyo', address: 'Oyo Town', contactPerson: 'Branch Manager', phone: '+234 000 000 0000', coords: [7.8500, 3.9333] },
  { name: 'Bodija Branch', city: 'Ibadan', state: 'Oyo', address: 'Bodija, Ibadan', contactPerson: 'Branch Manager', phone: '+234 000 000 0000', coords: [7.4333, 3.9167] },
  { name: 'Akure Branch', city: 'Akure', state: 'Ondo', address: 'Akure City Center', contactPerson: 'Branch Manager', phone: '+234 000 000 0000', coords: [7.2500, 5.2000] },
  { name: 'Benni 1 Branch', city: 'Benin City', state: 'Edo', address: 'Specific street address coming soon...', contactPerson: 'Branch Manager', phone: '+234 000 000 0000', coords: [6.3300, 5.6000] }
]

const searchQuery = ref('')
const selectedBranch = ref(branches[0])
const currentMapFocus = ref(branches[0].coordinates)

const filteredBranches = computed(() => {
  if (!searchQuery.value) return branches
  const q = searchQuery.value.toLowerCase()
  return branches.filter(b => 
    b.name.toLowerCase().includes(q) || 
    b.city.toLowerCase().includes(q) || 
    b.state.toLowerCase().includes(q)
  )
})

let map = null
let marker = null

const selectBranch = (branch) => {
  selectedBranch.value = branch
  currentMapFocus.value = branch.coords
  if (map) {
    map.flyTo(branch.coords, 14)
    updateMarker(branch)
  }
}

const updateMarker = (branch) => {
  if (typeof L === 'undefined' || !map) return
  
  if (marker) {
    marker.setLatLng(branch.coords)
  } else {
    marker = L.marker(branch.coords).addTo(map)
  }
  
  marker.bindPopup(`
    <div style="font-family: inherit; padding: 12px; min-width: 180px;">
      <h4 style="margin: 0 0 4px; color: #002888; font-weight: 900; font-size: 14px; text-transform: uppercase;">${branch.name}</h4>
      <p style="margin: 0 0 12px; font-size: 11px; color: #64748b; font-weight: 600;">${branch.city}, ${branch.state}</p>
      <a href="https://www.google.com/maps/dir/?api=1&destination=${branch.coords[0]},${branch.coords[1]}" 
         target="_blank" 
         style="display: block; background: #002888; color: white; padding: 10px; border-radius: 12px; text-decoration: none; font-size: 10px; font-weight: 900; text-align: center; letter-spacing: 0.1em; text-transform: uppercase;">
         Navigate via Google Maps
      </a>
    </div>
  `, { closeButton: false }).openPopup()
}

onMounted(() => {
  // Load Leaflet dynamically
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
  document.head.appendChild(link)

  const script = document.createElement('script')
  script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
  script.onload = () => {
    initMap()
  }
  document.head.appendChild(script)
})

const initMap = () => {
  if (typeof L === 'undefined') return

  map = L.map('branch-map', {
    zoomControl: false,
    scrollWheelZoom: false
  }).setView(selectedBranch.value.coords, 12)

  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map)

  L.control.zoom({
    position: 'bottomright'
  }).addTo(map)

  updateMarker(selectedBranch.value)
}

useHead({
  title: 'Our Branches | NovelSolar Network',
  meta: [
    { name: 'description', content: 'Explore 28 NovelSolar branch outlets across Nigeria. Get expert solar consultations and premium equipment in your city.' }
  ]
})
</script>

<style>
.leaflet-container {
  font-family: inherit;
  filter: grayscale(0.2);
}
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
