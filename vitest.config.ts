import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
  resolve: {
    alias: {
      '#app': resolve('./node_modules/nuxt/dist/app'),
      '~': resolve('./app'),
      '@': resolve('./app'),
    },
  },
})