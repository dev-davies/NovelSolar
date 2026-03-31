<script setup>
definePageMeta({ middleware: 'admin' })

const searchQuery = ref('')
const isSearching = ref(false)
const searchResults = ref([])
const selectedProduct = ref(null)
const isEditing = ref(false)
const isSaving = ref(false)
const isDeleting = ref(false)
const showDeleteConfirm = ref(false)

// Edit form state
const editForm = ref({
  id: '',
  name: '',
  price: null,
  description: '',
  specs: [{ label: '', value: '' }]
})

const resetSearch = () => {
  searchQuery.value = ''
  searchResults.value = []
  selectedProduct.value = null
  isEditing.value = false
}

const performSearch = async () => {
  if (!searchQuery.value.trim()) {
    alert('Enter a product name to search')
    return
  }

  isSearching.value = true

  try {
    const response = await $fetch('/api/admin/search-products', {
      method: 'POST',
      body: {
        query: searchQuery.value
      }
    })

    searchResults.value = response.products || []
    if (searchResults.value.length === 0) {
      alert('No products found')
    }
  } catch (error) {
    console.error('Search failed:', error)
    alert(error.data?.statusMessage || 'Search failed')
  } finally {
    isSearching.value = false
  }
}

const selectProduct = (product) => {
  selectedProduct.value = product
  editForm.value = {
    id: product.id,
    name: product.name,
    price: parseFloat(product.price),
    description: product.description || '',
    specs: product.specs && product.specs.length > 0 ? [...product.specs] : [{ label: '', value: '' }]
  }
  isEditing.value = true
}

const addSpecRow = () => {
  editForm.value.specs.push({ label: '', value: '' })
}

const removeSpecRow = (index) => {
  if (editForm.value.specs.length > 1) {
    editForm.value.specs.splice(index, 1)
  }
}

const saveChanges = async () => {
  if (!editForm.value.name || !editForm.value.price) {
    alert('Name and price are required')
    return
  }

  isSaving.value = true

  try {
    const response = await $fetch('/api/admin/update-product', {
      method: 'POST',
      body: {
        productId: editForm.value.id,
        productName: editForm.value.name,
        productPrice: editForm.value.price,
        productDescription: editForm.value.description,
        productSpecs: editForm.value.specs
      }
    })

    alert('Product updated successfully!')
    isEditing.value = false
    selectedProduct.value = null
    resetSearch()
  } catch (error) {
    console.error('Update failed:', error)
    alert(error.data?.statusMessage || 'Update failed')
  } finally {
    isSaving.value = false
  }
}

const cancelEdit = () => {
  isEditing.value = false
  selectedProduct.value = null
  showDeleteConfirm.value = false
}

const confirmDelete = () => {
  showDeleteConfirm.value = true
}

const deleteProduct = async () => {
  if (!editForm.value.id) {
    alert('Missing required information')
    return
  }

  isDeleting.value = true
  showDeleteConfirm.value = false

  try {
    const response = await $fetch('/api/admin/delete-product', {
      method: 'POST',
      body: {
        productId: editForm.value.id,
        productName: editForm.value.name
      }
    })

    alert(`✓ ${response.message}`)
    isEditing.value = false
    selectedProduct.value = null
    resetSearch()
  } catch (error) {
    console.error('Delete failed:', error)
    alert(error.data?.statusMessage || 'Delete failed')
  } finally {
    isDeleting.value = false
  }
}

