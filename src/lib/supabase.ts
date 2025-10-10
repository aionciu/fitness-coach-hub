import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Client component client
export const createClientClient = () => createBrowserClient(supabaseUrl, supabaseAnonKey)

// Database types (will be generated later with Supabase CLI)
export type Database = {
  public: {
    Tables: {
      tenants: {
        Row: {
          id: string
          name: string
          logo_url: string | null
          color_theme: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          logo_url?: string | null
          color_theme?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          logo_url?: string | null
          color_theme?: string
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          tenant_id: string
          email: string
          full_name: string
          avatar_url: string | null
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          email: string
          full_name: string
          avatar_url?: string | null
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          email?: string
          full_name?: string
          avatar_url?: string | null
          role?: string
          created_at?: string
          updated_at?: string
        }
      }
      clients: {
        Row: {
          id: string
          tenant_id: string
          first_name: string
          last_name: string
          email: string | null
          phone: string | null
          avatar_url: string | null
          date_of_birth: string | null
          height_cm: number | null
          weight_kg: number | null
          goals: string | null
          notes: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          first_name: string
          last_name: string
          email?: string | null
          phone?: string | null
          avatar_url?: string | null
          date_of_birth?: string | null
          height_cm?: number | null
          weight_kg?: number | null
          goals?: string | null
          notes?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          first_name?: string
          last_name?: string
          email?: string | null
          phone?: string | null
          avatar_url?: string | null
          date_of_birth?: string | null
          height_cm?: number | null
          weight_kg?: number | null
          goals?: string | null
          notes?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      session_status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
      exercise_type: 'strength' | 'cardio' | 'flexibility' | 'balance' | 'sport'
      progress_metric: 'weight' | 'reps' | 'sets' | 'duration' | 'distance' | 'custom'
    }
  }
}
