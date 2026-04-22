// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@nuxt/image", "@vueuse/nuxt", "@nuxt/content", "@nuxtjs/sitemap", "@nuxtjs/supabase"],
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
    domains: ["nisl.bitrix24.com", "res.cloudinary.com"],
    format: ["webp", "avif"],
    quality: 80,
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
    sanity: {
      projectId: 'u2k0ma15'
    }
  },
  css: ["~/assets/css/main.css"],
  app: {
    head: {
      title: 'Novel Solar: Leading Solar Energy Company in Nigeria - novelsolar',
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
      whatsappNumber: process.env.NUXT_PUBLIC_WHATSAPP_NUMBER || '2348022119908',
      whatsappNumberFormatted: process.env.NUXT_PUBLIC_WHATSAPP_NUMBER_FORMATTED || '+234 802 211 9908',
      baseUrl: process.env.NUXT_PUBLIC_BASE_URL || 'https://novel-solar.vercel.app',
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '',
      supabaseAnonKey:
        process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY ||
        process.env.NUXT_PUBLIC_SUPABASE_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
        process.env.SUPABASE_ANON_KEY ||
        process.env.SUPABASE_PUBLISHABLE_KEY ||
        '',
    }
  },
  supabase: {
    url: process.env.NUXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
    key:
      process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NUXT_PUBLIC_SUPABASE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.SUPABASE_ANON_KEY ||
      process.env.SUPABASE_PUBLISHABLE_KEY,
    // Disable the module's global redirect so unauthenticated users can
    // freely browse the shop and checkout. Auth is only enforced on
    // /admin pages via the custom admin middleware.
    redirect: false,
  },
  nitro: {
    storage: {
      rateLimit: {
        driver: (process.env.NODE_ENV === 'production' && process.env.KV_REST_API_URL) ? 'vercel-kv' : 'memory',
      },
      // The 'otp' namespace will automatically use Vercel KV in production if linked
      otp: {
        driver: (process.env.NODE_ENV === 'production' && process.env.KV_REST_API_URL) ? 'vercel-kv' : 'memory',
      },
      adminSessions: {
        driver: (process.env.NODE_ENV === 'production' && process.env.KV_REST_API_URL) ? 'vercel-kv' : 'memory',
      },
      userSessions: {
        driver: (process.env.NODE_ENV === 'production' && process.env.KV_REST_API_URL) ? 'vercel-kv' : 'memory',
      },
    }
  },
});
