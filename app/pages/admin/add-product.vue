<script setup>
definePageMeta({ middleware: 'admin' })

const isUploading = ref(false)
const uploadProgress = ref({})
const uploadResults = ref({})
const showResults = ref(false)
const checkingDuplicates = ref(false)
const duplicateWarnings = ref({})
const existingProducts = ref({})

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
      // Mark both the first occurrence and current product as duplicates
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
    
    if (productNames.length === 0) {
      checkingDuplicates.value = false
      return
    }

    const response = await $fetch('/api/admin/check-duplicates', {
      method: 'POST',
      body: {
        productNames
      }
    })

    if (response.duplicates) {
      response.duplicates.forEach(dupName => {
        const product = products.value.find(p => p.name?.toLowerCase() === dupName.toLowerCase())
        if (product) {
          existingProducts.value[product.id] = true
        }
      })
    }
  } catch (error) {
    console.error('Error checking duplicates:', error)
  } finally {
    checkingDuplicates.value = false
  }
}

const getBatchDuplicates = () => getDuplicatesInBatch()

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

const removeProduct = (productId) => {
  if (products.value.length > 1) {
    products.value = products.value.filter(p => p.id !== productId)
  }
}

const handleGalleryUpload = (productId, event) => {
  const product = products.value.find(p => p.id === productId)
  if (product) {
    product.gallery = Array.from(event.target.files)
  }
}

const generateImagePreview = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target?.result)
    reader.readAsDataURL(file)
  })
}

const handleFileChange = (productId, event) => {
  const product = products.value.find(p => p.id === productId)
  if (product) {
    product.image = event.target.files[0]
  }
}

const addSpecRow = (productId) => {
  const product = products.value.find(p => p.id === productId)
  if (product) {
    product.specs.push({ label: '', value: '' })
  }
}

const removeSpecRow = (productId, index) => {
  const product = products.value.find(p => p.id === productId)
  if (product && product.specs.length > 1) {
    product.specs.splice(index, 1)
  }
}

const clearMainImage = (productId) => {
  const product = products.value.find(p => p.id === productId)
  if (product) {
    product.image = null
    const fileInput = document.querySelector(`input[data-product-id="${productId}"][type="file"]:not([multiple])`)
    if (fileInput) fileInput.value = ''
  }
}

const removeGalleryImage = (productId, index) => {
  const product = products.value.find(p => p.id === productId)
  if (product) {
    product.gallery.splice(index, 1)
  }
}

const validateBatch = () => {
  const errors = []
  const batchDuplicates = getBatchDuplicates()
  
  products.value.forEach((product, index) => {
    if (!product.name) errors.push(`Product ${index + 1}: Name is required`)
    if (!product.price) errors.push(`Product ${index + 1}: Price is required`)
    if (!product.image) errors.push(`Product ${index + 1}: Main image is required`)
    
    if (batchDuplicates[product.id]) {
      errors.push(`Product ${index + 1}: Duplicate product name within batch`)
    }
  })
  
  return errors
}

