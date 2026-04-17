import { defineVitestConfig } from '@nuxt/test-utils/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineVitestConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
    exclude: ['e2e/**', '**/node_modules/**', '**/dist/**'],
  },
  define: {
    'import.meta.client': true,
    'import.meta.server': false,
    'import.meta.dev': true,
  },
  resolve: {
    alias: {
      '~': resolve('./app'),
      '@': resolve('./app'),
      '#components': resolve('./app/components'),
    },
  },
  vue: {
    template: {
      compilerOptions: {
        isCustomElement: (tag) => tag.startsWith('Nuxt')
      }
    }
  }
})