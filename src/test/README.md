# 🧪 Testing Setup

This directory contains a comprehensive testing setup inspired by the [mock_supabase_http_client](https://github.com/supabase-community/mock_supabase_http_client) for testing Supabase operations in the Fitness Coach Hub.

## 📁 Structure

```
src/test/
├── mocks/
│   └── mock-supabase-client.ts    # Main mock Supabase client
├── utils/
│   └── test-helpers.ts            # Test utilities and data factories
├── integration/
│   └── session-api-integration.test.ts  # Integration tests
├── basic-tests.test.ts            # Basic functionality tests
├── run-tests.ts                   # Manual test runner
├── setup.ts                       # Vitest setup
└── README.md                      # This file
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Run Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:ui

# Run tests once
pnpm test:run
```

### 3. Run Manual Test

```bash
# Run the basic test demonstration
npx tsx src/test/run-tests.ts
```

## 🛠️ Mock Supabase Client

The `MockSupabaseHttpClient` provides a comprehensive mock implementation that supports:

### ✅ Supported Operations

- **Database Operations**: `insert`, `select`, `update`, `delete`
- **Query Filtering**: `eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `like`, `ilike`, `in`, `is`
- **Query Chaining**: `or`, `and`, `order`, `limit`, `range`
- **Single Results**: `single()`, `maybeSingle()`
- **Count Queries**: `count()`
- **Authentication**: `getUser()`, `signInWithPassword()`, `signUp()`, `signOut()`
- **RPC Functions**: Custom function registration and calling

### 🔧 Usage Examples

#### Basic Setup

```typescript
import { setupTestContext, createMockSession } from './utils/test-helpers'

const { mockClient, testData } = setupTestContext()

// Use mockClient in your tests
const session = await mockClient.from('sessions').select().eq('id', '1').single()
```

#### Data Factory

```typescript
import { createMockSession, createMockClient } from './utils/test-helpers'

const session = createMockSession({
  title: 'Custom Session',
  status: 'scheduled'
})

const client = createMockClient({
  first_name: 'John',
  last_name: 'Doe'
})
```

#### Mocking Authentication

```typescript
const mockUser = createMockUser({ id: 'user-1', tenant_id: 'tenant-1' })
mockClient.auth.getUser = vi.fn().mockResolvedValue({
  data: { user: mockUser },
  error: null
})
```

#### RPC Functions

```typescript
// Register a custom RPC function
mockClient.registerRpcFunction('get_session_stats', (params, database) => {
  const sessions = database.sessions || []
  return {
    total: sessions.length,
    scheduled: sessions.filter(s => s.status === 'scheduled').length
  }
})

// Call the RPC function
const result = await mockClient.rpc('get_session_stats', { tenant_id: 'tenant-1' })
```

## 🧪 Test Utilities

### Data Factories

- `createMockSession(overrides?)` - Creates a mock session
- `createMockClient(overrides?)` - Creates a mock client
- `createMockUser(overrides?)` - Creates a mock user
- `createMockWorkout(overrides?)` - Creates a mock workout
- `createMockSessionWithRelations(overrides?)` - Creates session with related data

### Helper Functions

- `setupTestContext(initialData?)` - Sets up test context with mock client
- `createErrorResponse(message, code?)` - Creates error response
- `createSuccessResponse(data)` - Creates success response
- `createDateString(daysFromNow?)` - Creates ISO date string
- `createTimeRange(daysFromNow?, durationHours?)` - Creates time range

## 📝 Writing Tests

### Basic Test Structure

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { setupTestContext, createMockSession } from './utils/test-helpers'

describe('My Feature', () => {
  let mockClient: any
  let testData: any

  beforeEach(() => {
    const context = setupTestContext()
    mockClient = context.mockClient
    testData = context.testData
  })

  it('should do something', async () => {
    const session = createMockSession({ title: 'Test Session' })
    
    const result = await mockClient.from('sessions').insert(session).select().single()
    
    expect(result.data).toMatchObject({
      title: 'Test Session'
    })
  })
})
```

### API Integration Tests

```typescript
import { vi } from 'vitest'
import { setupTestContext } from '../utils/test-helpers'

// Mock the Supabase module
const { mockClient } = setupTestContext()
vi.mock('@/lib/supabase', () => ({
  createClientClient: () => mockClient
}))

// Import after mocking
import { sessionAPI } from '@/lib/api/sessions'

describe('SessionAPI Integration', () => {
  it('should create a session', async () => {
    // Set up mocks
    mockClient.auth.getUser = vi.fn().mockResolvedValue({
      data: { user: { id: 'user-1' } },
      error: null
    })

    // Test the API
    const result = await sessionAPI.createSession({
      client_id: 'client-1',
      title: 'Test Session',
      scheduled_at: '2024-01-20T10:00:00Z'
    })

    expect(result).toMatchObject({
      title: 'Test Session'
    })
  })
})
```

## 🎯 Best Practices

### 1. Use Data Factories

Always use the provided data factories instead of creating raw objects:

```typescript
// ✅ Good
const session = createMockSession({ title: 'Custom Title' })

// ❌ Avoid
const session = {
  id: '1',
  title: 'Custom Title',
  // ... many more properties
}
```

### 2. Clean Up Between Tests

```typescript
beforeEach(() => {
  vi.clearAllMocks()
  // Reset mock client state if needed
})
```

### 3. Mock External Dependencies

```typescript
// Mock Supabase module
vi.mock('@/lib/supabase', () => ({
  createClientClient: () => mockClient
}))
```

### 4. Test Error Scenarios

```typescript
it('should handle database errors', async () => {
  mockClient.from = vi.fn(() => ({
    select: vi.fn(() => ({
      data: null,
      error: { message: 'Database error' }
    }))
  }))

  await expect(sessionAPI.getSessions()).rejects.toThrow('Failed to fetch sessions')
})
```

## 🔍 Debugging

### Enable Debug Logging

```typescript
// In your test setup
global.console = {
  ...console,
  log: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
}
```

### Inspect Mock Database

```typescript
const { mockClient } = setupTestContext()
console.log('Database state:', mockClient.getDatabase())
```

## 🚧 Limitations

The mock client has some limitations compared to the real Supabase client:

- **No Real-time**: Realtime subscriptions are not supported
- **No Storage**: File storage operations are not supported
- **No Edge Functions**: Edge function calls are not supported
- **Simplified Queries**: Complex PostgREST queries may not work exactly as expected
- **No RLS**: Row Level Security is not enforced (but can be mocked)

## 🤝 Contributing

When adding new features to the mock client:

1. Add tests for the new functionality
2. Update this README with usage examples
3. Ensure backward compatibility
4. Add proper TypeScript types

## 📚 References

- [Vitest Documentation](https://vitest.dev/)
- [Mock Supabase HTTP Client](https://github.com/supabase-community/mock_supabase_http_client)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