const submitBatch = async () => {
  const errors = validateBatch()
  if (errors.length > 0) {
    alert(`Validation errors:\n${errors.join('\n')}`)
    return
  }

  // Check for existing products in database
  const hasExisting = Object.keys(existingProducts.value).length > 0
  if (hasExisting) {
    const existingCount = Object.keys(existingProducts.value).length
    const proceed = confirm(
      `⚠️ ${existingCount} product(s) may already exist in the database.\n\n` +
      `This could create duplicates.\n\n` +
      `Continue anyway?`
    )
    if (!proceed) return
  }

  isUploading.value = true
  uploadProgress.value = {}
  uploadResults.value = {}
  showResults.value = false

  let successCount = 0
  let failureCount = 0
  let duplicateCount = 0

  for (let i = 0; i < products.value.length; i++) {
    const product = products.value[i]
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
      
      product.gallery.forEach(file => {
        formData.append('galleryImages', file)
      })

      const response = await $fetch('/api/admin/upload-product', {
        method: 'POST',
        body: formData,
      })

      uploadProgress.value[product.id] = 'success'
      uploadResults.value[product.id] = {
        status: 'success',
        message: isExisting 
          ? `⚠️ "${product.name}" uploaded (existing product updated)`
          : `✓ "${product.name}" uploaded successfully`,
        isExisting
      }
      successCount++
    } catch (error) {
      uploadProgress.value[product.id] = 'error'
      const errorMsg = error.data?.statusMessage || error.message || 'Unknown error'
      
      if (errorMsg.includes('duplicate') || errorMsg.includes('already exists')) {
        duplicateCount++
      }
      
      uploadResults.value[product.id] = {
        status: 'error',
        message: `✗ "${product.name}" failed: ${errorMsg}`
      }
      failureCount++
    }
  }

  isUploading.value = false
  showResults.value = true

  // Show summary
  const summary = `Upload Complete!\n\n✓ Success: ${successCount}\n✗ Failed: ${failureCount}${duplicateCount > 0 ? `\n⚠️ Duplicates: ${duplicateCount}` : ''}`
  
  if (failureCount === 0) {
    alert(summary + '\n\nClearing form...')
    // Reset everything
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
    alert(summary)
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
        <button @click="handleLogout" class="absolute top-0 right-0 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold flex items-center gap-2 text-sm transition-all">
          <span class="material-symbols-outlined text-sm">logout</span>
          Logout
        </button>
      </div>

      <form @submit.prevent="submitBatch" class="space-y-8">
        <!-- Products Container -->
        <div class="space-y-6">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-black text-slate-900">Products to Upload</h2>
              <p class="text-slate-500 text-sm mt-1">{{ products.length }} product{{ products.length !== 1 ? 's' : '' }} in queue</p>
            </div>
            <div class="flex gap-2">
              <button
                type="button"
                @click="checkExistingProducts"
                :disabled="isUploading || checkingDuplicates"
                class="flex items-center gap-2 px-5 py-3 bg-orange-100 text-orange-700 font-black rounded-2xl hover:bg-orange-200 transition-all disabled:opacity-50"
              >
                <span v-if="checkingDuplicates" class="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full"></span>
                <span v-else class="material-symbols-outlined">feedback</span>
                {{ checkingDuplicates ? 'Checking...' : 'Check Duplicates' }}
              </button>
              <button
                type="button"
                @click="addProduct"
                :disabled="isUploading"
                class="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-black rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50"
              >
                <span class="material-symbols-outlined">add_circle</span>
                Add Product
              </button>
            </div>
          </div>

          <!-- Product Cards Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div v-for="(product, productIndex) in products" :key="product.id" class="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 space-y-6 relative"
              :class="{ 'border-orange-300 bg-orange-50/30': getBatchDuplicates()[product.id] || existingProducts[product.id] }">
              <!-- Product Header with Delete -->
              <div class="flex items-start justify-between mb-4">
                <div class="flex-1">
                  <div class="flex items-center gap-3">
                    <h3 class="text-lg font-black text-slate-900">Product {{ productIndex + 1 }}</h3>
                    <div class="flex gap-2">
                      <div v-if="getBatchDuplicates()[product.id]" class="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-bold">
                        <span class="material-symbols-outlined text-sm">warning</span>
                        Duplicate in batch
                      </div>
                      <div v-if="existingProducts[product.id]" class="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold">
                        <span class="material-symbols-outlined text-sm">info</span>
                        Exists in DB
                      </div>
                    </div>
                  </div>
                  <p class="text-xs text-slate-400 mt-1">Step-by-step product details</p>
                </div>
                <button
                  v-if="products.length > 1"
                  type="button"
                  @click="removeProduct(product.id)"
                  :disabled="isUploading"
                  class="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  title="Remove product"
                >
                  <span class="material-symbols-outlined">delete</span>
                </button>
              </div>

              <!-- Upload Status Badge -->
              <div v-if="uploadProgress[product.id]" class="absolute top-6 right-6 flex items-center gap-2 px-3 py-2 rounded-full text-sm font-bold"
                :class="{
                  'bg-blue-100 text-blue-700': uploadProgress[product.id] === 'uploading',
                  'bg-green-100 text-green-700': uploadProgress[product.id] === 'success',
                  'bg-red-100 text-red-700': uploadProgress[product.id] === 'error'
                }">
                <span v-if="uploadProgress[product.id] === 'uploading'" class="animate-spin inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full"></span>
                <span v-else-if="uploadProgress[product.id] === 'success'" class="material-symbols-outlined text-base">check_circle</span>
                <span v-else class="material-symbols-outlined text-base">error_circle</span>
                {{ uploadProgress[product.id] === 'uploading' ? 'Uploading...' : uploadProgress[product.id] === 'success' ? 'Success' : 'Failed' }}
              </div>

              <!-- Product Details -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Name</label>
                  <input
                    v-model="product.name"
                    type="text"
                    placeholder="e.g. Solar Panel"
                    class="w-full px-4 py-3 rounded-2xl border-2 border-slate-100 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                    :disabled="isUploading"
                  />
                </div>
                <div>
                  <label class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Price (NGN)</label>
                  <input
                    v-model="product.price"
                    type="number"
                    placeholder="0.00"
                    class="w-full px-4 py-3 rounded-2xl border-2 border-slate-100 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                    :disabled="isUploading"
                  />
                </div>
                <div>
                  <label class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Unit Type</label>
                  <select
                    v-model="product.type"
                    class="w-full px-4 py-3 rounded-2xl border-2 border-slate-100 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all appearance-none bg-white font-bold text-slate-700"
                    :disabled="isUploading"
                  >
                    <option value="piece">Piece</option>
                    <option value="meter">Meter</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Brand</label>
                  <select
                    v-model="product.brand"
                    class="w-full px-4 py-3 rounded-2xl border-2 border-slate-100 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all appearance-none bg-white font-bold text-slate-700"
                    :disabled="isUploading"
                  >
                    <option value="general">General</option>
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
                <label class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Description</label>
                <textarea
                  v-model="product.description"
                  rows="4"
                  placeholder="Enter product description..."
                  class="w-full px-4 py-3 rounded-2xl border-2 border-slate-100 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all resize-none"
                  :disabled="isUploading"
                ></textarea>
              </div>

              <!-- Specs -->
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <label class="text-xs font-black text-slate-400 uppercase tracking-widest">Technical Specs</label>
                  <button
                    type="button"
                    @click="addSpecRow(product.id)"
                    class="text-xs font-bold text-blue-600 hover:text-blue-700"
                    :disabled="isUploading"
                  >
                    + Add Row
                  </button>
                </div>
                <div v-for="(spec, specIndex) in product.specs" :key="specIndex" class="flex gap-2">
                  <input
                    v-model="spec.label"
                    type="text"
                    placeholder="Label"
                    class="w-1/3 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                    :disabled="isUploading"
                  />
                  <input
                    v-model="spec.value"
                    type="text"
                    placeholder="Value"
                    class="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                    :disabled="isUploading"
                  />
                  <button
                    v-if="product.specs.length > 1"
                    type="button"
                    @click="removeSpecRow(product.id, specIndex)"
                    class="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    :disabled="isUploading"
                  >
                    <span class="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>
              </div>

              <!-- Image Uploads -->
              <div class="space-y-4">
                <!-- Main Image -->
                <div>
                  <label class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Main Image</label>
                  <div v-if="product.image" class="mb-3 relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-slate-200 shadow-md group">
                    <img :src="URL.createObjectURL(product.image)" :alt="product.image.name" class="w-full h-full object-cover" />
                    <button
                      type="button"
                      @click="clearMainImage(product.id)"
                      class="absolute inset-0 bg-black/0 group-hover:bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                      :disabled="isUploading"
                    >
                      <span class="material-symbols-outlined text-white text-2xl">close</span>
                    </button>
                    <p class="text-xs font-bold text-slate-600 mt-1 truncate">{{ product.image.name }}</p>
                  </div>
                  <div class="relative group cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      @change="handleFileChange(product.id, $event)"
                      :data-product-id="product.id"
                      class="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer"
                      :disabled="isUploading"
                    />
                    <div class="h-24 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-1 transition-all group-hover:bg-slate-50 group-hover:border-slate-400">
                      <span class="material-symbols-outlined text-2xl text-slate-400">add_photo_alternate</span>
                      <span class="text-xs font-bold text-slate-500">{{ product.image ? 'Change Image' : 'Upload Primary' }}</span>
                    </div>
                  </div>
                </div>

                <!-- Gallery -->
                <div>
                  <label class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Gallery Images</label>
                  <div v-if="product.gallery.length > 0" class="mb-3 grid grid-cols-4 gap-2">
                    <div v-for="(file, index) in product.gallery" :key="index" class="relative w-full aspect-square rounded-xl overflow-hidden border-2 border-slate-200 shadow-md group">
                      <img :src="URL.createObjectURL(file)" :alt="`Gallery ${index}`" class="w-full h-full object-cover" />
                      <button
                        type="button"
                        @click="removeGalleryImage(product.id, index)"
                        class="absolute inset-0 bg-black/0 group-hover:bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                        :disabled="isUploading"
                      >
                        <span class="material-symbols-outlined text-white text-xl">close</span>
                      </button>
                    </div>
                  </div>
                  <div class="relative group cursor-pointer">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      @change="handleGalleryUpload(product.id, $event)"
                      :data-product-id="product.id"
                      class="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer"
                      :disabled="isUploading"
                    />
                    <div class="h-24 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-1 transition-all group-hover:bg-slate-50 group-hover:border-slate-400">
                      <span class="material-symbols-outlined text-2xl text-slate-400">filter_none</span>
                      <span class="text-xs font-bold text-slate-500">{{ product.gallery.length > 0 ? `${product.gallery.length} files` : 'Add Extra Shots' }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Upload Results -->
        <div v-if="showResults" class="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
          <h3 class="text-xl font-black text-slate-900 mb-6">Upload Results</h3>
          <div class="space-y-3">
            <div v-for="product in products" :key="product.id" 
              :class="{
                'bg-green-50 border-green-200 text-green-800': uploadResults[product.id]?.status === 'success',
                'bg-amber-50 border-amber-200 text-amber-800': uploadResults[product.id]?.status === 'success' && uploadResults[product.id]?.isExisting,
                'bg-red-50 border-red-200 text-red-800': uploadResults[product.id]?.status === 'error'
              }"
              class="flex items-center gap-3 p-4 rounded-xl border">
              <span class="material-symbols-outlined">
                {{ uploadResults[product.id]?.status === 'success' ? (uploadResults[product.id]?.isExisting ? 'info' : 'check_circle') : 'error_circle' }}
              </span>
              <span class="font-medium">{{ uploadResults[product.id]?.message }}</span>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="flex flex-col items-center justify-center gap-4 pb-20">
          <button
            type="submit"
            :disabled="isUploading"
            class="group w-full md:w-96 h-20 rounded-3xl font-black text-xl shadow-2xl transition-all flex items-center justify-center gap-4 active:scale-95"
            :class="isUploading ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none' : 'bg-gradient-to-r from-yellow-600 to-yellow-700 text-white hover:from-yellow-700 hover:to-yellow-800 hover:-translate-y-1 shadow-yellow-600/30'"
          >
            <span v-if="isUploading" class="animate-spin border-2 border-white/30 border-t-white w-5 h-5 rounded-full"></span>
            <template v-if="isUploading">
              <span>UPLOADING {{ products.length }} PRODUCTS...</span>
            </template>
            <template v-else>
              <span class="material-symbols-outlined text-2xl group-hover:translate-x-1 transition-transform">rocket_launch</span>
              PUBLISH ALL ({{ products.length }})
            </template>
          </button>
          <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">Novel Solar Batch Admin</p>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 600, 'GRAD' 0, 'opsz' 24;
}
</style>
