<script setup>
const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

// PROPERTY_44 is the actual "More Photo" property used for product images in this Bitrix instance
// DETAIL_PICTURE / PREVIEW_PICTURE are kept as fallbacks (both are null on most CRM products)
// Resolve Bitrix picture object (which has restricted URLs) to our local authorized proxy
const imageUrl = computed(() => {
  return getBitrixImageUrl(props.product.PROPERTY_44) ||
         getBitrixImageUrl(props.product.PREVIEW_PICTURE) ||
         getBitrixImageUrl(props.product.DETAIL_PICTURE);
})
const getSecureImage = (bitrixUrl) => {
  if (!bitrixUrl) return '/images/placeholder.png'
  return `/api/bitrix-image?url=${encodeURIComponent(bitrixUrl)}`
}
</script>

<template>
  <NuxtLink :to="'/shop/' + (product.ID || product.id)" class="group flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer h-full">
    <!-- Image Container -->
    <div class="relative aspect-square bg-gray-50 flex items-center justify-center p-6 border-b border-gray-50">
      <span class="absolute top-4 left-4 bg-green-50 text-green-600 text-xs font-extrabold px-3 py-1 rounded-md tracking-wide z-10">IN STOCK</span>

      <div class="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500 overflow-hidden">
        <img
          :src="getSecureImage(imageUrl)"
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
