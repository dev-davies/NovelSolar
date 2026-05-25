<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Header -->
    <header class="bg-white border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-black text-slate-900 tracking-tight">Control Center</h1>
          <p class="text-slate-500 mt-1 font-medium">Welcome back to the Novel Solar admin dashboard.</p>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener"
          class="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold px-5 py-3 rounded-xl transition-colors self-start sm:self-auto"
        >
          <span class="material-symbols-outlined text-base">open_in_new</span>
          View Live Site
        </a>
      </div>
    </header>

    <!-- Quick Action Cards -->
    <main class="max-w-7xl mx-auto px-6 py-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <template v-for="card in cards" :key="card.title">
          <NuxtLink
            v-if="!card.disabled"
            :to="card.to"
            class="group relative overflow-hidden bg-white rounded-3xl border border-slate-200 p-8 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <span
              class="material-symbols-outlined absolute -top-4 -right-4 text-[140px] leading-none opacity-5 pointer-events-none select-none"
              :class="card.decorClass"
            >
              {{ card.icon }}
            </span>

            <div class="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 relative z-10" :class="card.iconBg">
              <span class="material-symbols-outlined text-3xl" :class="card.iconColor">
                {{ card.icon }}
              </span>
            </div>

            <h2 class="text-xl font-black text-slate-900 mb-2 tracking-tight relative z-10">
              {{ card.title }}
            </h2>
            <p class="text-sm text-slate-500 leading-relaxed font-medium relative z-10">
              {{ card.subtitle }}
            </p>

            <div
              class="mt-auto pt-6 flex items-center gap-2 text-sm font-bold uppercase tracking-widest relative z-10"
              :class="card.linkColor"
            >
              Open
              <span class="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </div>
          </NuxtLink>

          <div
            v-else
            class="relative overflow-hidden bg-white rounded-3xl border border-slate-200 p-8 flex flex-col opacity-60 cursor-not-allowed"
          >
            <span
              class="material-symbols-outlined absolute -top-4 -right-4 text-[140px] leading-none opacity-5 pointer-events-none select-none"
              :class="card.decorClass"
            >
              {{ card.icon }}
            </span>

            <div class="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 relative z-10" :class="card.iconBg">
              <span class="material-symbols-outlined text-3xl" :class="card.iconColor">
                {{ card.icon }}
              </span>
            </div>

            <h2 class="text-xl font-black text-slate-900 mb-2 tracking-tight relative z-10">
              {{ card.title }}
            </h2>
            <p class="text-sm text-slate-500 leading-relaxed font-medium relative z-10">
              {{ card.subtitle }}
            </p>

            <div
              class="mt-auto pt-6 flex items-center gap-2 text-sm font-bold uppercase tracking-widest relative z-10 text-slate-400"
            >
              Master Admin Only
              <span class="material-symbols-outlined text-base"> block </span>
            </div>
          </div>
        </template>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
definePageMeta({ middleware: 'admin' })

useHead({ title: 'Dashboard | Novel Solar Admin' })

const isMasterAdmin = ref(false)

const cards = computed(() => [
  {
    to: '/admin/manage-products',
    title: 'Manage Products',
    subtitle: 'Update prices, edit technical specifications, adjust stock status, and delete old listings.',
    icon: 'inventory_2',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    decorClass: 'text-blue-500',
    linkColor: 'text-blue-600',
    disabled: false,
  },
  {
    to: '/admin/add-product',
    title: 'Add Product',
    subtitle: 'List a new inverter, battery, or solar panel to the store with full specifications and imagery.',
    icon: 'add_box',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    decorClass: 'text-emerald-500',
    linkColor: 'text-emerald-600',
    disabled: false,
  },
  {
    to: '/admin/manage-blog',
    title: 'Blog Manager',
    subtitle: 'Write, edit, and publish SEO-optimized articles, guides, and company insights.',
    icon: 'edit_note',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    decorClass: 'text-purple-500',
    linkColor: 'text-purple-600',
    disabled: false,
  },
  {
    to: isMasterAdmin.value ? '/admin/manage-admins' : undefined,
    title: 'Access Control',
    subtitle: isMasterAdmin.value
      ? 'Create new admin accounts and revoke access for team members.'
      : 'Master admins can manage access control. Regular admins can view this option but cannot open it.',
    icon: 'shield_person',
    iconBg: isMasterAdmin.value ? 'bg-amber-100' : 'bg-slate-100',
    iconColor: isMasterAdmin.value ? 'text-amber-600' : 'text-slate-400',
    decorClass: isMasterAdmin.value ? 'text-amber-500' : 'text-slate-200',
    linkColor: isMasterAdmin.value ? 'text-amber-600' : 'text-slate-400',
    disabled: !isMasterAdmin.value,
  },
])

onMounted(async () => {
  try {
    const response = await useNuxtApp().$apiFetch('/api/admin/me')
    isMasterAdmin.value = !!response.admin?.is_master
  } catch (error) {
    console.error('Failed to load admin role:', error)
  }
})
</script>
