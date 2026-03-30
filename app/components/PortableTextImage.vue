<script setup>
defineProps({
  value: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="my-10 w-full overflow-hidden rounded-2xl shadow-lg">
    <SanityImage 
      v-if="value?.asset?._ref"
      :asset-id="value.asset._ref" 
      auto="format" 
      class="w-full h-auto object-cover"
    />
  </div>
</template>
