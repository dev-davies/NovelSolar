export default defineNuxtRouteMiddleware(async (to) => {
  // Only check on the client-side to prevent SSR header issues
  if (import.meta.client) {
    try {
      // Ping the server to check if our admin_token cookie is valid
      await $fetch('/api/admin/auth/verify')
    } catch (error) {
      // If the server throws a 401 Unauthorized, the cookie is invalid or expired
      return navigateTo('/admin/login')
    }
  }
})
