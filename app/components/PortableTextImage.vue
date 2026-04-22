<script setup lang="ts">
import type { PortableTextImageValue } from '~/types'

const { urlFor } = useSanityImage()
const props = defineProps<{
  value: PortableTextImageValue
}>()
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
