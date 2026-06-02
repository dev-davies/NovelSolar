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
