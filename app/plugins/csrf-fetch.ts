export default defineNuxtPlugin(() => {
  const csrfToken = useCookie('csrf-token')

  const apiFetch = $fetch.create({
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
          const headers = new Headers(options.headers as HeadersInit)
          headers.set('x-csrf-token', csrfToken.value)
          options.headers = headers
        }
      }
    }
  })

  return {
    provide: {
      apiFetch
    }
  }
})
