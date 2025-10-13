import { describe, it, expect, vi, beforeEach } from 'vitest'

// Create a mock client using vi.hoisted
const mockClient = vi.hoisted(() => ({
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      order: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: null, error: null }))
        }))
      }))
    })),
    insert: vi.fn(() => ({
      select: vi.fn(() => ({
        single: vi.fn(() => Promise.resolve({ data: null, error: null }))
      }))
    })),
    update: vi.fn(() => ({
      eq: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: null, error: null }))
        }))
      }))
    })),
    delete: vi.fn(() => ({
      eq: vi.fn(() => Promise.resolve({ data: null, error: null }))
    }))
  })),
  auth: {
    getUser: vi.fn(() => Promise.resolve({ data: { user: { id: 'test-user-id' } }, error: null }))
  }
}))

// Mock the createClientClient function
vi.mock('../../supabase', () => ({
  createClientClient: () => mockClient
}))

// Import after mocking
import { sessionAPI } from '../sessions'

describe('SessionAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getSessions', () => {
    it('should fetch sessions successfully', async () => {
      const mockSessions = [
        { id: '1', title: 'Test Session 1', status: 'scheduled' },
        { id: '2', title: 'Test Session 2', status: 'scheduled' }
      ]

      // Reset the mock to return our test data
      mockClient.from.mockReturnValue({
        select: vi.fn(() => ({
          order: vi.fn(() => ({
            data: mockSessions,
            error: null
          }))
        }))
      })

      const result = await sessionAPI.getSessions()
      expect(result).toEqual(mockSessions)
    })

    it('should handle errors when fetching sessions', async () => {
      mockClient.from.mockReturnValue({
        select: vi.fn(() => ({
          order: vi.fn(() => ({
            data: null,
            error: { message: 'Database error' }
          }))
        }))
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

      mockClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null
      })

      mockClient.from.mockImplementation((table) => {
        if (table === 'users') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn().mockResolvedValue({
                  data: mockUserData,
                  error: null
                })
              }))
            }))
          }
        }
        if (table === 'sessions') {
          return {
            insert: vi.fn(() => ({
              select: vi.fn(() => ({
                single: vi.fn().mockResolvedValue({
                  data: mockSession,
                  error: null
                })
              }))
            }))
          }
        }
        return { select: vi.fn(), insert: vi.fn(), update: vi.fn(), delete: vi.fn() }
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
      mockClient.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'Not authenticated' }
      })

      const sessionData = {
        client_id: 'client-1',
        title: 'Test Session',
        scheduled_at: '2024-01-01T10:00:00Z'
      }

      await expect(sessionAPI.createSession(sessionData)).rejects.toThrow('Authentication error: Not authenticated')
    })
  })
})