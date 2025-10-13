import { createClientClient } from '@/lib/supabase'
import { 
  Session, 
  CreateSessionData, 
  UpdateSessionData, 
  SessionStats, 
  SessionFilters
} from '@/lib/types/session'

export class SessionAPI {
  private supabase = createClientClient()

  async getSessions(filters?: SessionFilters): Promise<Session[]> {
    let query = this.supabase
      .from('sessions')
      .select(`
        *,
        client:clients(id, first_name, last_name, email, phone, avatar_url),
        workout:workouts(id, name, description, duration_minutes, difficulty_level),
        session_exercises(
          *,
          exercise:exercises(id, name, description, type, muscle_groups, equipment, instructions)
        )
      `)
      .order('scheduled_at', { ascending: true })

    if (filters) {
      if (filters.status) {
        query = query.eq('status', filters.status)
      }
      if (filters.client_id) {
        query = query.eq('client_id', filters.client_id)
      }
      if (filters.date_from) {
        query = query.gte('scheduled_at', filters.date_from)
      }
      if (filters.date_to) {
        query = query.lte('scheduled_at', filters.date_to)
      }
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
      }
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching sessions:', error)
      throw new Error('Failed to fetch sessions')
    }

    return data || []
  }

  async getSession(id: string): Promise<Session | null> {
    const { data, error } = await this.supabase
      .from('sessions')
      .select(`
        *,
        client:clients(id, first_name, last_name, email, phone, avatar_url),
        workout:workouts(id, name, description, duration_minutes, difficulty_level),
        session_exercises(
          *,
          exercise:exercises(id, name, description, type, muscle_groups, equipment, instructions)
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching session:', error)
      return null
    }

    return data
  }

  async createSession(sessionData: Omit<CreateSessionData, 'tenant_id' | 'created_by'>): Promise<Session> {
    try {
      // Get the current user to determine tenant_id and created_by
      const { data: { user }, error: authError } = await this.supabase.auth.getUser()
      
      if (authError) {
        console.error('Auth error:', authError)
        throw new Error('Authentication error: ' + authError.message)
      }
      
      if (!user) {
        throw new Error('User not authenticated')
      }

      // Get user's tenant_id
      const { data: userData, error: userError } = await this.supabase
        .from('users')
        .select('tenant_id')
        .eq('id', user.id)
        .single()

      if (userError) {
        console.error('Error fetching user tenant:', userError)
        throw new Error('Failed to determine user tenant: ' + userError.message)
      }

      if (!userData) {
        throw new Error('User data not found')
      }

      const fullSessionData = {
        ...sessionData,
        tenant_id: userData.tenant_id,
        created_by: user.id,
        status: sessionData.status || 'scheduled'
      }

      const { data, error } = await this.supabase
        .from('sessions')
        .insert([fullSessionData])
        .select(`
          *,
          client:clients(id, first_name, last_name, email, phone, avatar_url),
          workout:workouts(id, name, description, duration_minutes, difficulty_level)
        `)
        .single()

      if (error) {
        console.error('Error creating session:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        throw new Error('Failed to create session: ' + error.message)
      }

      if (!data) {
        throw new Error('No data returned from session creation')
      }

      return data
    } catch (error) {
      console.error('Unexpected error in createSession:', error)
      throw error
    }
  }

  async updateSession(id: string, sessionData: UpdateSessionData): Promise<Session> {
    try {
      // Get the current user to ensure RLS works properly
      const { data: { user } } = await this.supabase.auth.getUser()
      
      if (!user) {
        throw new Error('User not authenticated')
      }

      const { data, error } = await this.supabase
        .from('sessions')
        .update(sessionData)
        .eq('id', id)
        .select(`
          *,
          client:clients(id, first_name, last_name, email, phone, avatar_url),
          workout:workouts(id, name, description, duration_minutes, difficulty_level)
        `)
        .single()

      if (error) {
        console.error('Error updating session:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        throw new Error('Failed to update session: ' + error.message)
      }

      if (!data) {
        throw new Error('No data returned from session update')
      }

      return data
    } catch (error) {
      console.error('Unexpected error in updateSession:', error)
      throw error
    }
  }

  async deleteSession(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('sessions')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting session:', error)
      throw new Error('Failed to delete session')
    }
  }

  async updateSessionStatus(id: string, status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'): Promise<Session> {
    return this.updateSession(id, { status })
  }

  async getSessionStats(): Promise<SessionStats> {
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000)

    const [
      { data: totalData, error: totalError },
      { data: scheduledData, error: scheduledError },
      { data: inProgressData, error: inProgressError },
      { data: completedData, error: completedError },
      { data: cancelledData, error: cancelledError },
      { data: upcomingData, error: upcomingError },
      { data: todayData, error: todayError }
    ] = await Promise.all([
      this.supabase.from('sessions').select('id', { count: 'exact' }),
      this.supabase.from('sessions').select('id', { count: 'exact' }).eq('status', 'scheduled'),
      this.supabase.from('sessions').select('id', { count: 'exact' }).eq('status', 'in_progress'),
      this.supabase.from('sessions').select('id', { count: 'exact' }).eq('status', 'completed'),
      this.supabase.from('sessions').select('id', { count: 'exact' }).eq('status', 'cancelled'),
      this.supabase.from('sessions').select('id', { count: 'exact' }).gte('scheduled_at', now.toISOString()),
      this.supabase.from('sessions').select('id', { count: 'exact' })
        .gte('scheduled_at', todayStart.toISOString())
        .lt('scheduled_at', todayEnd.toISOString())
    ])

    if (totalError || scheduledError || inProgressError || completedError || cancelledError || upcomingError || todayError) {
      console.error('Error fetching session stats:', { 
        totalError, scheduledError, inProgressError, completedError, 
        cancelledError, upcomingError, todayError 
      })
      throw new Error('Failed to fetch session statistics')
    }

    return {
      total_sessions: totalData?.length || 0,
      scheduled_sessions: scheduledData?.length || 0,
      in_progress_sessions: inProgressData?.length || 0,
      completed_sessions: completedData?.length || 0,
      cancelled_sessions: cancelledData?.length || 0,
      upcoming_sessions: upcomingData?.length || 0,
      today_sessions: todayData?.length || 0,
    }
  }

  async getSessionsByDateRange(startDate: string, endDate: string): Promise<Session[]> {
    const { data, error } = await this.supabase
      .from('sessions')
      .select(`
        *,
        client:clients(id, first_name, last_name, email, phone, avatar_url),
        workout:workouts(id, name, description, duration_minutes, difficulty_level)
      `)
      .gte('scheduled_at', startDate)
      .lte('scheduled_at', endDate)
      .order('scheduled_at', { ascending: true })

    if (error) {
      console.error('Error fetching sessions by date range:', error)
      throw new Error('Failed to fetch sessions by date range')
    }

    return data || []
  }

  async getUpcomingSessions(limit: number = 10): Promise<Session[]> {
    const { data, error } = await this.supabase
      .from('sessions')
      .select(`
        *,
        client:clients(id, first_name, last_name, email, phone, avatar_url),
        workout:workouts(id, name, description, duration_minutes, difficulty_level)
      `)
      .gte('scheduled_at', new Date().toISOString())
      .in('status', ['scheduled', 'in_progress'])
      .order('scheduled_at', { ascending: true })
      .limit(limit)

    if (error) {
      console.error('Error fetching upcoming sessions:', error)
      throw new Error('Failed to fetch upcoming sessions')
    }

    return data || []
  }

  async searchSessions(query: string): Promise<Session[]> {
    const { data, error } = await this.supabase
      .from('sessions')
      .select(`
        *,
        client:clients(id, first_name, last_name, email, phone, avatar_url),
        workout:workouts(id, name, description, duration_minutes, difficulty_level)
      `)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order('scheduled_at', { ascending: true })

    if (error) {
      console.error('Error searching sessions:', error)
      throw new Error('Failed to search sessions')
    }

    return data || []
  }

  async bulkUpdateSessions(sessionIds: string[], updates: UpdateSessionData): Promise<void> {
    const { error } = await this.supabase
      .from('sessions')
      .update(updates)
      .in('id', sessionIds)

    if (error) {
      console.error('Error bulk updating sessions:', error)
      throw new Error('Failed to bulk update sessions')
    }
  }

  async bulkDeleteSessions(sessionIds: string[]): Promise<void> {
    const { error } = await this.supabase
      .from('sessions')
      .delete()
      .in('id', sessionIds)

    if (error) {
      console.error('Error bulk deleting sessions:', error)
      throw new Error('Failed to bulk delete sessions')
    }
  }
}

export const sessionAPI = new SessionAPI()

