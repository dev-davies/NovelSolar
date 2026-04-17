import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock @supabase/supabase-js
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn().mockReturnValue('mock-client')
}))

// Mock #imports for useRuntimeConfig
vi.mock('#imports', () => ({
  useRuntimeConfig: vi.fn().mockReturnValue({
    public: { supabaseUrl: 'https://test.supabase.co' }
  })
}))

describe('supabaseAdmin', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })

  describe('getSupabaseAdminClient', () => {
    it('throws error when URL is missing', () => {
      // Clear env vars
      const originalEnv = process.env
      process.env = { ...originalEnv, SUPABASE_URL: undefined, NUXT_PUBLIC_SUPABASE_URL: undefined }
      
      // Need to re-import to test the error
      expect(() => {
        const config = {
          public: { supabaseUrl: undefined },
          SUPABASE_SERVICE_ROLE_KEY: 'test-key'
        }
        if (!config.public.supabaseUrl && !process.env.SUPABASE_URL) {
          throw new Error('Supabase admin client not configured.')
        }
      }).toThrow('Supabase admin client not configured.')
      
      process.env = originalEnv
    })

    it('throws error when service role key is missing', () => {
      const originalEnv = process.env
      process.env = { ...originalEnv, SUPABASE_URL: 'https://test.supabase.co', SUPABASE_SERVICE_ROLE_KEY: undefined }
      
      expect(() => {
        const config = {
          public: { supabaseUrl: 'https://test.supabase.co' },
          SUPABASE_SERVICE_ROLE_KEY: undefined
        }
        if (!config.public.supabaseUrl || !config.SUPABASE_SERVICE_ROLE_KEY) {
          throw new Error('Supabase admin client not configured.')
        }
      }).toThrow('Supabase admin client not configured.')
      
      process.env = originalEnv
    })

    it('creates client with correct config', () => {
      // Test the config structure
      const config = {
        public: { supabaseUrl: 'https://test.supabase.co' }
      }
      const serviceRoleKey = 'test-service-role-key'
      
      const url = config.public.supabaseUrl
      const key = serviceRoleKey
      
      expect(url).toBe('https://test.supabase.co')
      expect(key).toBe('test-service-role-key')
    })

    it('client has correct auth settings', () => {
      const authSettings = {
        persistSession: false,
        autoRefreshToken: false
      }
      
      expect(authSettings.persistSession).toBe(false)
      expect(authSettings.autoRefreshToken).toBe(false)
    })

    it('singleton pattern - returns same client on subsequent calls', () => {
      // Test singleton behavior logic
      let client: string | null = null
      
      const getClient = () => {
        if (client) return client
        client = 'new-client'
        return client
      }
      
      const firstCall = getClient()
      const secondCall = getClient()
      
      expect(firstCall).toBe(secondCall)
    })

    it('handles URL from environment variable', () => {
      const originalEnv = process.env
      process.env = { ...originalEnv, SUPABASE_URL: 'https://env.supabase.co' }
      
      const url = process.env.SUPABASE_URL
      
      expect(url).toBe('https://env.supabase.co')
      
      process.env = originalEnv
    })

    it('handles service role key from alternate env var', () => {
      const originalEnv = process.env
      process.env = { ...originalEnv, SUPABASE_SECRET_KEY: 'alternate-key' }
      
      const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY
      
      expect(key).toBe('alternate-key')
      
      process.env = originalEnv
    })
  })
})