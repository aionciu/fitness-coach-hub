export interface Client {
  id: string
  tenant_id: string
  first_name: string
  last_name: string
  email?: string
  phone?: string
  avatar_url?: string
  date_of_birth?: string
  height_cm?: number
  weight_kg?: number
  goals?: string
  notes?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreateClientData {
  tenant_id: string
  first_name: string
  last_name: string
  email?: string
  phone?: string
  avatar_url?: string
  date_of_birth?: string | undefined
  height_cm?: number
  weight_kg?: number
  goals?: string
  notes?: string
}

export interface UpdateClientData extends Partial<CreateClientData> {
  is_active?: boolean
}

export interface ClientStats {
  total_clients: number
  active_clients: number
  inactive_clients: number
  recent_clients: number // clients added in last 30 days
}

