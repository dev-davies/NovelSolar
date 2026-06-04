<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = withDefaults(
  defineProps<{
    src: string
    alt?: string
    imageClass?: string
    skeletonClass?: string
    useNuxtImg?: boolean
    loadedClass?: string
  }>(),
  {
    alt: '',
    imageClass: 'object-cover',
    skeletonClass: 'bg-slate-200 animate-pulse',
    useNuxtImg: false,
    loadedClass: 'bg-transparent',
  },
)

const isLoaded = ref(false)
const imageRef = ref<any>(null)

const handleLoad = () => {
  isLoaded.value = true
}

onMounted(() => {
  if (imageRef.value) {
    const el = imageRef.value.$el || imageRef.value
    if (el && el.complete) {
      isLoaded.value = true
    }
  }
})
</script>

<template>
  <div class="relative overflow-hidden transition-colors duration-500" :class="isLoaded ? loadedClass : skeletonClass">
    <NuxtImg
      v-if="useNuxtImg"
      ref="imageRef"
      :src="src"
      :alt="alt"
      loading="lazy"
      format="webp"
      class="w-full h-full absolute inset-0 transition-opacity duration-500"
      :class="[imageClass, isLoaded ? 'opacity-100' : 'opacity-0']"
      @load="handleLoad"
    />
    <img
      v-else
      ref="imageRef"
      :src="src"
      :alt="alt"
      loading="lazy"
      class="w-full h-full absolute inset-0 transition-opacity duration-500"
      :class="[imageClass, isLoaded ? 'opacity-100' : 'opacity-0']"
      @load="handleLoad"
    />
  </div>
</template>