useHead({
  title: 'Manage Products | Novel Solar Admin',
  meta: [{ name: 'description', content: 'Search and edit existing products' }]
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
        <h1 class="text-4xl font-black text-slate-900 mb-2 tracking-tight">Manage Products</h1>
        <p class="text-slate-500 font-medium italic">Search and edit existing inventory</p>
        <button @click="handleLogout" class="absolute top-0 right-0 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold flex items-center gap-2 text-sm transition-all">
          <span class="material-symbols-outlined text-sm">logout</span>
          Logout
        </button>
      </div>

      <div v-if="!isEditing" class="space-y-8">
        <!-- Search Section -->
        <div class="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div class="md:col-span-3">
              <label class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Product Name</label>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search by product name..."
                class="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none transition-all"
                @keyup.enter="performSearch"
                :disabled="isSearching"
              />
            </div>
            <button
              @click="performSearch"
              :disabled="isSearching || !searchQuery"
              class="w-full px-5 py-4 bg-purple-600 text-white font-black rounded-2xl hover:bg-purple-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span v-if="isSearching" class="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
              <span class="material-symbols-outlined">search</span>
              {{ isSearching ? 'Searching...' : 'Search' }}
            </button>
          </div>
        </div>

        <!-- Search Results -->
        <div v-if="searchResults.length > 0" class="space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-black text-slate-900">
              Results <span class="text-purple-600">({{ searchResults.length }})</span>
            </h2>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div
              v-for="product in searchResults"
              :key="product.id"
              class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all cursor-pointer"
              @click="selectProduct(product)"
            >
              <div class="flex gap-4">
                <div v-if="product.imageUrl" class="w-20 h-20 rounded-xl bg-slate-100 flex-shrink-0 overflow-hidden">
                  <img :src="product.imageUrl" :alt="product.name" class="w-full h-full object-cover" />
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="font-black text-slate-900 truncate hover:text-purple-600">{{ product.name }}</h3>
                  <p class="text-lg font-bold text-purple-600 mt-1">₦{{ Number(product.price).toLocaleString() }}</p>
                  <p v-if="product.description" class="text-xs text-slate-500 line-clamp-2 mt-2">{{ product.description }}</p>
                  <div class="mt-3 flex gap-2 text-xs font-bold text-slate-500">
                    <span v-if="product.specs.length" class="inline-flex items-center gap-1">
                      <span class="material-symbols-outlined text-sm">info</span>
                      {{ product.specs.length }} specs
                    </span>
                    <span v-if="product.gallery.length" class="inline-flex items-center gap-1">
                      <span class="material-symbols-outlined text-sm">image</span>
                      {{ product.gallery.length }} images
                    </span>
                  </div>
                </div>
                <span class="material-symbols-outlined text-slate-400 text-2xl self-center">edit</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="searchResults.length === 0 && !isSearching" class="text-center py-12">
          <span class="material-symbols-outlined text-6xl text-slate-200 flex justify-center mb-4">folder_open</span>
          <p class="text-slate-400 font-medium">{{ searchQuery ? 'No products found' : 'Search for a product to get started' }}</p>
        </div>
      </div>

      <!-- Edit Form -->
      <div v-if="isEditing && selectedProduct" class="space-y-8">
        <div class="flex items-center gap-4 mb-6">
          <button
            @click="cancelEdit"
            class="p-2 text-slate-400 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-all"
          >
            <span class="material-symbols-outlined">arrow_back</span>
          </button>
          <h2 class="text-2xl font-black text-slate-900">
            Edit: <span class="text-purple-600">{{ selectedProduct.name }}</span>
          </h2>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Edit Form -->
          <div class="lg:col-span-2 space-y-8">
            <!-- Basic Info -->
            <div class="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 space-y-6">
              <h3 class="text-xl font-black text-slate-900 flex items-center gap-2">
                <span class="material-symbols-outlined">edit_note</span>
                Product Information
              </h3>

              <div class="space-y-4">
                <div>
                  <label class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Name</label>
                  <input
                    v-model="editForm.name"
                    type="text"
                    class="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none transition-all"
                    :disabled="isSaving"
                  />
                </div>

                <div>
                  <label class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Price (NGN)</label>
                  <input
                    v-model="editForm.price"
                    type="number"
                    class="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none transition-all"
                    :disabled="isSaving"
                  />
                </div>

                <div>
                  <label class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Description</label>
                  <textarea
                    v-model="editForm.description"
                    rows="5"
                    class="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none transition-all resize-none"
                    :disabled="isSaving"
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Specs -->
            <div class="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 space-y-6">
              <div class="flex items-center justify-between">
                <h3 class="text-xl font-black text-slate-900 flex items-center gap-2">
                  <span class="material-symbols-outlined">list_alt</span>
                  Technical Specs
                </h3>
                <button
                  type="button"
                  @click="addSpecRow"
                  class="px-3 py-2 bg-purple-50 text-purple-700 font-black rounded-xl border border-purple-100 hover:bg-purple-100 transition-all text-xs uppercase"
                  :disabled="isSaving"
                >
                  + Add
                </button>
              </div>

              <div class="space-y-3">
                <div v-for="(spec, index) in editForm.specs" :key="index" class="flex gap-3">
                  <input
                    v-model="spec.label"
                    type="text"
                    placeholder="Label"
                    class="w-1/3 px-4 py-3 rounded-xl border-2 border-slate-100 focus:ring-2 focus:ring-purple-500/20 outline-none text-sm"
                    :disabled="isSaving"
                  />
                  <input
                    v-model="spec.value"
                    type="text"
                    placeholder="Value"
                    class="flex-1 px-4 py-3 rounded-xl border-2 border-slate-100 focus:ring-2 focus:ring-purple-500/20 outline-none text-sm"
                    :disabled="isSaving"
                  />
                  <button
                    v-if="editForm.specs.length > 1"
                    type="button"
                    @click="removeSpecRow(index)"
                    class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    :disabled="isSaving"
                  >
                    <span class="material-symbols-outlined">close</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Product Preview -->
          <div class="lg:col-span-1">
            <div class="bg-gradient-to-br from-purple-600 to-purple-700 rounded-3xl shadow-xl p-8 text-white sticky top-8">
              <h3 class="text-lg font-black mb-6">Preview</h3>

              <div v-if="selectedProduct.imageUrl" class="w-full h-40 rounded-2xl bg-white/10 overflow-hidden mb-6">
                <img :src="selectedProduct.imageUrl" :alt="selectedProduct.name" class="w-full h-full object-cover" />
              </div>

              <div class="space-y-4">
                <div>
                  <p class="text-xs text-purple-200 uppercase font-bold">Name</p>
                  <p class="text-lg font-black truncate">{{ editForm.name }}</p>
                </div>

                <div>
                  <p class="text-xs text-purple-200 uppercase font-bold">Price</p>
                  <p class="text-2xl font-black text-purple-100">₦{{ Number(editForm.price).toLocaleString() }}</p>
                </div>

                <div v-if="editForm.specs.some(s => s.label && s.value)">
                  <p class="text-xs text-purple-200 uppercase font-bold mb-2">Specs</p>
                  <div class="space-y-2">
                    <div v-for="(spec, i) in editForm.specs" :key="i" v-if="spec.label && spec.value" class="flex justify-between text-xs">
                      <span class="text-purple-100">{{ spec.label }}</span>
                      <span class="text-purple-50 font-bold">{{ spec.value }}</span>
                    </div>
                  </div>
                </div>

                <div v-if="selectedProduct.gallery.length" class="pt-4 border-t border-white/20">
                  <p class="text-xs text-purple-200 uppercase font-bold mb-2">Gallery</p>
                  <p class="text-sm text-purple-100">{{ selectedProduct.gallery.length }} additional images</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-4 justify-center flex-wrap">
          <button
            @click="cancelEdit"
            :disabled="isSaving || isDeleting"
            class="px-8 py-4 bg-slate-200 text-slate-900 font-black rounded-2xl hover:bg-slate-300 transition-all disabled:opacity-50"
          >
            Back
          </button>
          <button
            @click="confirmDelete"
            :disabled="isSaving || isDeleting"
            class="px-8 py-4 bg-red-100 text-red-700 font-black rounded-2xl hover:bg-red-200 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <span class="material-symbols-outlined">delete</span>
            Delete Product
          </button>
          <button
            @click="saveChanges"
            :disabled="isSaving || isDeleting"
            class="px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-black rounded-2xl hover:from-purple-700 hover:to-purple-800 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <span v-if="isSaving" class="animate-spin border-2 border-white/30 border-t-white w-4 h-4 rounded-full"></span>
            {{ isSaving ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full animate-in fade-in slide-in-from-bottom-4">
          <div class="flex items-center gap-3 mb-6 text-red-600">
            <span class="material-symbols-outlined text-4xl">warning</span>
            <h3 class="text-2xl font-black">Delete Product?</h3>
          </div>

          <p class="text-slate-600 mb-2">
            You're about to permanently delete:
          </p>
          <p class="text-lg font-black text-slate-900 mb-6 break-words">
            "{{ selectedProduct.name }}"
          </p>

          <div class="bg-red-50 rounded-2xl p-4 mb-8 border border-red-200">
            <p class="text-sm text-red-700 font-medium">
              <strong>⚠️ This action cannot be undone.</strong> The product will be permanently removed from the database.
            </p>
          </div>

          <div class="flex gap-3">
            <button
              @click="showDeleteConfirm = false"
              :disabled="isDeleting"
              class="flex-1 px-6 py-3 bg-slate-200 text-slate-900 font-black rounded-2xl hover:bg-slate-300 transition-all disabled:opacity-50"
            >
              Keep It
            </button>
            <button
              @click="deleteProduct"
              :disabled="isDeleting"
              class="flex-1 px-6 py-3 bg-red-600 text-white font-black rounded-2xl hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span v-if="isDeleting" class="animate-spin border-2 border-white/30 border-t-white w-4 h-4 rounded-full"></span>
              {{ isDeleting ? 'Deleting...' : 'Yes, Delete' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 600, 'GRAD' 0, 'opsz' 24;
}
</style>
