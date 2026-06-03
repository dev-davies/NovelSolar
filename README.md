# NovelSolar

NovelSolar is a Nuxt application for a solar commerce and service platform. It includes a storefront, product catalog, checkout flow, admin inventory tools, and supporting content pages.

The app integrates with Bitrix for CRM workflows and acts as the source of truth for products. A background Nitro task synchronizes the product catalog from Bitrix to a localized Supabase mirror for lightning-fast reads and filtering, keeping the frontend performant. It also uses Supabase for authentication and admin account management, Cloudinary for product media, and Nuxt Content for editorial pages.

## Stack

- Nuxt 4 (with Nitro background tasks & CRON)
- Vue 3
- Tailwind CSS
- Supabase (PostgreSQL for session storage and localized product mirroring)
- Bitrix24 (CRM & Webhooks)
- Cloudinary
- Vitest
- Playwright

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run test
npm run test:run
npm run test:e2e
```
