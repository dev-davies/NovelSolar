export default defineNuxtPlugin((nuxtApp) => {
  const csrfToken = useCookie('csrf-token')

  const $customFetch = $fetch.create({
    onRequest({ request, options }) {
      const method = options.method ? options.method.toUpperCase() : 'GET'
      // For mutating API requests, inject the CSRF token
      if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
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
