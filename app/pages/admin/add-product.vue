<script setup>
import { onUnmounted } from 'vue'
definePageMeta({ middleware: 'admin' })

const isUploading = ref(false)
const uploadProgress = ref({})
const uploadResults = ref({})
const showResults = ref(false)
const checkingDuplicates = ref(false)
const existingProducts = ref({})

// Drag & Drop state
const dragOverMain = ref({})
const dragOverGallery = ref({})

// Image preview URL tracking (to prevent memory leaks)
const previewUrls = new Map()

const getPreviewUrl = (file) => {
  if (!file) return null
  if (previewUrls.has(file)) return previewUrls.get(file)
  const url = URL.createObjectURL(file)
  previewUrls.set(file, url)
  return url
}

const revokeUrls = (files) => {
  const fileArray = Array.isArray(files) ? files : [files]
  fileArray.forEach(file => {
    if (file && previewUrls.has(file)) {
      URL.revokeObjectURL(previewUrls.get(file))
      previewUrls.delete(file)
    }
  })
}

onUnmounted(() => {
  previewUrls.forEach(url => URL.revokeObjectURL(url))
  previewUrls.clear()
})

// Batch products
const products = ref([{
  id: Date.now(),
  name: '',
  price: null,
  type: 'piece',
  brand: 'general',
  description: '',
  specs: [{ label: '', value: '' }],
  image: null,
  gallery: []
}])

const getDuplicatesInBatch = () => {
  const nameMap = {}
  const duplicates = {}
  
  products.value.forEach(product => {
    if (!product.name) return
    const name = product.name.toLowerCase().trim()
    
    if (nameMap[name]) {
      duplicates[nameMap[name]] = true
      duplicates[product.id] = true
    } else {
      nameMap[name] = product.id
    }
  })
  
  return duplicates
}

const checkExistingProducts = async () => {
  checkingDuplicates.value = true
  existingProducts.value = {}
  
  try {
    const productNames = products.value
      .filter(p => p.name)
      .map(p => p.name)
    
    if (productNames.length === 0) return

    const response = await $fetch('/api/admin/check-duplicates', {
      method: 'POST',
      body: { productNames }
    })

    if (response.duplicates) {
      response.duplicates.forEach(dupName => {
        const product = products.value.find(p => p.name?.toLowerCase() === dupName.toLowerCase())
        if (product) existingProducts.value[product.id] = true
      })
    }
  } catch (error) {
    console.error('Error checking duplicates:', error)
  } finally {
    checkingDuplicates.value = false
  }
}

const addProduct = () => {
  products.value.push({
    id: Date.now(),
    name: '',
    price: null,
    type: 'piece',
    brand: 'general',
    description: '',
    specs: [{ label: '', value: '' }],
    image: null,
    gallery: []
  })
}

const cloneProduct = (product) => {
  products.value.push({
    ...JSON.parse(JSON.stringify(product)),
    id: Date.now(),
    image: product.image, // Deep copy doesn't work for Files
    gallery: [...product.gallery]
  })
}

const removeProduct = (productId) => {
  if (products.value.length > 1) {
    const product = products.value.find(p => p.id === productId)
    if (product) {
      if (product.image) revokeUrls(product.image)
      if (product.gallery.length) revokeUrls(product.gallery)
    }
    products.value = products.value.filter(p => p.id !== productId)
  }
}

const handleFileDrop = (productId, event, type) => {
  const files = event.dataTransfer?.files
  if (!files || files.length === 0) return
  
  if (type === 'main') {
    handleFileChange(productId, { target: { files: [files[0]] } })
  } else {
    handleGalleryUpload(productId, { target: { files } })
  }
  
  dragOverMain.value[productId] = false
  dragOverGallery.value[productId] = false
}

const handleFileChange = (productId, event) => {
  const product = products.value.find(p => p.id === productId)
  if (product && event.target.files?.[0]) {
    if (product.image) revokeUrls(product.image)
    product.image = event.target.files[0]
  }
}

