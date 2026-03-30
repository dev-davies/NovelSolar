<template>
  <div>
    <component v-if="activeComponent" :is="activeComponent" />
    
    <!-- Fallback / Coming Soon state for unmapped partners -->
    <div v-else class="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 p-8 text-center pt-32 pb-32">
      <div class="w-24 h-24 bg-white rounded-full shadow-md flex items-center justify-center mb-8 border border-gray-100">
        <svg class="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
      <h1 class="text-4xl font-black text-[#002888] mb-4 tracking-tight">
        Partner Gateway: <span class="uppercase text-gray-900">{{ formattedBrand }}</span>
      </h1>
      <p class="text-xl text-gray-500 max-w-2xl font-medium leading-relaxed mb-8 inline-block">
        We are actively preparing the dedicated official portal for <strong class="text-gray-900">{{ formattedBrand }}</strong>. Check back soon to explore their complete line of advanced energy solutions.
      </p>
      <div>
        <NuxtLink to="/partners" class="inline-flex items-center gap-2 bg-[#002888] text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-900 transition-colors shadow-lg active:scale-95">
          &larr; Return to All Partners
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'nuxt/app'

// Explicit imports to avoid Nuxt auto-prefix ambiguity
import PartnerItel from '~/components/partners/PartnerItel.vue'
import PartnerHaisic from '~/components/partners/PartnerHaisic.vue'
import PartnerYinergy from '~/components/partners/PartnerYinergy.vue'
import PartnerLivoltek from '~/components/partners/PartnerLivoltek.vue'
import PartnerHithium from '~/components/partners/PartnerHithium.vue'

const route = useRoute()

const formattedBrand = computed(() => {
  const b = route.params.brand as string
  return b ? b.charAt(0).toUpperCase() + b.slice(1) : ''
})

const componentMap: Record<string, any> = {
  itel: PartnerItel,
  haisic: PartnerHaisic,
  yinergy: PartnerYinergy,
  livoltek: PartnerLivoltek,
  hithium: PartnerHithium
}

const activeComponent = computed(() => {
  const b = route.params.brand as string
  return b ? (componentMap[b.toLowerCase()] || null) : null
})

useHead({
  title: `${formattedBrand.value} Portal | NovelSolar Partner`,
  meta: [
    { name: 'description', content: `Official NovelSolar partner portal for ${formattedBrand.value}` }
  ]
})
</script>
