<script setup lang="ts">
definePageMeta({ middleware: 'admin' })

useHead({
  title: 'Manage Dealers | Novel Solar Admin',
})

const { addToast } = useToast()

const dealers = ref<Record<string, unknown>[]>([])
const isLoading = ref(true)
const isActionLoading = ref<Record<string, boolean>>({})

const fetchDealers = async () => {
  isLoading.value = true
  try {
    const response = await useNuxtApp().$apiFetch<{ dealers: Record<string, unknown>[] }>('/api/admin/dealers')
    dealers.value = response.dealers as Record<string, unknown>[]
  } catch (error: unknown) {
    addToast('Error', 'Failed to fetch dealers', 'error')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchDealers()
})

const handleLogout = async () => {
  try {
    await useNuxtApp().$apiFetch('/api/admin/auth/logout', { method: 'POST' })
    await navigateTo('/admin/login')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

// Invitation flow has been removed in favor of passwordless OTP
const approveDealer = async (applicationId: string) => {
  isActionLoading.value[applicationId] = true
  try {
    await useNuxtApp().$apiFetch('/api/admin/approve-dealer', {
      method: 'POST',
      body: { applicationId },
    })
    addToast('Success', 'Dealer approved and invitation sent!', 'success')
    await fetchDealers()
  } catch (err: unknown) {
    const error = err as { statusMessage?: string }
    addToast('Error', error.statusMessage || 'Failed to approve dealer', 'error')
  } finally {
    isActionLoading.value[applicationId] = false
  }
}

const rejectDealer = async (applicationId: string) => {
  // Not fully implemented on backend in this request
  addToast('Info', 'Reject functionality coming soon.', 'info')
}

const isExpired = (invitation: Record<string, unknown> | null | undefined) => {
  if (!invitation) return false
  if (invitation.used) return false
  return new Date(invitation.expires_at as string) < new Date()
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <div class="mb-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div class="text-center lg:text-left">
          <h1 class="text-4xl font-black text-slate-900 mb-2 tracking-tight">Manage Dealers</h1>
          <p class="text-slate-500 font-medium italic">Review applications and manage dealer invitations.</p>
        </div>

        <div class="flex flex-wrap justify-center lg:justify-end items-center gap-3">
          <NuxtLink
            to="/admin"
            class="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold flex items-center gap-2 text-sm transition-all shadow-sm"
          >
            Dashboard Home
          </NuxtLink>
          <button
            class="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold flex items-center gap-2 text-sm transition-all"
            @click="handleLogout"
          >
            Logout
          </button>
        </div>
      </div>

      <div class="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div v-if="isLoading" class="p-12 text-center text-slate-500 font-bold">
          <div class="w-8 h-8 border-4 border-[#002888]/20 border-t-[#002888] rounded-full animate-spin mx-auto mb-4" />
          Loading dealers...
        </div>

        <div v-else-if="dealers.length === 0" class="p-12 text-center text-slate-500 font-medium">
          No dealer applications found.
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200">
                <th class="p-4 text-xs font-black text-slate-500 uppercase tracking-widest">Business</th>
                <th class="p-4 text-xs font-black text-slate-500 uppercase tracking-widest">Contact</th>
                <th class="p-4 text-xs font-black text-slate-500 uppercase tracking-widest">Status</th>
                <th class="p-4 text-xs font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="dealer in dealers" :key="dealer.id" class="hover:bg-slate-50/50 transition-colors">
                <td class="p-4">
                  <p class="font-bold text-slate-900">{{ dealer.business_name }}</p>
                  <p class="text-sm text-slate-500">{{ dealer.email }}</p>
                </td>
                <td class="p-4">
                  <p class="font-medium text-slate-700">{{ dealer.contact_name }}</p>
                  <p class="text-sm text-slate-500">{{ dealer.phone }}</p>
                </td>
                <td class="p-4">
                  <span
                    :class="[
                      'px-2.5 py-1 text-xs font-black uppercase tracking-wider rounded-full',
                      dealer.status === 'approved'
                        ? 'bg-green-100 text-green-700'
                        : dealer.status === 'rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-amber-100 text-amber-700',
                    ]"
                  >
                    {{ dealer.status }}
                  </span>
                </td>
                <td class="p-4 text-right">
                  <div v-if="dealer.status === 'pending'" class="flex items-center justify-end">
                    <button
                      class="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1.5 rounded transition-colors mr-2 disabled:opacity-50 inline-flex items-center gap-1.5 shadow-sm font-bold tracking-wider uppercase"
                      :disabled="isActionLoading[dealer.id as string]"
                      @click="approveDealer(dealer.id as string)"
                    >
                      <span
                        v-if="isActionLoading[dealer.id as string]"
                        class="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"
                      />
                      Approve
                    </button>
                    <button
                      class="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1.5 rounded transition-colors disabled:opacity-50 shadow-sm font-bold tracking-wider uppercase"
                      :disabled="isActionLoading[dealer.id as string]"
                      @click="rejectDealer(dealer.id as string)"
                    >
                      Reject
                    </button>
                  </div>
                  <div v-else class="text-xs text-slate-400 font-medium italic">Account Active</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
