export default defineNuxtRouteMiddleware((to, from) => {
  // Check for the non-HTTP-only cookie that indicates admin status
  const adminAuth = useCookie('admin_auth_status');

  if (!adminAuth.value) {
    // If not authenticated, redirect to login page
    return navigateTo('/admin/login');
  }
});
