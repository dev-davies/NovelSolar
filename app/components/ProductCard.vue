<script setup>
const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const getProductImage = (product) => {
  if (!product) return '/images/placeholder.png';

  // 1. Look for our new Cloudinary slot
  const cloudinaryField = product.PROPERTY_102;

  if (cloudinaryField) {
    // Bitrix often returns custom strings inside an array of objects
    if (Array.isArray(cloudinaryField) && cloudinaryField.length > 0) {
      return cloudinaryField[0].value;
    }
    // Just in case it returns it as a direct string
    if (typeof cloudinaryField === 'string') {
      return cloudinaryField;
    }
  }

  // 2. Fallback to older Bitrix image proxy logic
  const legacyField = product.PROPERTY_44 || product.PREVIEW_PICTURE || product.DETAIL_PICTURE;
  if (legacyField) {
    const relativeUrl = legacyField.showUrl || legacyField.downloadUrl;
    if (relativeUrl) {
      const fullBitrixUrl = `https://nisl.bitrix24.com${relativeUrl}`;
      return `/api/bitrix-image?url=${encodeURIComponent(fullBitrixUrl)}`;
    }
    if (typeof legacyField === 'string' && legacyField.startsWith('http')) {
      return legacyField;
    }
  }

  // 3. Fallback if no picture is available
  return '/images/placeholder.png';
}
</script>

<template>
  <NuxtLink :to="'/shop/' + (product.ID || product.id)" class="group flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer h-full">
    <!-- Image Container -->
    <div class="relative aspect-square bg-gray-50 flex items-center justify-center p-6 border-b border-gray-50">
      <span class="absolute top-4 left-4 bg-green-50 text-green-600 text-xs font-extrabold px-3 py-1 rounded-md tracking-wide z-10">IN STOCK</span>

      <div class="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500 overflow-hidden">
        <img
          :src="getProductImage(product)"
          :alt="product.NAME"
          class="w-full h-full object-contain p-4"
          loading="lazy"
        />
      </div>
    </div>

    <div class="p-6 flex-1 flex flex-col justify-center">
      <h3 class="font-bold text-slate-900 text-sm md:text-base leading-snug line-clamp-2 group-hover:text-[#002888] transition-colors">
        {{ product.NAME || product.name || product.title }}
      </h3>
      
      <div v-if="product.PRICE || product.price" class="mt-2 text-lg font-black text-slate-900">
        {{ Number(product.PRICE || product.price).toLocaleString() }} 
        <span class="text-xs font-semibold text-slate-500 uppercase ml-1">NGN</span>
      </div>
    </div>
  </NuxtLink>
</template>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 48;
}
</style>
