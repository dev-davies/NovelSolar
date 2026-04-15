import { createClient } from '@supabase/supabase-js'

type SupabaseAdminClient = ReturnType<typeof createClient>

let client: SupabaseAdminClient | null = null

export function getSupabaseAdminClient(): SupabaseAdminClient {
  if (client) return client

  const config = useRuntimeConfig()
  const url =
    config.public.supabaseUrl ||
    process.env.NUXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL

  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY

  if (!url || !serviceRoleKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Supabase admin client not configured.'
    })
  }

  client = createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  })

  return client
}
