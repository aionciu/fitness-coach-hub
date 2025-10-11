import { createClientClient } from '@/lib/supabase'
import { Client, CreateClientData, UpdateClientData, ClientStats } from '@/lib/types/client'

export class ClientAPI {
  private supabase = createClientClient()

  async getClients(): Promise<Client[]> {
    const { data, error } = await this.supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching clients:', error)
      throw new Error('Failed to fetch clients')
    }

    return data || []
  }

  async getClient(id: string): Promise<Client | null> {
    const { data, error } = await this.supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching client:', error)
      return null
    }

    return data
  }

  async createClient(clientData: Omit<CreateClientData, 'tenant_id'>): Promise<Client> {
    try {
      // Get the current user to determine tenant_id
      const { data: { user }, error: authError } = await this.supabase.auth.getUser()
      
      if (authError) {
        console.error('Auth error:', authError)
        throw new Error('Authentication error: ' + authError.message)
      }
      
      if (!user) {
        throw new Error('User not authenticated')
      }

      console.log('Creating client for user:', user.id)

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

      console.log('User tenant_id:', userData.tenant_id)
      
      // Filter out undefined values to avoid database errors
      const cleanedClientData = Object.fromEntries(
        Object.entries({ ...clientData, tenant_id: userData.tenant_id }).filter(
          ([_, value]) => value !== undefined && value !== ''
        )
      )
      
      console.log('Client data to insert:', cleanedClientData)

      const { data, error } = await this.supabase
        .from('clients')
        .insert([cleanedClientData])
        .select()
        .single()

      if (error) {
        console.error('Error creating client:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        throw new Error('Failed to create client: ' + error.message)
      }

      if (!data) {
        throw new Error('No data returned from client creation')
      }

      return data
    } catch (error) {
      console.error('Unexpected error in createClient:', error)
      throw error
    }
  }

  async updateClient(id: string, clientData: UpdateClientData): Promise<Client> {
    try {
      // Get the current user to ensure RLS works properly
      const { data: { user } } = await this.supabase.auth.getUser()
      
      if (!user) {
        throw new Error('User not authenticated')
      }

      console.log('Updating client:', id, 'with data:', clientData)
      
      const { data, error } = await this.supabase
        .from('clients')
        .update(clientData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating client:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        throw new Error('Failed to update client: ' + error.message)
      }

      if (!data) {
        throw new Error('No data returned from client update')
      }

      console.log('Client updated successfully:', data)
      return data
    } catch (error) {
      console.error('Unexpected error in updateClient:', error)
      throw error
    }
  }

  async deleteClient(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('clients')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting client:', error)
      throw new Error('Failed to delete client')
    }
  }

  async searchClients(query: string): Promise<Client[]> {
    const { data, error } = await this.supabase
      .from('clients')
      .select('*')
      .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%`)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error searching clients:', error)
      throw new Error('Failed to search clients')
    }

    return data || []
  }

  async getClientStats(): Promise<ClientStats> {
    const { data: totalData, error: totalError } = await this.supabase
      .from('clients')
      .select('id', { count: 'exact' })

    const { data: activeData, error: activeError } = await this.supabase
      .from('clients')
      .select('id', { count: 'exact' })
      .eq('is_active', true)

    const { data: recentData, error: recentError } = await this.supabase
      .from('clients')
      .select('id', { count: 'exact' })
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

    if (totalError || activeError || recentError) {
      console.error('Error fetching client stats:', { totalError, activeError, recentError })
      throw new Error('Failed to fetch client statistics')
    }

    return {
      total_clients: totalData?.length || 0,
      active_clients: activeData?.length || 0,
      inactive_clients: (totalData?.length || 0) - (activeData?.length || 0),
      recent_clients: recentData?.length || 0,
    }
  }

  async bulkUpdateClients(clientIds: string[], updates: UpdateClientData): Promise<void> {
    const { error } = await this.supabase
      .from('clients')
      .update(updates)
      .in('id', clientIds)

    if (error) {
      console.error('Error bulk updating clients:', error)
      throw new Error('Failed to bulk update clients')
    }
  }

  async bulkDeleteClients(clientIds: string[]): Promise<void> {
    const { error } = await this.supabase
      .from('clients')
      .delete()
      .in('id', clientIds)

    if (error) {
      console.error('Error bulk deleting clients:', error)
      throw new Error('Failed to bulk delete clients')
    }
  }
}

export const clientAPI = new ClientAPI()
