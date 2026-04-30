import { useRouter, useState } from '#imports'

export const useBitrixNavigation = () => {
  const isBitrixContext = useState('isBitrixContext')
  const router = useRouter()

  /**
   * Initializes global navigation watchers.
   * Call this once in the main layout's onMounted hook.
   */
  const initBitrixNavigation = () => {
    if (!import.meta.client) return

    // Sync Nuxt client-side routing with the Bitrix24 Slider title
    router.afterEach((to) => {
      if (isBitrixContext.value && typeof (window as any).BX24 !== 'undefined') {
        const pageTitle = (to.meta.title as string) || to.name?.toString().replace(/-/g, ' ') || 'NovelSolar'
        // Capitalize first letter
        const formattedTitle = pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1)
        
        try {
          ;(window as any).BX24.setTitle(formattedTitle)
        } catch (e) {
          console.warn('Failed to set Bitrix24 title:', e)
        }
      }
    })

    // Intercept clicks to prevent jumping out of the iframe for _blank target links
    // if they are internal application links.
    document.addEventListener('click', (e) => {
      if (!isBitrixContext.value) return

      const target = e.target as HTMLElement
      const anchor = target.closest('a')

      if (anchor) {
        const targetAttr = anchor.getAttribute('target')
        const href = anchor.getAttribute('href')

        // If an internal link is trying to break out of the iframe (target="_blank"),
        // intercept it and route internally instead, keeping them in the Bitrix slider.
        if (targetAttr === '_blank' && href && href.startsWith('/')) {
          e.preventDefault()
          
          if (typeof (window as any).BX24 !== 'undefined') {
             // We can optionally use BX24.openApplication if we want a fresh slider,
             // but keeping it within the current SPA Nuxt router is faster.
             router.push(href)
          } else {
             router.push(href)
          }
        }
      }
    })
  }

  /**
   * Helper to programmatically navigate. Can be used in templates.
   */
  const navigateInBitrix = (path: string) => {
    if (isBitrixContext.value && typeof (window as any).BX24 !== 'undefined') {
      // If we strictly want to reload the app with a specific path via Bitrix SDK
      // ;(window as any).BX24.openApplication({ path })
      
      // Usually, using Vue Router is preferred for speed
      router.push(path)
    } else {
      router.push(path)
    }
  }

  return {
    initBitrixNavigation,
    navigateInBitrix
  }
}
