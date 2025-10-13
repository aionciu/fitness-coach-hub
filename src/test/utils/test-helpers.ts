import { vi } from 'vitest'

export interface TestContext {
  mockClient: any
  testData: any
}

export function setupTestContext(initialData?: any): TestContext {
  // Lazy import to avoid circular dependencies
  const { createMockSupabaseClient, createTestData } = require('../mocks/mock-supabase-client')
  
  const testData = createTestData()
  const mockClient = createMockSupabaseClient(initialData || testData)
  
  return {
    mockClient,
    testData
  }
}

export function mockSupabaseModule() {
  return vi.hoisted(() => {
    const { mockClient } = setupTestContext()
    return {
      createClientClient: vi.fn(() => mockClient),
      createServerClient: vi.fn(() => mockClient),
    }
  })
}

export function createMockSession(overrides: Partial<any> = {}) {
  return {
    id: 'session-test-1',
    tenant_id: 'tenant-1',
    client_id: 'client-1',
    workout_id: 'workout-1',
    title: 'Test Session',
    description: 'Test session description',
    scheduled_at: '2024-01-15T10:00:00Z',
    duration_minutes: 60,
    status: 'scheduled' as const,
    notes: 'Test notes',
    created_by: 'user-1',
    created_at: '2024-01-10T08:00:00Z',
    updated_at: '2024-01-10T08:00:00Z',
    ...overrides
  }
}

export function createMockClient(overrides: Partial<any> = {}) {
  return {
    id: 'client-test-1',
    tenant_id: 'tenant-1',
    first_name: 'Test',
    last_name: 'Client',
    email: 'test.client@example.com',
    phone: '+1234567890',
    avatar_url: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    ...overrides
  }
}

export function createMockUser(overrides: Partial<any> = {}) {
  return {
    id: 'user-test-1',
    tenant_id: 'tenant-1',
    email: 'test@example.com',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    ...overrides
  }
}

export function createMockWorkout(overrides: Partial<any> = {}) {
  return {
    id: 'workout-test-1',
    tenant_id: 'tenant-1',
    name: 'Test Workout',
    description: 'Test workout description',
    duration_minutes: 60,
    difficulty_level: 3,
    created_by: 'user-1',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    ...overrides
  }
}

export function createMockSessionWithRelations(overrides: Partial<any> = {}) {
  const session = createMockSession(overrides)
  return {
    ...session,
    client: createMockClient({ id: session.client_id }),
    workout: createMockWorkout({ id: session.workout_id })
  }
}

export function createMockSessionStats(overrides: Partial<any> = {}) {
  return {
    total_sessions: 10,
    scheduled_sessions: 5,
    in_progress_sessions: 2,
    completed_sessions: 3,
    cancelled_sessions: 0,
    upcoming_sessions: 7,
    today_sessions: 2,
    ...overrides
  }
}

export function createMockSessionFilters(overrides: Partial<any> = {}) {
  return {
    status: 'scheduled' as const,
    client_id: 'client-1',
    date_from: '2024-01-01T00:00:00Z',
    date_to: '2024-01-31T23:59:59Z',
    search: 'test',
    ...overrides
  }
}

export function createMockCreateSessionData(overrides: Partial<any> = {}) {
  return {
    client_id: 'client-1',
    workout_id: 'workout-1',
    title: 'New Test Session',
    description: 'New test session description',
    scheduled_at: '2024-01-20T10:00:00Z',
    duration_minutes: 60,
    status: 'scheduled' as const,
    notes: 'New test notes',
    ...overrides
  }
}

export function createMockUpdateSessionData(overrides: Partial<any> = {}) {
  return {
    title: 'Updated Test Session',
    description: 'Updated test session description',
    status: 'in_progress' as const,
    notes: 'Updated test notes',
    ...overrides
  }
}

// Helper to simulate async operations
export function delay(ms: number = 0) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Helper to create error responses
export function createErrorResponse(message: string, code?: string) {
  return {
    data: null,
    error: {
      message,
      code,
      details: null,
      hint: null
    }
  }
}

// Helper to create success responses
export function createSuccessResponse(data: any) {
  return {
    data,
    error: null
  }
}

// Helper to mock console methods
export function mockConsole() {
  const originalConsole = global.console
  
  beforeEach(() => {
    global.console = {
      ...originalConsole,
      log: vi.fn(),
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    }
  })
  
  afterEach(() => {
    global.console = originalConsole
  })
}

// Helper to create date strings for testing
export function createDateString(daysFromNow: number = 0): string {
  const date = new Date()
  date.setDate(date.getDate() + daysFromNow)
  return date.toISOString()
}

// Helper to create time range for testing
export function createTimeRange(daysFromNow: number = 0, durationHours: number = 1) {
  const start = new Date()
  start.setDate(start.getDate() + daysFromNow)
  const end = new Date(start.getTime() + durationHours * 60 * 60 * 1000)
  
  return {
    start: start.toISOString(),
    end: end.toISOString()
  }
}
