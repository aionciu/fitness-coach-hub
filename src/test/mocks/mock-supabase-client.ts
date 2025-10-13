import { vi } from 'vitest'
import type { Session, CreateSessionData, UpdateSessionData, SessionStats, SessionFilters } from '@/lib/types/session'
import type { Client } from '@/lib/types/client'

export interface MockDatabase {
  [tableName: string]: any[]
}

export interface MockSupabaseClient {
  from: (table: string) => MockQueryBuilder
  auth: {
    getUser: () => Promise<{ data: { user: any | null }, error: any }>
    signInWithPassword: (credentials: any) => Promise<{ data: any, error: any }>
    signUp: (credentials: any) => Promise<{ data: any, error: any }>
    signOut: () => Promise<{ error: any }>
  }
  rpc: (functionName: string, params?: any) => Promise<{ data: any, error: any }>
}

export interface MockQueryBuilder {
  select: (columns?: string) => MockQueryBuilder
  insert: (data: any) => MockQueryBuilder
  update: (data: any) => MockQueryBuilder
  delete: () => MockQueryBuilder
  eq: (column: string, value: any) => MockQueryBuilder
  neq: (column: string, value: any) => MockQueryBuilder
  gt: (column: string, value: any) => MockQueryBuilder
  gte: (column: string, value: any) => MockQueryBuilder
  lt: (column: string, value: any) => MockQueryBuilder
  lte: (column: string, value: any) => MockQueryBuilder
  like: (column: string, pattern: string) => MockQueryBuilder
  ilike: (column: string, pattern: string) => MockQueryBuilder
  in: (column: string, values: any[]) => MockQueryBuilder
  is: (column: string, value: any) => MockQueryBuilder
  or: (query: string) => MockQueryBuilder
  and: (query: string) => MockQueryBuilder
  order: (column: string, options?: { ascending?: boolean }) => MockQueryBuilder
  limit: (count: number) => MockQueryBuilder
  range: (from: number, to: number) => MockQueryBuilder
  single: () => Promise<{ data: any, error: any }>
  maybeSingle: () => Promise<{ data: any, error: any }>
  count: (type?: string) => Promise<{ count: number, error: any }>
}

export class MockSupabaseHttpClient {
  private database: MockDatabase = {}
  private rpcFunctions: Map<string, Function> = new Map()
  private errorTriggers: Map<string, Function> = new Map()
  private currentUser: any = null

  constructor(initialData?: MockDatabase) {
    if (initialData) {
      this.database = { ...initialData }
    }
  }

  // Database operations
  insert(table: string, data: any[] | any): { data: any, error: any } {
    try {
      const tableData = this.database[table] || []
      const insertData = Array.isArray(data) ? data : [data]
      
      // Add timestamps
      const now = new Date().toISOString()
      const processedData = insertData.map((item, index) => ({
        ...item,
        id: item.id || `${table}_${Date.now()}_${index}`,
        created_at: item.created_at || now,
        updated_at: item.updated_at || now,
      }))

      this.database[table] = [...tableData, ...processedData]
      
      return {
        data: processedData.length === 1 ? processedData[0] : processedData,
        error: null
      }
    } catch (error) {
      return {
        data: null,
        error: { message: 'Insert failed', details: error }
      }
    }
  }

