import { defineNuxtPlugin } from '#app'
import { useErrorLogger } from '~/composables/useErrorLogger'

export default defineNuxtPlugin((nuxtApp) => {
  const { setupGlobalErrorHandler, trackNuxtError, trackVueError } = useErrorLogger()
  const cleanup = setupGlobalErrorHandler()
  const previousErrorHandler = nuxtApp.vueApp.config.errorHandler

  nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
    void trackVueError(error as Error, info)

    if (previousErrorHandler) {
      previousErrorHandler(error, instance, info)
    }
  }

  nuxtApp.hook('app:error', (error) => {
    void trackNuxtError(error, {
      phase: 'app:error'
    })
  })

  nuxtApp.hook('page:finish', () => {
    if (!cleanup) return
    nuxtApp.hook('app:beforeMount', () => cleanup())
  })
})
