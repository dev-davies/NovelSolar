<script setup>
const { urlFor } = useSanityImage()
const props = defineProps({
  value: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="my-10 w-full overflow-hidden rounded-2xl shadow-lg border border-slate-50">
    <img 
      v-if="value?.asset"
      :src="urlFor(value).width(1200).url()" 
      class="w-full h-auto object-cover"
      loading="lazy"
    />
  </div>
</template>