  select(table: string, columns?: string, filters: any = {}): { data: any, error: any } {
    try {
      let tableData = this.database[table] || []
      
      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          tableData = tableData.filter((item: any) => {
            if (key === 'or') {
              // Handle OR queries (simplified)
              const orConditions = (value as string).split(',')
              return orConditions.some(condition => {
                const [col, op, val] = condition.trim().split('.')
                if (op === 'ilike') {
                  return item[col]?.toLowerCase().includes(val.replace(/%/g, '').toLowerCase())
                }
                return item[col] === val
              })
            }
            return item[key] === value
          })
        }
      })

      // Handle column selection (simplified - just return all for now)
      return {
        data: tableData,
        error: null
      }
    } catch (error) {
      return {
        data: null,
        error: { message: 'Select failed', details: error }
      }
    }
  }

  update(table: string, data: any, filters: any = {}): { data: any, error: any } {
    try {
      const tableData = this.database[table] || []
      const now = new Date().toISOString()
      
      const updatedData = tableData.map((item: any) => {
        // Check if item matches filters
        const matches = Object.entries(filters).every(([key, value]) => 
          value === undefined || value === null || item[key] === value
        )
        
        if (matches) {
          return {
            ...item,
            ...data,
            updated_at: now
          }
        }
        return item
      })

      this.database[table] = updatedData
      
      return {
        data: updatedData.filter((item: any) => 
          Object.entries(filters).every(([key, value]) => 
            value === undefined || value === null || item[key] === value
          )
        ),
        error: null
      }
    } catch (error) {
      return {
        data: null,
        error: { message: 'Update failed', details: error }
      }
    }
  }

  delete(table: string, filters: any = {}): { data: any, error: any } {
    try {
      const tableData = this.database[table] || []
      
      const filteredData = tableData.filter((item: any) => 
        !Object.entries(filters).every(([key, value]) => 
          value === undefined || value === null || item[key] === value
        )
      )

      this.database[table] = filteredData
      
      return {
        data: null,
        error: null
      }
    } catch (error) {
      return {
        data: null,
        error: { message: 'Delete failed', details: error }
      }
    }
  }

  // RPC functions
  registerRpcFunction(name: string, handler: Function) {
    this.rpcFunctions.set(name, handler)
  }

  async callRpc(functionName: string, params: any = {}): Promise<{ data: any, error: any }> {
    try {
      const handler = this.rpcFunctions.get(functionName)
      if (!handler) {
        return {
          data: null,
          error: { message: `RPC function '${functionName}' not found` }
        }
      }

      const result = await handler(params, this.database)
      return {
        data: result,
        error: null
      }
    } catch (error) {
      return {
        data: null,
        error: { message: 'RPC call failed', details: error }
      }
    }
  }

  // Auth operations
  setCurrentUser(user: any) {
    this.currentUser = user
  }

  getCurrentUser() {
    return this.currentUser
  }

  // Error simulation
  setErrorTrigger(table: string, operation: string, handler: Function) {
    this.errorTriggers.set(`${table}:${operation}`, handler)
  }

  // Create mock client
  createMockClient(): MockSupabaseClient {
    const self = this

    return {
      from: (table: string) => ({
        select: (columns?: string) => ({
          eq: (column: string, value: any) => ({
            single: () => Promise.resolve(
              self.select(table, columns, { [column]: value }).data?.[0] 
                ? { data: self.select(table, columns, { [column]: value }).data[0], error: null }
                : { data: null, error: { message: 'No rows found' } }
            ),
            order: (col: string, options?: { ascending?: boolean }) => ({
              eq: (col2: string, val2: any) => ({
                single: () => Promise.resolve(
                  self.select(table, columns, { [column]: value, [col2]: val2 }).data?.[0] 
                    ? { data: self.select(table, columns, { [column]: value, [col2]: val2 }).data[0], error: null }
                    : { data: null, error: { message: 'No rows found' } }
                )
              }),
              gte: (col2: string, val2: any) => ({
                lte: (col3: string, val3: any) => ({
                  single: () => Promise.resolve(
                    self.select(table, columns, { [column]: value, [col2]: val2, [col3]: val3 }).data?.[0] 
                      ? { data: self.select(table, columns, { [column]: value, [col2]: val2, [col3]: val3 }).data[0], error: null }
                      : { data: null, error: { message: 'No rows found' } }
                  )
                })
              }),
              limit: (count: number) => ({
                single: () => Promise.resolve(
                  self.select(table, columns, { [column]: value }).data?.[0] 
                    ? { data: self.select(table, columns, { [column]: value }).data[0], error: null }
                    : { data: null, error: { message: 'No rows found' } }
                )
              })
            }),
            gte: (col2: string, val2: any) => ({
              lte: (col3: string, val3: any) => ({
                single: () => Promise.resolve(
                  self.select(table, columns, { [column]: value, [col2]: val2, [col3]: val3 }).data?.[0] 
                    ? { data: self.select(table, columns, { [column]: value, [col2]: val2, [col3]: val3 }).data[0], error: null }
                    : { data: null, error: { message: 'No rows found' } }
                )
              })
            }),
            in: (col2: string, vals: any[]) => ({
              single: () => Promise.resolve(
                self.select(table, columns, { [column]: value, [col2]: vals }).data?.[0] 
                  ? { data: self.select(table, columns, { [column]: value, [col2]: vals }).data[0], error: null }
                  : { data: null, error: { message: 'No rows found' } }
              )
            })
          }),
          order: (column: string, options?: { ascending?: boolean }) => ({
            eq: (col: string, val: any) => ({
              single: () => Promise.resolve(
                self.select(table, columns, { [col]: val }).data?.[0] 
                  ? { data: self.select(table, columns, { [col]: val }).data[0], error: null }
                  : { data: null, error: { message: 'No rows found' } }
              )
            }),
            gte: (col: string, val: any) => ({
              lte: (col2: string, val2: any) => ({
                single: () => Promise.resolve(
                  self.select(table, columns, { [col]: val, [col2]: val2 }).data?.[0] 
                    ? { data: self.select(table, columns, { [col]: val, [col2]: val2 }).data[0], error: null }
                    : { data: null, error: { message: 'No rows found' } }
                )
              })
            }),
            limit: (count: number) => ({
              single: () => Promise.resolve(
                self.select(table, columns).data?.[0] 
                  ? { data: self.select(table, columns).data[0], error: null }
                  : { data: null, error: { message: 'No rows found' } }
              )
            })
          }),
          gte: (column: string, value: any) => ({
            lte: (col2: string, val2: any) => ({
              single: () => Promise.resolve(
                self.select(table, columns, { [column]: value, [col2]: val2 }).data?.[0] 
                  ? { data: self.select(table, columns, { [column]: value, [col2]: val2 }).data[0], error: null }
                  : { data: null, error: { message: 'No rows found' } }
              )
            })
          }),
          in: (column: string, values: any[]) => ({
            single: () => Promise.resolve(
              self.select(table, columns, { [column]: values }).data?.[0] 
                ? { data: self.select(table, columns, { [column]: values }).data[0], error: null }
                : { data: null, error: { message: 'No rows found' } }
            )
          }),
          or: (query: string) => ({
            order: (col: string, options?: { ascending?: boolean }) => ({
              single: () => Promise.resolve(
                self.select(table, columns, { or: query }).data?.[0] 
                  ? { data: self.select(table, columns, { or: query }).data[0], error: null }
                  : { data: null, error: { message: 'No rows found' } }
              )
            })
          }),
          limit: (count: number) => ({
            single: () => Promise.resolve(
              self.select(table, columns).data?.[0] 
                ? { data: self.select(table, columns).data[0], error: null }
                : { data: null, error: { message: 'No rows found' } }
            )
          }),
          single: () => Promise.resolve(
            self.select(table, columns).data?.[0] 
              ? { data: self.select(table, columns).data[0], error: null }
              : { data: null, error: { message: 'No rows found' } }
          )
        }),
        insert: (data: any) => ({
          select: (columns?: string) => ({
            single: () => Promise.resolve(self.insert(table, data))
          })
        }),
        update: (data: any) => ({
          eq: (column: string, value: any) => ({
            select: (columns?: string) => ({
              single: () => Promise.resolve(self.update(table, data, { [column]: value }))
            })
          })
        }),
        delete: () => ({
          eq: (column: string, value: any) => Promise.resolve(self.delete(table, { [column]: value }))
        })
      }),
      auth: {
        getUser: () => Promise.resolve({ data: { user: self.currentUser }, error: null }),
        signInWithPassword: (credentials: any) => Promise.resolve({ data: { user: self.currentUser }, error: null }),
        signUp: (credentials: any) => Promise.resolve({ data: { user: self.currentUser }, error: null }),
        signOut: () => Promise.resolve({ error: null })
      },
      rpc: (functionName: string, params?: any) => self.callRpc(functionName, params)
    }
  }

  // Helper methods for test setup
  seedDatabase(data: MockDatabase) {
    this.database = { ...this.database, ...data }
  }

  clearDatabase() {
    this.database = {}
  }

  getDatabase() {
    return this.database
  }
}

