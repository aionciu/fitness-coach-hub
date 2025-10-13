import { describe, it, expect, vi, beforeEach } from 'vitest'
import { sessionAPI } from '../sessions'

// Mock Supabase client
const mockSupabase = {
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      order: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => ({
            data: null,
            error: null
          }))
        }))
      }))
    })),
    insert: vi.fn(() => ({
      select: vi.fn(() => ({
        single: vi.fn(() => ({
          data: null,
          error: null
        }))
      }))
    })),
    update: vi.fn(() => ({
      eq: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => ({
            data: null,
            error: null
          }))
        }))
      }))
    })),
    delete: vi.fn(() => ({
      eq: vi.fn(() => ({
        data: null,
        error: null
      }))
    }))
  })),
  auth: {
    getUser: vi.fn(() => ({
      data: { user: { id: 'test-user-id' } },
      error: null
    }))
  }
}

// Mock the createClientClient function
vi.mock('../../supabase', () => ({
  createClientClient: () => mockSupabase
}))

describe('SessionAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getSessions', () => {
    it('should fetch sessions successfully', async () => {
      const mockSessions = [
        {
          id: '1',
          title: 'Test Session',
          status: 'scheduled',
          scheduled_at: '2024-01-01T10:00:00Z'
        }
      ]

      mockSupabase.from().select().order().eq().single.mockReturnValue({
        data: mockSessions,
        error: null
      })

      const result = await sessionAPI.getSessions()
      expect(result).toEqual(mockSessions)
    })

    it('should handle errors when fetching sessions', async () => {
      mockSupabase.from().select().order().eq().single.mockReturnValue({
        data: null,
        error: { message: 'Database error' }
      })

      await expect(sessionAPI.getSessions()).rejects.toThrow('Failed to fetch sessions')
    })
  })

  describe('createSession', () => {
    it('should create a session successfully', async () => {
      const mockUser = { id: 'test-user-id' }
      const mockUserData = { tenant_id: 'test-tenant-id' }
      const mockSession = {
        id: '1',
        title: 'Test Session',
        client_id: 'client-1',
        tenant_id: 'test-tenant-id',
        created_by: 'test-user-id'
      }

      mockSupabase.auth.getUser.mockReturnValue({
        data: { user: mockUser },
        error: null
      })

      mockSupabase.from().select().eq().single.mockReturnValue({
        data: mockUserData,
        error: null
      })

      mockSupabase.from().insert().select().single.mockReturnValue({
        data: mockSession,
        error: null
      })

      const sessionData = {
        client_id: 'client-1',
        title: 'Test Session',
        scheduled_at: '2024-01-01T10:00:00Z'
      }

      const result = await sessionAPI.createSession(sessionData)
      expect(result).toEqual(mockSession)
    })

    it('should handle authentication errors', async () => {
      mockSupabase.auth.getUser.mockReturnValue({
        data: { user: null },
        error: { message: 'Not authenticated' }
      })

      const sessionData = {
        client_id: 'client-1',
        title: 'Test Session',
        scheduled_at: '2024-01-01T10:00:00Z'
      }

      await expect(sessionAPI.createSession(sessionData)).rejects.toThrow('User not authenticated')
    })
  })

  describe('updateSession', () => {
    it('should update a session successfully', async () => {
      const mockSession = {
        id: '1',
        title: 'Updated Session',
        status: 'scheduled'
      }

      mockSupabase.auth.getUser.mockReturnValue({
        data: { user: { id: 'test-user-id' } },
        error: null
      })

      mockSupabase.from().update().eq().select().single.mockReturnValue({
        data: mockSession,
        error: null
      })

      const updateData = { title: 'Updated Session' }
      const result = await sessionAPI.updateSession('1', updateData)
      expect(result).toEqual(mockSession)
    })
  })

  describe('deleteSession', () => {
    it('should delete a session successfully', async () => {
      mockSupabase.from().delete().eq.mockReturnValue({
        data: null,
        error: null
      })

      await expect(sessionAPI.deleteSession('1')).resolves.not.toThrow()
    })

    it('should handle errors when deleting session', async () => {
      mockSupabase.from().delete().eq.mockReturnValue({
        data: null,
        error: { message: 'Delete failed' }
      })

      await expect(sessionAPI.deleteSession('1')).rejects.toThrow('Failed to delete session')
    })
  })
})

