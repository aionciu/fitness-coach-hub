export type SessionStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled'

export interface Session {
  id: string
  tenant_id: string
  client_id: string
  workout_id: string | null
  title: string
  description: string | null
  scheduled_at: string
  duration_minutes: number | null
  status: SessionStatus
  notes: string | null
  created_by: string | null
  created_at: string
  updated_at: string
  // Joined data
  client?: {
    id: string
    first_name: string
    last_name: string
    email: string | null
    phone: string | null
    avatar_url: string | null
  }
  workout?: {
    id: string
    name: string
    description: string | null
    duration_minutes: number | null
    difficulty_level: number | null
  }
  session_exercises?: SessionExercise[]
}

export interface SessionExercise {
  id: string
  session_id: string
  exercise_id: string
  order_index: number
  sets: number | null
  reps: number | null
  weight_kg: number | null
  duration_seconds: number | null
  rest_seconds: number | null
  is_completed: boolean
  notes: string | null
  created_at: string
  updated_at: string
  // Joined data
  exercise?: {
    id: string
    name: string
    description: string | null
    type: 'strength' | 'cardio' | 'flexibility' | 'balance' | 'sport'
    muscle_groups: string[]
    equipment: string[]
    instructions: string | null
  }
}

export interface CreateSessionData {
  tenant_id: string
  client_id: string
  workout_id?: string | null
  title: string
  description?: string | null
  scheduled_at: string
  duration_minutes?: number | null
  status?: SessionStatus
  notes?: string | null
  created_by?: string | null
}

export interface UpdateSessionData {
  client_id?: string
  workout_id?: string | null
  title?: string
  description?: string | null
  scheduled_at?: string
  duration_minutes?: number | null
  status?: SessionStatus
  notes?: string | null
}

export interface SessionStats {
  total_sessions: number
  scheduled_sessions: number
  in_progress_sessions: number
  completed_sessions: number
  cancelled_sessions: number
  upcoming_sessions: number
  today_sessions: number
}

export interface SessionFilters {
  status?: SessionStatus
  client_id?: string
  date_from?: string
  date_to?: string
  search?: string
}

export interface SessionFormData {
  client_id: string
  workout_id: string | null | undefined
  title: string
  description: string
  scheduled_at: string
  duration_minutes: number | null
  notes: string
}
