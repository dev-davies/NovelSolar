<script setup>
const productName = ref('')
const productPrice = ref(null)
const productType = ref('piece')
const productDescription = ref('')
const productSpecs = ref([{ label: '', value: '' }])
const productImage = ref(null)
const adminPasscode = ref('')
const isUploading = ref(false)

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
  formData.append('productDescription', productDescription.value)
  formData.append('productSpecs', JSON.stringify(productSpecs.value))
  formData.append('productImage', productImage.value)
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
      productDescription.value = ''
      productSpecs.value = [{ label: '', value: '' }]
      productImage.value = null
      adminPasscode.value = ''
      // Reset file input manually
      const fileInput = document.getElementById('productImage')
      if (fileInput) fileInput.value = ''
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
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-gray-100">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Add New Product</h1>
        <p class="text-gray-500 text-sm">Upload a new product directly to Bitrix24</p>
      </div>

      <form @submit.prevent="submitProduct" class="space-y-6">
        <div>
          <label for="adminPasscode" class="block text-sm font-medium text-gray-700 mb-1">Admin Passcode</label>
          <input
            id="adminPasscode"
            v-model="adminPasscode"
            type="password"
            placeholder="Enter secure passcode"
            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
            required
            :disabled="isUploading"
          />
        </div>

        <div>
          <label for="productName" class="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
          <input
            id="productName"
            v-model="productName"
            type="text"
            placeholder="e.g. Solar Panel 400W"
            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all"
            required
            :disabled="isUploading"
          />
        </div>

        <div>
          <label for="productPrice" class="block text-sm font-medium text-gray-700 mb-1">Price in NGN</label>
          <input
            id="productPrice"
            v-model="productPrice"
            type="number"
            placeholder="0.00"
            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all"
            required
            :disabled="isUploading"
          />
        </div>

        <div>
           <label for="productType" class="block text-sm font-medium text-gray-700 mb-1">Product Type (Unit)</label>
           <select
             id="productType"
             v-model="productType"
             class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all"
             required
             :disabled="isUploading"
           >
             <option value="piece">Piece</option>
             <option value="meter">Meter</option>
           </select>
        </div>

        <div>
          <label for="productDescription" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            id="productDescription"
            v-model="productDescription"
            rows="4"
            placeholder="Enter main product description..."
            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all resize-y"
            :disabled="isUploading"
          ></textarea>
        </div>

        <div class="border border-gray-200 rounded-lg p-4 bg-gray-50/50">
          <div class="flex items-center justify-between mb-3">
            <label class="block text-sm font-bold text-gray-700">Specifications</label>
            <button 
              type="button" 
              @click="addSpecRow" 
              class="text-xs font-bold text-yellow-600 hover:text-yellow-700 transition-colors bg-yellow-50 px-3 py-1.5 rounded-md border border-yellow-200"
              :disabled="isUploading"
            >
              + Add Row
            </button>
          </div>
          
          <div class="space-y-3">
            <div v-for="(spec, index) in productSpecs" :key="index" class="flex items-start gap-2">
              <input
                v-model="spec.label"
                type="text"
                placeholder="Label (e.g. Weight)"
                class="w-1/3 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-sm transition-all"
                :disabled="isUploading"
              />
              <input
                v-model="spec.value"
                type="text"
                placeholder="Value (e.g. 50kg)"
                class="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-sm transition-all"
                :disabled="isUploading"
              />
              <button 
                type="button" 
                @click="removeSpecRow(index)" 
                class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                :disabled="productSpecs.length <= 1 || isUploading"
                title="Remove Row"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div>
          <label for="productImage" class="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
          <input
            id="productImage"
            type="file"
            accept="image/*"
            @change="handleFileChange"
            class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100 transition-all cursor-pointer"
            required
            :disabled="isUploading"
          />
        </div>

        <button
          type="submit"
          :disabled="isUploading"
          class="w-full py-4 px-6 rounded-lg font-bold text-white transition-all transform active:scale-[0.98]"
          :class="isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-yellow-600 hover:bg-yellow-700 shadow-md hover:shadow-lg'"
        >
          <span v-if="isUploading" class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Uploading to Bitrix...
          </span>
          <span v-else>Publish Product</span>
        </button>
      </form>
    </div>
  </div>
</template>