const handleGalleryUpload = (productId, event) => {
  const product = products.value.find(p => p.id === productId)
  if (product && event.target.files) {
    const newFiles = Array.from(event.target.files)
    product.gallery = [...product.gallery, ...newFiles]
  }
}

const clearMainImage = (productId) => {
  const product = products.value.find(p => p.id === productId)
  if (product) {
    if (product.image) revokeUrls(product.image)
    product.image = null
  }
}

const removeGalleryImage = (productId, index) => {
  const product = products.value.find(p => p.id === productId)
  if (product) {
    const file = product.gallery[index]
    revokeUrls(file)
    product.gallery.splice(index, 1)
  }
}

const clearGallery = (productId) => {
  const product = products.value.find(p => p.id === productId)
  if (product) {
    revokeUrls(product.gallery)
    product.gallery = []
  }
}

const addSpecRow = (productId) => {
  const product = products.value.find(p => p.id === productId)
  if (product) product.specs.push({ label: '', value: '' })
}

const removeSpecRow = (productId, index) => {
  const product = products.value.find(p => p.id === productId)
  if (product && product.specs.length > 1) {
    product.specs.splice(index, 1)
  }
}

const validateBatch = () => {
  const errors = []
  const batchDuplicates = getDuplicatesInBatch()
  
  products.value.forEach((product, index) => {
    if (!product.name) errors.push(`Product ${index + 1}: Name is required`)
    if (!product.price) errors.push(`Product ${index + 1}: Price is required`)
    if (!product.image) errors.push(`Product ${index + 1}: Main image is required`)
    if (batchDuplicates[product.id]) errors.push(`Product ${index + 1}: Duplicate name in batch`)
  })
  
  return errors
}

const submitBatch = async () => {
  const errors = validateBatch()
  if (errors.length > 0) {
    alert(`Validation errors:\n${errors.join('\n')}`)
    return
  }

  const hasExisting = Object.keys(existingProducts.value).length > 0
  if (hasExisting) {
    const proceed = confirm(`⚠️ One or more products already exist in the database. Continue?`)
    if (!proceed) return
  }

  isUploading.value = true
  uploadProgress.value = {}
  uploadResults.value = {}
  showResults.value = false

  let successCount = 0
  let failureCount = 0

  for (const product of products.value) {
    const isExisting = existingProducts.value[product.id]
    uploadProgress.value[product.id] = 'uploading'

    try {
      const formData = new FormData()
      formData.append('productName', product.name)
      formData.append('productPrice', product.price)
      formData.append('productType', product.type)
      formData.append('productBrand', product.brand)
      formData.append('productDescription', product.description)
      formData.append('productSpecs', JSON.stringify(product.specs))
      formData.append('productImage', product.image)
      formData.append('skipDuplicateCheck', isExisting ? 'false' : 'true')
      
      product.gallery.forEach(file => formData.append('galleryImages', file))

      await $fetch('/api/admin/upload-product', { method: 'POST', body: formData })

      uploadProgress.value[product.id] = 'success'
      uploadResults.value[product.id] = {
        status: 'success',
        message: `✓ "${product.name}" uploaded successfully`,
        isExisting
      }
      successCount++
    } catch (error) {
      uploadProgress.value[product.id] = 'error'
      uploadResults.value[product.id] = {
        status: 'error',
        message: `✗ "${product.name}" failed: ${error.data?.statusMessage || error.message}`
      }
      failureCount++
    }
  }

  isUploading.value = false
  showResults.value = true

  if (failureCount === 0) {
    alert(`Success! ${successCount} products uploaded. Clearing form...`)
    products.value.forEach(p => {
      revokeUrls(p.image)
      revokeUrls(p.gallery)
    })
    products.value = [{
      id: Date.now(),
      name: '',
      price: null,
      type: 'piece',
      brand: 'general',
      description: '',
      specs: [{ label: '', value: '' }],
      image: null,
      gallery: []
    }]
    existingProducts.value = {}
  } else {
    alert(`Batch Complete: ${successCount} Success, ${failureCount} Failed`)
  }
}

useHead({
  title: 'Add Products | Novel Solar Admin',
  meta: [{ name: 'description', content: 'Batch upload products to Novel Solar' }]
})

