// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@nuxt/image", "@vueuse/nuxt", "@nuxt/content", "@nuxtjs/sitemap"],
  site: {
    url: 'https://novelsolar.com',
    name: 'Novel Solar'
  },
  sitemap: {
    strictNuxtContentPaths: true,
    exclude: [
      '/admin/**', // Keep the admin dashboard out of Google
      '/checkout',
      '/thank-you'
    ]
  },
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
    adminUploadPasscode: process.env.ADMIN_UPLOAD_PASSCODE,
    bitrixWebhookUrl: process.env.BITRIX_WEBHOOK_URL,
    otpSecret: process.env.OTP_SECRET,
    authSessionSecret: process.env.AUTH_SESSION_SECRET,
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
      },
      adminSessions: {
        driver: process.env.NODE_ENV === 'production' ? 'vercel-kv' : 'memory',
      },
      userSessions: {
        driver: process.env.NODE_ENV === 'production' ? 'vercel-kv' : 'memory',
      },
    }
  },
});