// Factory function to create a mock client
export function createMockSupabaseClient(initialData?: MockDatabase): MockSupabaseClient {
  const mockClient = new MockSupabaseHttpClient(initialData)
  return mockClient.createMockClient()
}

// Test data factory
export function createTestData() {
  return {
    sessions: [
      {
        id: 'session-1',
        tenant_id: 'tenant-1',
        client_id: 'client-1',
        workout_id: 'workout-1',
        title: 'Upper Body Strength Training',
        description: 'Focus on chest, shoulders, and triceps',
        scheduled_at: '2024-01-15T10:00:00Z',
        duration_minutes: 60,
        status: 'scheduled',
        notes: 'Client prefers free weights over machines',
        created_by: 'user-1',
        created_at: '2024-01-10T08:00:00Z',
        updated_at: '2024-01-10T08:00:00Z'
      },
      {
        id: 'session-2',
        tenant_id: 'tenant-1',
        client_id: 'client-2',
        workout_id: null,
        title: 'Cardio HIIT Session',
        description: 'High-intensity interval training',
        scheduled_at: '2024-01-15T14:00:00Z',
        duration_minutes: 45,
        status: 'in_progress',
        notes: 'First time doing HIIT - start slow',
        created_by: 'user-1',
        created_at: '2024-01-10T09:00:00Z',
        updated_at: '2024-01-15T14:00:00Z'
      }
    ],
    clients: [
      {
        id: 'client-1',
        tenant_id: 'tenant-1',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        avatar_url: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 'client-2',
        tenant_id: 'tenant-1',
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane.smith@example.com',
        phone: '+1234567891',
        avatar_url: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }
    ],
    users: [
      {
        id: 'user-1',
        tenant_id: 'tenant-1',
        email: 'coach@example.com',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }
    ],
    workouts: [
      {
        id: 'workout-1',
        tenant_id: 'tenant-1',
        name: 'Upper Body Blast',
        description: 'Comprehensive upper body workout',
        duration_minutes: 60,
        difficulty_level: 3,
        created_by: 'user-1',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }
    ]
  }
}