const handleLogout = async () => {
  try {
    await $fetch('/api/admin/auth/logout', { method: 'POST' })
    navigateTo('/admin/login')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <div class="mb-10 text-center relative">
        <h1 class="text-4xl font-black text-slate-900 mb-2 tracking-tight">Batch Upload Products</h1>
        <p class="text-slate-500 font-medium italic">Upload multiple products to Bitrix24 & Cloudinary simultaneously</p>
        
        <div class="absolute top-0 right-0 flex items-center gap-3">
          <NuxtLink
            to="/admin/manage-admins"
            class="px-4 py-2 bg-red-50 border border-red-200 hover:bg-red-100 text-red-700 rounded-xl font-bold flex items-center gap-2 text-sm transition-all shadow-sm"
          >
            <span class="material-symbols-outlined text-sm">person_add</span>
            Add Admin
          </NuxtLink>
          <NuxtLink to="/admin/manage-products" class="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold flex items-center gap-2 text-sm transition-all shadow-sm">
            <span class="material-symbols-outlined text-sm">inventory_2</span>
            Manage Inventory
          </NuxtLink>
          <button @click="handleLogout" class="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold flex items-center gap-2 text-sm transition-all">
            <span class="material-symbols-outlined text-sm">logout</span>
            Logout
          </button>
        </div>
      </div>
      <form @submit.prevent="submitBatch" class="space-y-8">
        <!-- Products Container -->
        <div class="space-y-6">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-black text-slate-900 tracking-tight">Products to Upload</h2>
              <p class="text-slate-500 text-sm mt-1 font-medium">{{ products.length }} product{{ products.length !== 1 ? 's' : '' }} in queue</p>
            </div>
            <div class="flex gap-3">
              <button
                type="button"
                @click="checkExistingProducts"
                :disabled="isUploading || checkingDuplicates"
                class="flex items-center gap-2 px-5 py-3 bg-orange-50 text-orange-700 font-bold rounded-2xl hover:bg-orange-100 transition-all disabled:opacity-50 border border-orange-200"
              >
                <span v-if="checkingDuplicates" class="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full"></span>
                <span v-else class="material-symbols-outlined text-lg">database</span>
                {{ checkingDuplicates ? 'Checking...' : 'Check Duplicates' }}
              </button>
              <button
                type="button"
                @click="addProduct"
                :disabled="isUploading"
                class="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all disabled:opacity-50 shadow-lg shadow-slate-900/10"
              >
                <span class="material-symbols-outlined text-lg">add_circle</span>
                Add Product
              </button>
            </div>
          </div>

          <!-- Product Cards Grid -->
          <transition-group 
            name="list" 
            tag="div" 
            class="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            <div v-for="(product, productIndex) in products" :key="product.id" 
              class="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-8 space-y-8 relative transition-all duration-500"
              :class="{ 
                'border-orange-300 bg-orange-50/20 scale-[1.01] shadow-xl shadow-orange-500/5': getDuplicatesInBatch()[product.id] || existingProducts[product.id],
                'opacity-50 pointer-events-none': isUploading && uploadProgress[product.id] === 'success'
              }">
              
              <!-- Product Header -->
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center gap-3 flex-wrap">
                    <span class="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest">Item #{{ productIndex + 1 }}</span>
                    <h3 class="text-xl font-black text-slate-900">{{ product.name || 'Untitled Product' }}</h3>
                    
                    <div class="flex gap-2">
                      <div v-if="getDuplicatesInBatch()[product.id]" class="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-lg text-[10px] font-black uppercase">
                        <span class="material-symbols-outlined text-xs">warning</span>
                        Batch Match
                      </div>
                      <div v-if="existingProducts[product.id]" class="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded-lg text-[10px] font-black uppercase">
                        <span class="material-symbols-outlined text-xs">database</span>
                        In Database
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="flex gap-1">
                  <button
                    type="button"
                    @click="cloneProduct(product)"
                    :disabled="isUploading"
                    class="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                    title="Clone product"
                  >
                    <span class="material-symbols-outlined text-xl">content_copy</span>
                  </button>
                  <button
                    v-if="products.length > 1"
                    type="button"
                    @click="removeProduct(product.id)"
                    :disabled="isUploading"
                    class="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    title="Remove product"
                  >
                    <span class="material-symbols-outlined text-xl">delete</span>
                  </button>
                </div>
              </div>

              <!-- Upload Status Overlay -->
              <div v-if="uploadProgress[product.id]" class="absolute top-8 right-32 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-sm"
                :class="{
                  'bg-blue-600 text-white animate-pulse': uploadProgress[product.id] === 'uploading',
                  'bg-green-500 text-white': uploadProgress[product.id] === 'success',
                  'bg-red-500 text-white': uploadProgress[product.id] === 'error'
                }">
                <span v-if="uploadProgress[product.id] === 'uploading'" class="animate-spin inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full"></span>
                {{ uploadProgress[product.id] === 'uploading' ? 'Publishing' : uploadProgress[product.id] === 'success' ? 'Live' : 'Failed' }}
              </div>

              <!-- Details Grid -->
              <div class="grid grid-cols-2 gap-6">
                <div class="col-span-2 sm:col-span-1">
                  <label class="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 leading-none">Product Title</label>
                  <input
                    v-model="product.name"
                    type="text"
                    placeholder="e.g. 5KVA Hybrid Inverter"
                    class="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-700 bg-slate-50/30"
                    :disabled="isUploading"
                  />
                </div>
                <div class="col-span-2 sm:col-span-1">
                  <label class="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 leading-none">Price (NGN)</label>
                  <div class="relative">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-300">₦</span>
                    <input
                      v-model="product.price"
                      type="number"
                      placeholder="0"
                      class="w-full pl-9 pr-5 py-4 rounded-2xl border-2 border-slate-100 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-black text-slate-700 bg-slate-50/30"
                      :disabled="isUploading"
                    />
                  </div>
                </div>
                <div class="col-span-2 sm:col-span-1">
                  <label class="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 leading-none">Units</label>
                  <select
                    v-model="product.type"
                    class="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all appearance-none bg-white font-bold text-slate-700 bg-slate-50/30"
                    :disabled="isUploading"
                  >
                    <option value="piece">Per Piece</option>
                    <option value="meter">Per Meter</option>
                  </select>
                </div>
                <div class="col-span-2 sm:col-span-1">
                  <label class="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 leading-none">Brand / Partner</label>
                  <select
                    v-model="product.brand"
                    class="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all appearance-none bg-white font-bold text-slate-700 bg-slate-50/30"
                    :disabled="isUploading"
                  >
                    <option value="general">Novel General</option>
                    <option value="livoltek">Livoltek</option>
                    <option value="itel">iTel</option>
                    <option value="yinergy">Yinergy</option>
                    <option value="haisic">Haisic</option>
                    <option value="hithium">Hithium</option>
                  </select>
                </div>
              </div>

              <!-- Description -->
              <div>
                <label class="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 leading-none">Global Description</label>
                <textarea
                  v-model="product.description"
                  rows="3"
                  placeholder="Marketing copy and warranty details..."
                  class="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all resize-none font-medium text-slate-600 bg-slate-50/30"
                  :disabled="isUploading"
                ></textarea>
              </div>

              <!-- Specs Section -->
              <div class="p-6 bg-slate-50/50 rounded-[1.5rem] border border-slate-100 space-y-4">
                <div class="flex items-center justify-between">
                  <h4 class="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <span class="material-symbols-outlined text-lg">instant_mix</span>
                    Technical Specifications
                  </h4>
                  <button
                    type="button"
                    @click="addSpecRow(product.id)"
                    class="p-2 bg-white text-blue-600 font-bold rounded-xl border border-slate-200 hover:border-blue-200 hover:bg-blue-50 transition-all text-[10px] uppercase tracking-tighter"
                    :disabled="isUploading"
                  >
                    + Add Row
                  </button>
                </div>
                
                <transition-group name="spec" tag="div" class="space-y-3">
                  <div v-for="(spec, specIndex) in product.specs" :key="specIndex" class="flex gap-3 items-center">
                    <input
                      v-model="spec.label"
                      type="text"
                      placeholder="e.g. Capacity"
                      class="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none font-bold placeholder:font-normal"
                      :disabled="isUploading"
                    />
                    <div class="flex-[1.5] relative">
                      <input
                        v-model="spec.value"
                        type="text"
                        placeholder="Value"
                        class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none font-medium"
                        :disabled="isUploading"
                      />
                    </div>
                    <button
                      v-if="product.specs.length > 1"
                      type="button"
                      @click="removeSpecRow(product.id, specIndex)"
                      class="p-2 text-slate-300 hover:text-red-500 transition-all"
                      :disabled="isUploading"
                    >
                      <span class="material-symbols-outlined">close</span>
                    </button>
                  </div>
                </transition-group>
              </div>

              <!-- Media Section -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <!-- Main Image Upload -->
                <div>
                  <label class="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 leading-none">Cover Image</label>
                  
                  <div 
                    class="relative aspect-square rounded-3xl border-2 border-dashed transition-all group overflow-hidden"
                    :class="[
                      dragOverMain[product.id] ? 'bg-blue-50 border-blue-400 scale-[1.02]' : 'bg-slate-50 border-slate-200 hover:border-slate-300',
                      product.image ? 'border-solid border-slate-100' : ''
                    ]"
                    @dragover.prevent="dragOverMain[product.id] = true"
                    @dragleave.prevent="dragOverMain[product.id] = false"
                    @drop.prevent="handleFileDrop(product.id, $event, 'main')"
                  >
                    <template v-if="product.image">
                      <img :src="getPreviewUrl(product.image)" class="w-full h-full object-cover" />
                      <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
                        <button type="button" @click="clearMainImage(product.id)" class="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-red-500 transition-all flex items-center justify-center">
                          <span class="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    </template>
                    
                    <template v-else>
                      <input
                        type="file"
                        accept="image/*"
                        @change="handleFileChange(product.id, $event)"
                        class="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                        :disabled="isUploading"
                      />
                      <div class="absolute inset-0 flex flex-col items-center justify-center gap-3 text-slate-400">
                        <div class="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center group-hover:-translate-y-1 transition-transform">
                          <span class="material-symbols-outlined text-2xl text-blue-500">add_photo_alternate</span>
                        </div>
                        <div class="text-center">
                          <p class="text-xs font-black uppercase tracking-widest text-slate-500">Drop Image</p>
                          <p class="text-[10px] font-bold opacity-60">or click to browse</p>
                        </div>
                      </div>
                    </template>
                  </div>
                </div>

                <!-- Gallery Upload -->
                <div>
                  <div class="flex items-center justify-between mb-3">
                    <label class="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">Visual Gallery</label>
                    <button v-if="product.gallery.length" type="button" @click="clearGallery(product.id)" class="text-[9px] font-black uppercase text-red-500 hover:underline">Clear All</button>
                  </div>

                  <div 
                    class="relative min-h-[140px] h-full rounded-3xl border-2 border-dashed transition-all group"
                    :class="[
                      dragOverGallery[product.id] ? 'bg-blue-50 border-blue-400' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    ]"
                    @dragover.prevent="dragOverGallery[product.id] = true"
                    @dragleave.prevent="dragOverGallery[product.id] = false"
                    @drop.prevent="handleFileDrop(product.id, $event, 'gallery')"
                  >
                    <div v-if="product.gallery.length" class="p-3 grid grid-cols-2 gap-2">
                      <div v-for="(file, idx) in product.gallery" :key="idx" class="relative aspect-square rounded-xl overflow-hidden group/item border border-slate-200 shadow-sm">
                        <img :src="getPreviewUrl(file)" class="w-full h-full object-cover" />
                        <button
                          type="button"
                          @click="removeGalleryImage(product.id, idx)"
                          class="absolute top-1 right-1 w-6 h-6 bg-black/60 text-white rounded-lg flex items-center justify-center opacity-0 group-hover/item:opacity-100 scale-75 group-hover/item:scale-100 transition-all hover:bg-red-500"
                        >
                          <span class="material-symbols-outlined text-sm">close</span>
                        </button>
                      </div>
                      <!-- Quick Add Slot -->
                      <div class="relative aspect-square rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center bg-white/50 hover:bg-white transition-all cursor-pointer">
                        <input type="file" multiple accept="image/*" @change="handleGalleryUpload(product.id, $event)" class="absolute inset-0 opacity-0 cursor-pointer" />
                        <span class="material-symbols-outlined text-slate-300">add_circle</span>
                      </div>
                    </div>
                    
                    <template v-else>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        @change="handleGalleryUpload(product.id, $event)"
                        class="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                        :disabled="isUploading"
                      />
                      <div class="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-400">
                        <span class="material-symbols-outlined text-xl text-slate-300 group-hover:scale-110 transition-transform">filter_none</span>
                        <p class="text-[10px] font-black uppercase tracking-widest text-slate-500">Drop Multi</p>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </transition-group>
        </div>

        <!-- Upload Results Summary -->
        <div v-if="showResults" class="bg-white rounded-[2rem] shadow-xl border border-slate-200 p-8">
          <div class="flex items-center gap-4 mb-8">
            <div class="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white">
              <span class="material-symbols-outlined">summarize</span>
            </div>
            <div>
              <h3 class="text-2xl font-black text-slate-900">Publish Summary</h3>
              <p class="text-slate-500 text-sm font-medium">Batch processing complete</p>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="product in products" :key="product.id" 
              class="flex items-center gap-4 p-5 rounded-2xl border-2 transition-all"
              :class="{
                'bg-emerald-50 border-emerald-100 text-emerald-800': uploadResults[product.id]?.status === 'success',
                'bg-red-50 border-red-100 text-red-800': uploadResults[product.id]?.status === 'error'
              }">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center" 
                :class="uploadResults[product.id]?.status === 'success' ? 'bg-emerald-200' : 'bg-red-200'">
                <span class="material-symbols-outlined">
                  {{ uploadResults[product.id]?.status === 'success' ? 'check_circle' : 'error' }}
                </span>
              </div>
              <div class="min-w-0">
                <p class="text-xs font-black uppercase tracking-widest opacity-50">{{ product.name || 'Product' }}</p>
                <p class="text-sm font-bold truncate">{{ uploadResults[product.id]?.message }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Final Publish Bar -->
        <div class="fixed bottom-10 left-1/2 -translate-x-1/2 z-40 bg-white/80 backdrop-blur-xl px-10 py-6 rounded-[2.5rem] shadow-2xl shadow-slate-900/10 border border-white/50 flex items-center gap-10">
          <div class="hidden sm:block">
            <p class="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1">Queue Status</p>
            <p class="font-black text-slate-900 text-lg">Ready to Launch <span class="text-blue-600">({{ products.length }} Items)</span></p>
          </div>
          
          <button
            type="submit"
            :disabled="isUploading"
            class="group px-12 h-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-black text-lg rounded-[1.5rem] hover:from-blue-700 hover:to-blue-800 transition-all flex items-center gap-4 active:scale-95 shadow-xl shadow-blue-500/20 disabled:grayscale"
          >
            <span v-if="isUploading" class="animate-spin border-2 border-white/30 border-t-white w-5 h-5 rounded-full"></span>
            <span v-else class="material-symbols-outlined text-2xl group-hover:rotate-12 transition-transform">rocket_launch</span>
            {{ isUploading ? 'PUBLISHING...' : `PUBLISH ALL` }}
          </button>
        </div>
        <div class="h-32"></div> <!-- Spacer -->
      </form>
    </div>
  </div>
</template>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 600, 'GRAD' 0, 'opsz' 24;
}

/* List Transitions */
.list-enter-active, .list-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.list-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.9);
}
.list-leave-to {
  opacity: 0;
  transform: translateX(30px) scale(0.9);
}

/* Spec Transitions */
.spec-enter-active, .spec-leave-active {
  transition: all 0.3s ease;
}
.spec-enter-from, .spec-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
