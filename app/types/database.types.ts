export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          role: string
          dealer_status: 'none' | 'pending' | 'approved' | 'rejected'
          [key: string]: any
        }
        Insert: {
          role?: string
          dealer_status?: 'none' | 'pending' | 'approved' | 'rejected'
          [key: string]: any
        }
        Update: {
          role?: string
          dealer_status?: 'none' | 'pending' | 'approved' | 'rejected'
          [key: string]: any
        }
      }
      dealer_applications: {
        Row: {
          id: string
          business_name: string
          contact_name: string
          email: string
          phone: string
          address: string
          status: 'pending' | 'approved' | 'rejected'
          created_at: string
          previous_work_urls: string[]
          former_purchase_url: string | null
        }
        Insert: {
          id?: string
          business_name: string
          contact_name: string
          email: string
          phone: string
          address: string
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          previous_work_urls?: string[]
          former_purchase_url?: string | null
        }
        Update: {
          id?: string
          business_name?: string
          contact_name?: string
          email?: string
          phone?: string
          address?: string
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          previous_work_urls?: string[]
          former_purchase_url?: string | null
        }
      }
      dealer_invitations: {
        Row: {
          id: string
          email: string
          token: string
          expires_at: string
          used: boolean
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          token: string
          expires_at: string
          used?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          token?: string
          expires_at?: string
          used?: boolean
          created_at?: string
        }
      }
      [key: string]: {
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
