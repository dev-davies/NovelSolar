<script setup lang="ts">
definePageMeta({ middleware: 'admin' })

useHead({
  title: 'Manage Admins | Novel Solar Admin',
  meta: [{ name: 'description', content: 'Create and manage admin accounts.' }]
})

const handleLogout = async () => {
  try {
    await $fetch('/api/admin/auth/logout', { method: 'POST' })
    await navigateTo('/admin/login')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto">
      <div class="mb-10 text-center relative">
        <h1 class="text-4xl font-black text-slate-900 mb-2 tracking-tight">Manage Admins</h1>
        <p class="text-slate-500 font-medium italic">Create new admin accounts and review access levels.</p>

        <div class="absolute top-0 right-0 flex items-center gap-3">
          <NuxtLink to="/admin/change-password" class="px-4 py-2 bg-red-50 border border-red-200 hover:bg-red-100 text-red-700 rounded-xl font-bold flex items-center gap-2 text-sm transition-all shadow-sm">
            <span class="material-symbols-outlined text-sm">lock_reset</span>
            Change Password
          </NuxtLink>
          <NuxtLink to="/admin/add-product" class="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold flex items-center gap-2 text-sm transition-all shadow-sm">
            <span class="material-symbols-outlined text-sm">add_box</span>
            Add Products
          </NuxtLink>
          <NuxtLink to="/admin/manage-products" class="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold flex items-center gap-2 text-sm transition-all shadow-sm">
            <span class="material-symbols-outlined text-sm">inventory_2</span>
            Manage Inventory
          </NuxtLink>
          <button @click="handleLogout" class="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold flex items-center gap-2 text-sm transition-all">
            <span class="material-symbols-outlined text-sm">logout</span>
            Logout
          </button>
        </div>
      </div>

      <AdminManagement />
    </div>
  </div>
</template>
