<script setup lang="ts">
definePageMeta({ middleware: 'admin' })

useHead({
  title: 'Rejected Dealers | Novel Solar Admin',
})

const { addToast } = useToast()

const dealers = ref<Record<string, unknown>[]>([])
const isLoading = ref(true)

const trashedDealers = computed(() => {
  return dealers.value.filter((d) => d.status === 'rejected')
})

const fetchDealers = async () => {
  isLoading.value = true
  try {
    const response = await useNuxtApp().$apiFetch<{ dealers: Record<string, unknown>[] }>('/api/admin/dealers')
    dealers.value = response.dealers as Record<string, unknown>[]
  } catch (err: unknown) {
    addToast('Error', 'Failed to fetch dealers', 'error')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchDealers()
})
</script>

<template>
  <div class="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <div class="mb-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div class="text-center lg:text-left flex items-center gap-4">
          <NuxtLink
            to="/admin/manage-dealers"
            class="p-2 -ml-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-200 transition-colors"
            title="Back to Active Dealers"
          >
            <span class="material-symbols-outlined text-3xl">arrow_back</span>
          </NuxtLink>
          <div>
            <h1 class="text-4xl font-black text-slate-900 mb-2 tracking-tight flex items-center gap-3">
              <span class="material-symbols-outlined text-red-500 text-4xl">delete</span>
              Rejected Dealers
            </h1>
            <p class="text-slate-500 font-medium italic">
              View dealer applications that have been removed or rejected.
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div v-if="isLoading" class="p-12 text-center text-slate-500 font-bold">
          <div class="w-8 h-8 border-4 border-red-600/20 border-t-red-600 rounded-full animate-spin mx-auto mb-4" />
          Loading rejected applications...
        </div>

        <div v-else-if="trashedDealers.length === 0" class="p-12 text-center flex flex-col items-center">
          <div class="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border border-slate-100">
            <span class="material-symbols-outlined text-3xl text-slate-300">check_circle</span>
          </div>
          <h4 class="text-lg font-bold text-slate-900 mb-1">Trash is Empty</h4>
          <p class="text-slate-500 font-medium">There are currently no rejected dealer applications.</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200">
                <th class="p-4 text-xs font-black text-slate-500 uppercase tracking-widest">Business</th>
                <th class="p-4 text-xs font-black text-slate-500 uppercase tracking-widest">Contact</th>
                <th class="p-4 text-xs font-black text-slate-500 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr
                v-for="dealer in trashedDealers"
                :key="dealer.id"
                class="hover:bg-slate-50/50 transition-colors opacity-75"
              >
                <td class="p-4">
                  <p class="font-bold text-slate-900 line-through">{{ dealer.business_name }}</p>
                  <p class="text-sm text-slate-500">{{ dealer.email }}</p>
                </td>
                <td class="p-4">
                  <p class="font-medium text-slate-700">{{ dealer.contact_name }}</p>
                  <p class="text-sm text-slate-500">{{ dealer.phone }}</p>
                </td>
                <td class="p-4">
                  <span
                    class="px-2.5 py-1 text-xs font-black uppercase tracking-wider rounded-full bg-red-100 text-red-700"
                  >
                    {{ dealer.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.material-symbols-outlined {
  font-variation-settings:
    'FILL' 0,
    'wght' 400,
    'GRAD' 0,
    'opsz' 48;
}
</style>
