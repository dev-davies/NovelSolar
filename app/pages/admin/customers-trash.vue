<script setup lang="ts">
definePageMeta({ middleware: 'admin' })

useHead({
  title: 'Deleted Customers | Novel Solar Admin',
})

const { data, pending, error } = useFetch('/api/admin/customers-trash')

const trashedCustomers = computed(() => {
  return data.value?.customers || []
})
</script>

<template>
  <div class="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <div class="mb-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div class="text-center lg:text-left flex items-center gap-4">
          <NuxtLink
            to="/admin/manage-customers"
            class="p-2 -ml-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-200 transition-colors"
            title="Back to Active Customers"
          >
            <span class="material-symbols-outlined text-3xl">arrow_back</span>
          </NuxtLink>
          <div>
            <h1 class="text-4xl font-black text-slate-900 mb-2 tracking-tight flex items-center gap-3">
              <span class="material-symbols-outlined text-red-500 text-4xl">delete</span>
              Trashed Customers
            </h1>
            <p class="text-slate-500 font-medium italic">View customer accounts that have been removed.</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div v-if="pending" class="p-12 text-center text-slate-500 font-bold">
          <div class="w-8 h-8 border-4 border-red-600/20 border-t-red-600 rounded-full animate-spin mx-auto mb-4" />
          Loading trashed customers...
        </div>

        <div v-else-if="error" class="bg-red-50 text-red-600 p-6 m-6 rounded-2xl border border-red-100 mb-8">
          <div class="flex items-center gap-3 font-bold mb-1">
            <span class="material-symbols-outlined">error</span>
            Failed to load trashed customers
          </div>
          <p class="text-sm opacity-90">{{ error.message }}</p>
        </div>

        <div v-else-if="trashedCustomers.length === 0" class="p-12 text-center flex flex-col items-center">
          <div class="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border border-slate-100">
            <span class="material-symbols-outlined text-3xl text-slate-300">check_circle</span>
          </div>
          <h4 class="text-lg font-bold text-slate-900 mb-1">Trash is Empty</h4>
          <p class="text-slate-500 font-medium">There are currently no trashed customers.</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200">
                <th class="p-4 text-xs font-black text-slate-500 uppercase tracking-widest">Name</th>
                <th class="p-4 text-xs font-black text-slate-500 uppercase tracking-widest">Email</th>
                <th class="p-4 text-xs font-black text-slate-500 uppercase tracking-widest">Previous Role</th>
                <th class="p-4 text-xs font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr
                v-for="customer in trashedCustomers"
                :key="customer.id"
                class="hover:bg-slate-50/50 transition-colors opacity-75"
              >
                <td class="p-4">
                  <p class="font-bold text-slate-900 line-through">
                    {{
                      customer.first_name || customer.last_name
                        ? `${customer.first_name || ''} ${customer.last_name || ''}`
                        : 'Unknown'
                    }}
                  </p>
                </td>
                <td class="p-4">
                  <p class="text-sm text-slate-500">{{ customer.email }}</p>
                </td>
                <td class="p-4">
                  <span
                    class="px-2.5 py-1 text-xs font-black uppercase tracking-wider rounded-full bg-slate-100 text-slate-700"
                  >
                    {{
                      customer.dealer_status !== 'none' && customer.dealer_status !== 'rejected' ? 'Dealer' : 'Customer'
                    }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <NuxtLink
                    :to="'/admin/customers/' + customer.id"
                    class="inline-flex items-center gap-1.5 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
                    @click.stop
                  >
                    View Profile
                    <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </NuxtLink>
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
