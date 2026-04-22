export default defineNuxtPlugin((nuxtApp) => {
  const csrfToken = useCookie('csrf-token')

  const $customFetch = $fetch.create({
    async onRequest({ request, options }) {
      const method = options.method ? options.method.toUpperCase() : 'GET'
      // For mutating API requests, inject the CSRF token
      if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
        // If no CSRF cookie exists yet (e.g. first visit, static page from CDN),
        // make a lightweight GET to /api/health to trigger the server middleware
        // that distributes the token cookie.
        if (!csrfToken.value && import.meta.client) {
          await $fetch('/api/health', { method: 'GET' }).catch(() => {})
          // Re-read the cookie after the GET response sets it
          csrfToken.value = useCookie('csrf-token').value
        }
        if (csrfToken.value) {
          options.headers = {
            ...options.headers,
            'x-csrf-token': csrfToken.value
          }
        }
      }
    }
  })

  // Provide it so $fetch behavior in components uses this custom fetch
  // but we can just override globalThis.$fetch so we don't have to refactor everything
  globalThis.$fetch = $customFetch
})
