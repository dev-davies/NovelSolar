// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@nuxt/image", "@vueuse/nuxt", "@nuxtjs/sanity"],
  image: {
    domains: ["nisl.bitrix24.com"],
    sanity: {
      projectId: 'u2k0ma15'
    }
  },
  css: ["~/assets/css/main.css"],
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { 
          rel: 'stylesheet', 
          href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap' 
        }
      ]
    }
  },
  runtimeConfig: {
    bitrixWebhookUrl: process.env.BITRIX_WEBHOOK_URL,
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT,
    smtpUser: process.env.SMTP_USER,
    smtpPass: process.env.SMTP_PASS,
    smtpFrom: process.env.SMTP_FROM,
    public: {
      baseUrl: process.env.NUXT_PUBLIC_BASE_URL || 'https://novel-solar.vercel.app',
    }
  },
  nitro: {
    storage: {
      // The 'otp' namespace will automatically use Vercel KV in production
      otp: {
        driver: process.env.NODE_ENV === 'production' ? 'vercel-kv' : 'memory',
      }
    }
  },
  sanity: {
    projectId: 'u2k0ma15',
    dataset: 'production',
    useCdn: false,
    apiVersion: '2025-01-01',
  },
});
