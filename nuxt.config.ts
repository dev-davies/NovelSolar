// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@bitrix24/b24ui-nuxt"],
  css: ["~/assets/css/tailwind.css"],
  runtimeConfig: {
    bitrixWebhook: process.env.BITRIX_WEBHOOK_URL,
  },
});
