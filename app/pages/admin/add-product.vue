<script setup>
const productName = ref('')
const productPrice = ref(null)
const productType = ref('piece')
const productBrand = ref('general')
const productDescription = ref('')
const productSpecs = ref([{ label: '', value: '' }])
const productImage = ref(null)
const galleryFiles = ref([])
const adminPasscode = ref('')
const isUploading = ref(false)

const handleGalleryUpload = (event) => {
  galleryFiles.value = Array.from(event.target.files)
}

const addSpecRow = () => {
  productSpecs.value.push({ label: '', value: '' })
}

const removeSpecRow = (index) => {
  if (productSpecs.value.length > 1) {
    productSpecs.value.splice(index, 1)
  }
}

const handleFileChange = (event) => {
  productImage.value = event.target.files[0]
}

const submitProduct = async () => {
  if (!productName.value || !productPrice.value || !productImage.value || !adminPasscode.value) {
    alert('Please fill in all fields (including the passcode) and select an image.')
    return
  }

  isUploading.value = true

  const formData = new FormData()
  formData.append('productName', productName.value)
  formData.append('productPrice', productPrice.value)
  formData.append('productType', productType.value)
  formData.append('productBrand', productBrand.value)
  formData.append('productDescription', productDescription.value)
  formData.append('productSpecs', JSON.stringify(productSpecs.value))
  formData.append('productImage', productImage.value)
  
  // Append gallery images
  galleryFiles.value.forEach(file => {
    formData.append('galleryImages', file)
  })

  formData.append('adminPasscode', adminPasscode.value)

  try {
    const response = await $fetch('/api/admin/upload-product', {
      method: 'POST',
      body: formData,
    })

    if (response.success) {
      alert('Product successfully added!')
      // Clear form
      productName.value = ''
      productPrice.value = null
      productType.value = 'piece'
      productBrand.value = 'general'
      productDescription.value = ''
      productSpecs.value = [{ label: '', value: '' }]
      productImage.value = null
      galleryFiles.value = []
      adminPasscode.value = ''
      // Reset file inputs manually
      const fileInput = document.getElementById('productImage')
      if (fileInput) fileInput.value = ''
      const galleryInput = document.getElementById('galleryImages')
      if (galleryInput) galleryInput.value = ''
    } else {
      alert(`Error: ${response.message || 'Unknown error'}`)
    }
  } catch (error) {
    console.error('Upload failed:', error)
    const errorMessage = error.data?.statusMessage || error.message || 'Internal Server Error'
    alert(`Upload failed: ${errorMessage}`)
  } finally {
    isUploading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto">
      <div class="mb-10 text-center">
        <h1 class="text-4xl font-black text-slate-900 mb-2 tracking-tight">Add New Product</h1>
        <p class="text-slate-500 font-medium italic">Publish directly to Bitrix24 & Cloudinary</p>
      </div>

      <form @submit.prevent="submitProduct" class="space-y-8">
        <!-- Top Section: Security Card -->
        <div class="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
          <div class="max-w-md">
            <label for="adminPasscode" class="block text-sm font-black text-slate-700 uppercase tracking-wider mb-2">Admin Passcode</label>
            <input
              id="adminPasscode"
              v-model="adminPasscode"
              type="password"
              placeholder="••••••••"
              class="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all font-mono"
              required
              :disabled="isUploading"
            />
          </div>
        </div>

        <!-- Main Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <!-- Left Column: Details & Specs -->
          <div class="lg:col-span-2 space-y-8">
            
            <!-- Details Card -->
            <div class="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 space-y-6">
              <h2 class="text-xl font-black text-slate-900 flex items-center gap-2">
                <span class="material-symbols-outlined text-yellow-600">inventory_2</span>
                Product Details
              </h2>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="md:col-span-1">
                  <label for="productName" class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Name</label>
                  <input
                    id="productName"
                    v-model="productName"
                    type="text"
                    placeholder="e.g. Solar Panel"
                    class="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:ring-4 focus:ring-yellow-500/10 focus:border-yellow-500 outline-none transition-all"
                    required
                    :disabled="isUploading"
                  />
                </div>
                <div>
                  <label for="productPrice" class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Price (NGN)</label>
                  <input
                    id="productPrice"
                    v-model="productPrice"
                    type="number"
                    placeholder="0.00"
                    class="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:ring-4 focus:ring-yellow-500/10 focus:border-yellow-500 outline-none transition-all"
                    required
                    :disabled="isUploading"
                  />
                </div>
                <div>
                  <label for="productType" class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Unit Type</label>
                  <select
                    id="productType"
                    v-model="productType"
                    class="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:ring-4 focus:ring-yellow-500/10 focus:border-yellow-500 outline-none transition-all appearance-none bg-white font-bold text-slate-700"
                    required
                    :disabled="isUploading"
                  >
                    <option value="piece">Piece</option>
                    <option value="meter">Meter</option>
                  </select>
                </div>
                <div>
                  <label for="productBrand" class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Partner/Brand</label>
                  <select
                    id="productBrand"
                    v-model="productBrand"
                    class="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:ring-4 focus:ring-yellow-500/10 focus:border-yellow-500 outline-none transition-all appearance-none bg-white font-bold text-slate-700"
                    required
                    :disabled="isUploading"
                  >
                    <option value="general">General / Mixed</option>
                    <option value="livoltek">Livoltek</option>
                    <option value="itel">iTel</option>
                    <option value="yinergy">Yinergy</option>
                    <option value="haisic">Haisic</option>
                    <option value="hithium">Hithium</option>
                  </select>
                </div>
              </div>

              <div>
                <label for="productDescription" class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Description</label>
                <textarea
                  id="productDescription"
                  v-model="productDescription"
                  rows="6"
                  placeholder="Enter main product description..."
                  class="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:ring-4 focus:ring-yellow-500/10 focus:border-yellow-500 outline-none transition-all resize-y min-h-[150px]"
                  :disabled="isUploading"
                ></textarea>
              </div>
            </div>

            <!-- Specifications Card -->
            <div class="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 space-y-6">
              <div class="flex items-center justify-between">
                <h2 class="text-xl font-black text-slate-900 flex items-center gap-2">
                  <span class="material-symbols-outlined text-yellow-600">list_alt</span>
                  Technical Specs
                </h2>
                <button 
                  type="button" 
                  @click="addSpecRow" 
                  class="flex items-center gap-1.5 px-4 py-2 bg-yellow-50 text-yellow-700 font-black rounded-xl border-2 border-yellow-100 hover:bg-yellow-100 transition-all text-xs uppercase"
                  :disabled="isUploading"
                >
                  <span class="material-symbols-outlined text-base">add_circle</span>
                  Add Row
                </button>
              </div>
              
              <div class="space-y-4">
                <div v-for="(spec, index) in productSpecs" :key="index" class="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 animate-fadeInSlide">
                  <div class="w-full sm:w-1/3">
                    <input
                      v-model="spec.label"
                      type="text"
                      placeholder="Label (Weight)"
                      class="w-full px-4 py-3 rounded-xl border-2 border-white focus:border-yellow-500 outline-none text-sm transition-all shadow-sm"
                      :disabled="isUploading"
                    />
                  </div>
                  <div class="flex-1 w-full sm:w-auto">
                    <input
                      v-model="spec.value"
                      type="text"
                      placeholder="Value (50kg)"
                      class="w-full px-4 py-3 rounded-xl border-2 border-white focus:border-yellow-500 outline-none text-sm transition-all shadow-sm"
                      :disabled="isUploading"
                    />
                  </div>
                  <button 
                    type="button" 
                    @click="removeSpecRow(index)" 
                    class="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all disabled:opacity-0 shrink-0"
                    :disabled="productSpecs.length <= 1 || isUploading"
                  >
                    <span class="material-symbols-outlined text-xl">delete_sweep</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Media Sidebar -->
          <div class="lg:col-span-1 space-y-8">
            <div class="bg-[#002888] rounded-3xl shadow-xl p-8 text-white space-y-8 sticky top-8">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined">collections</span>
                <h2 class="text-xl font-black">Media Assets</h2>
              </div>

              <div class="space-y-6">
                <!-- Main Image -->
                <div class="bg-white/10 rounded-2xl p-6 border border-white/10">
                  <label class="block text-[10px] font-black uppercase tracking-widest text-blue-200 mb-4">Main Product Image</label>
                  <div class="relative group cursor-pointer">
                    <input
                      id="productImage"
                      type="file"
                      accept="image/*"
                      @change="handleFileChange"
                      class="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer"
                      required
                      :disabled="isUploading"
                    />
                    <div class="h-32 rounded-2xl border-2 border-dashed border-white/30 flex flex-col items-center justify-center gap-2 transition-all group-hover:bg-white/5 group-hover:border-white/50">
                      <span class="material-symbols-outlined text-3xl">add_photo_alternate</span>
                      <span class="text-xs font-bold text-white/70">{{ productImage ? productImage.name : 'Upload Primary Photo' }}</span>
                    </div>
                  </div>
                </div>

                <!-- Gallery Images -->
                <div class="bg-white/10 rounded-2xl p-6 border border-white/10">
                  <label class="block text-[10px] font-black uppercase tracking-widest text-blue-200 mb-4">Gallery Images (Multiple)</label>
                  <div class="relative group cursor-pointer">
                    <input
                      id="galleryImages"
                      type="file"
                      multiple
                      accept="image/*"
                      @change="handleGalleryUpload"
                      class="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer"
                      :disabled="isUploading"
                    />
                    <div class="h-32 rounded-2xl border-2 border-dashed border-white/30 flex flex-col items-center justify-center gap-2 transition-all group-hover:bg-white/5 group-hover:border-white/50">
                      <span class="material-symbols-outlined text-3xl">filter_none</span>
                      <span class="text-xs font-bold text-white/70">
                         {{ galleryFiles.length > 0 ? `${galleryFiles.length} files selected` : 'Select Extra Shots' }}
                      </span>
                    </div>
                  </div>
                  <div v-if="galleryFiles.length > 0" class="mt-4 grid grid-cols-4 gap-2">
                    <div v-for="i in Math.min(galleryFiles.length, 4)" :key="i" class="w-full aspect-square bg-white/20 rounded-lg flex items-center justify-center">
                      <span class="material-symbols-outlined text-xs">image</span>
                    </div>
                    <div v-if="galleryFiles.length > 4" class="text-[10px] font-bold text-blue-300 col-span-4 mt-1">+ {{ galleryFiles.length - 4 }} more</div>
                  </div>
                </div>
              </div>

              <!-- Tip Box -->
              <div class="bg-white/10 rounded-2xl p-5 border border-white/5">
                 <p class="text-xs font-medium leading-relaxed text-blue-100 flex gap-2">
                   <span class="material-symbols-outlined text-sm shrink-0">info</span>
                   Cloudinary automatically optimizes these images for mobile performance.
                 </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Section: Submit -->
        <div class="flex flex-col items-center justify-center mt-12 gap-4 pb-20">
          <button
            type="submit"
            :disabled="isUploading"
            class="group w-full md:w-80 h-20 rounded-3xl font-black text-xl shadow-2xl transition-all flex items-center justify-center gap-4 active:scale-95"
            :class="isUploading ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none' : 'bg-yellow-600 text-white hover:bg-yellow-700 hover:-translate-y-1 shadow-yellow-600/20'"
          >
            <template v-if="isUploading">
              <svg class="animate-spin h-6 w-6 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>UPLOADING...</span>
            </template>
            <template v-else>
              <span class="material-symbols-outlined text-2xl group-hover:translate-x-1 transition-transform">rocket_launch</span>
              PUBLISH PRODUCT
            </template>
          </button>
          <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">Novel Solar Inventory Admin</p>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.animate-fadeInSlide {
  animation: fadeInSlide 0.4s ease-out forwards;
}

@keyframes fadeInSlide {
  from { opacity: 0; transform: translateX(-10px); }
  to { opacity: 1; transform: translateX(0); }
}

.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 600, 'GRAD' 0, 'opsz' 24;
}
</style>
