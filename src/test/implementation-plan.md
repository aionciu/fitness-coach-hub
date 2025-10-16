# 🧪 Test Implementation Plan

## 📋 Overview

This document outlines the specific implementation details for testing the Fitness Coach Hub application, including test file structure, test data setup, and implementation examples.

## 🏗️ Test File Structure

```
src/test/
├── __mocks__/                    # Global mocks
│   ├── next-router.ts            # Next.js router mock
│   ├── framer-motion.ts          # Framer Motion mock
│   └── react-query.ts            # React Query mock
├── fixtures/                     # Test data fixtures
│   ├── clients.ts               # Client test data
│   ├── sessions.ts              # Session test data
│   ├── workouts.ts              # Workout test data
│   └── users.ts                 # User test data
├── mocks/                       # Mock implementations
│   ├── mock-supabase-client.ts  # Supabase mock client
│   ├── mock-api-responses.ts    # API response mocks
│   └── mock-file-uploads.ts     # File upload mocks
├── utils/                       # Test utilities
│   ├── test-helpers.ts          # General test helpers
│   ├── render-helpers.ts        # Component render helpers
│   ├── api-helpers.ts           # API testing helpers
│   └── data-factories.ts        # Data factory functions
├── integration/                 # Integration tests
│   ├── auth-flow.test.ts        # Authentication flow tests
│   ├── client-management.test.ts # Client CRUD tests
│   ├── session-management.test.ts # Session CRUD tests
│   └── dashboard.test.ts        # Dashboard integration tests
├── components/                  # Component tests
│   ├── ui/                      # UI component tests
│   │   ├── button.test.tsx
│   │   ├── input.test.tsx
│   │   └── modal.test.tsx
│   ├── clients/                 # Client component tests
│   │   ├── client-card.test.tsx
│   │   ├── client-form.test.tsx
│   │   └── client-filters.test.tsx
│   ├── sessions/                # Session component tests
│   │   ├── session-card.test.tsx
│   │   ├── session-form.test.tsx
│   │   └── sessions-list.test.tsx
│   └── dashboard/               # Dashboard component tests
│       ├── dashboard-stats.test.tsx
│       └── todays-sessions.test.tsx
├── pages/                       # Page component tests
│   ├── auth/
│   │   ├── login.test.tsx
│   │   └── onboarding.test.tsx
│   └── dashboard/
│       ├── dashboard.test.tsx
│       ├── clients.test.tsx
│       └── sessions.test.tsx
├── api/                         # API tests
│   ├── clients.test.ts          # Client API tests
│   ├── sessions.test.ts         # Session API tests
│   └── auth.test.ts             # Auth API tests
├── e2e/                         # End-to-end tests
│   ├── auth.spec.ts             # Auth E2E tests
│   ├── client-management.spec.ts # Client E2E tests
│   └── session-management.spec.ts # Session E2E tests
└── performance/                 # Performance tests
    ├── load-test.ts             # Load testing
    └── stress-test.ts           # Stress testing
```

## 🧪 Test Implementation Examples

### 1. Component Testing Example

```typescript
// src/test/components/clients/client-card.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { ClientCard } from '@/components/clients/client-card'
import { createMockClient } from '@/test/utils/data-factories'

describe('ClientCard', () => {
  const mockClient = createMockClient({
    id: 'client-1',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    is_active: true
  })

  const mockOnEdit = vi.fn()
  const mockOnDelete = vi.fn()
  const mockOnToggleActive = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders client information correctly', () => {
    render(
      <ClientCard
        client={mockClient}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onToggleActive={mockOnToggleActive}
      />
    )

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument()
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('calls onEdit when edit button is clicked', async () => {
    render(
      <ClientCard
        client={mockClient}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onToggleActive={mockOnToggleActive}
      />
    )

    const editButton = screen.getByRole('button', { name: /edit/i })
    fireEvent.click(editButton)

    expect(mockOnEdit).toHaveBeenCalledWith(mockClient)
  })

  it('calls onToggleActive when status toggle is clicked', async () => {
    render(
      <ClientCard
        client={mockClient}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onToggleActive={mockOnToggleActive}
      />
    )

    const toggleButton = screen.getByRole('button', { name: /toggle status/i })
    fireEvent.click(toggleButton)

    expect(mockOnToggleActive).toHaveBeenCalledWith(mockClient.id, false)
  })

  it('shows loading state when updating', () => {
    render(
      <ClientCard
        client={mockClient}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onToggleActive={mockOnToggleActive}
        isUpdating={true}
      />
    )

    expect(screen.getByText('Updating...')).toBeInTheDocument()
  })
})
```

### 2. API Testing Example

```typescript
// src/test/api/clients.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { clientAPI } from '@/lib/api/clients'
import { createMockSupabaseClient, createTestData } from '@/test/mocks/mock-supabase-client'

// Mock the Supabase module
const { mockClient } = createTestData()
vi.mock('@/lib/supabase', () => ({
  createClientClient: () => mockClient
}))

describe('ClientAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getClients', () => {
    it('should fetch clients successfully', async () => {
      const mockClients = [
        { id: '1', first_name: 'John', last_name: 'Doe', email: 'john@example.com' },
        { id: '2', first_name: 'Jane', last_name: 'Smith', email: 'jane@example.com' }
      ]

      mockClient.from.mockReturnValue({
        select: vi.fn(() => ({
          order: vi.fn(() => ({
            data: mockClients,
            error: null
          }))
        }))
      })

      const result = await clientAPI.getClients()
      expect(result).toEqual(mockClients)
    })

    it('should handle errors when fetching clients', async () => {
      mockClient.from.mockReturnValue({
        select: vi.fn(() => ({
          order: vi.fn(() => ({
            data: null,
            error: { message: 'Database error' }
          }))
        }))
      })

      await expect(clientAPI.getClients()).rejects.toThrow('Failed to fetch clients')
    })
  })

  describe('createClient', () => {
    it('should create a client successfully', async () => {
      const mockClientData = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com'
      }

      const mockCreatedClient = {
        id: '1',
        ...mockClientData,
        tenant_id: 'tenant-1',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }

      mockClient.auth.getUser.mockResolvedValue({
        data: { user: { id: 'user-1' } },
        error: null
      })

      mockClient.from.mockImplementation((table) => {
        if (table === 'users') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn().mockResolvedValue({
                  data: { tenant_id: 'tenant-1' },
                  error: null
                })
              }))
            }))
          }
        }
        if (table === 'clients') {
          return {
            insert: vi.fn(() => ({
              select: vi.fn(() => ({
                single: vi.fn().mockResolvedValue({
                  data: mockCreatedClient,
                  error: null
                })
              }))
            }))
          }
        }
        return { select: vi.fn(), insert: vi.fn() }
      })

      const result = await clientAPI.createClient(mockClientData)
      expect(result).toEqual(mockCreatedClient)
    })
  })
})
```

### 3. Integration Testing Example

```typescript
// src/test/integration/client-management.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ClientsPage } from '@/app/(dashboard)/clients/page'
import { createMockSupabaseClient } from '@/test/mocks/mock-supabase-client'

// Mock the Supabase module
const mockClient = createMockSupabaseClient()
vi.mock('@/lib/supabase', () => ({
  createClientClient: () => mockClient
}))

describe('Client Management Integration', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false }
      }
    })
    vi.clearAllMocks()
  })

  const renderWithQueryClient = (component: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    )
  }

  it('should load and display clients', async () => {
    const mockClients = [
      { id: '1', first_name: 'John', last_name: 'Doe', email: 'john@example.com', is_active: true },
      { id: '2', first_name: 'Jane', last_name: 'Smith', email: 'jane@example.com', is_active: false }
    ]

    mockClient.from.mockReturnValue({
      select: vi.fn(() => ({
        order: vi.fn(() => ({
          data: mockClients,
          error: null
        }))
      }))
    })

    renderWithQueryClient(<ClientsPage />)

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    })
  })

  it('should create a new client', async () => {
    mockClient.from.mockReturnValue({
      select: vi.fn(() => ({
        order: vi.fn(() => ({
          data: [],
          error: null
        }))
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({
            data: { id: '1', first_name: 'New', last_name: 'Client' },
            error: null
          })
        }))
      }))
    })

    mockClient.auth.getUser.mockResolvedValue({
      data: { user: { id: 'user-1' } },
      error: null
    })

    renderWithQueryClient(<ClientsPage />)

    // Click add client button
    const addButton = screen.getByText('Add Client')
    fireEvent.click(addButton)

    // Fill out form
    await waitFor(() => {
      expect(screen.getByLabelText('First Name')).toBeInTheDocument()
    })

    fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'New' } })
    fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Client' } })
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'new@example.com' } })

    // Submit form
    const submitButton = screen.getByRole('button', { name: /save/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockClient.from).toHaveBeenCalledWith('clients')
    })
  })
})
```

### 4. E2E Testing Example

```typescript
// src/test/e2e/client-management.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Client Management E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to clients page
    await page.goto('/clients')
  })

  test('should create a new client', async ({ page }) => {
    // Click add client button
    await page.click('text=Add Client')

    // Wait for modal to open
    await expect(page.locator('[role="dialog"]')).toBeVisible()

    // Fill out form
    await page.fill('input[name="first_name"]', 'John')
    await page.fill('input[name="last_name"]', 'Doe')
    await page.fill('input[name="email"]', 'john.doe@example.com')
    await page.fill('input[name="phone"]', '+1234567890')

    // Submit form
    await page.click('button[type="submit"]')

    // Wait for success
    await expect(page.locator('text=Client created successfully')).toBeVisible()

    // Verify client appears in list
    await expect(page.locator('text=John Doe')).toBeVisible()
  })

  test('should edit an existing client', async ({ page }) => {
    // Click edit button on first client
    await page.click('[data-testid="client-card"]:first-child button[aria-label="Edit"]')

    // Wait for modal to open
    await expect(page.locator('[role="dialog"]')).toBeVisible()

    // Update name
    await page.fill('input[name="first_name"]', 'Jane')

    // Submit form
    await page.click('button[type="submit"]')

    // Verify update
    await expect(page.locator('text=Jane Doe')).toBeVisible()
  })

  test('should delete a client', async ({ page }) => {
    // Click delete button on first client
    await page.click('[data-testid="client-card"]:first-child button[aria-label="Delete"]')

    // Confirm deletion
    await page.click('text=Confirm')

    // Verify client is removed
    await expect(page.locator('[data-testid="client-card"]:first-child')).not.toBeVisible()
  })
})
```

## 📊 Test Data Management

### 1. Data Factories

```typescript
// src/test/utils/data-factories.ts
export function createMockClient(overrides: Partial<Client> = {}): Client {
  return {
    id: 'client-' + Math.random().toString(36).substr(2, 9),
    tenant_id: 'tenant-1',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    avatar_url: null,
    date_of_birth: '1990-01-01',
    height_cm: 180,
    weight_kg: 75,
    goals: 'Lose weight and build muscle',
    notes: 'Prefers morning sessions',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    ...overrides
  }
}

export function createMockSession(overrides: Partial<Session> = {}): Session {
  return {
    id: 'session-' + Math.random().toString(36).substr(2, 9),
    tenant_id: 'tenant-1',
    client_id: 'client-1',
    workout_id: 'workout-1',
    title: 'Upper Body Training',
    description: 'Focus on chest, shoulders, and arms',
    scheduled_at: '2024-01-20T10:00:00Z',
    duration_minutes: 60,
    status: 'scheduled',
    notes: 'Client prefers free weights',
    created_by: 'user-1',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    ...overrides
  }
}
```

### 2. Test Fixtures

```typescript
// src/test/fixtures/clients.ts
export const mockClients = [
  {
    id: 'client-1',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    is_active: true
  },
  {
    id: 'client-2',
    first_name: 'Jane',
    last_name: 'Smith',
    email: 'jane.smith@example.com',
    is_active: false
  }
]

export const mockClientStats = {
  total_clients: 2,
  active_clients: 1,
  inactive_clients: 1,
  new_clients_this_month: 0
}
```

## 🚀 Test Execution Commands

### Package.json Scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:unit": "vitest run --reporter=verbose src/test/components src/test/api",
    "test:integration": "vitest run --reporter=verbose src/test/integration",
    "test:e2e": "playwright test",
    "test:coverage": "vitest run --coverage",
    "test:watch": "vitest --watch",
    "test:ui": "vitest --ui",
    "test:ci": "vitest run --reporter=junit --outputFile=test-results.xml"
  }
}
```

### CI/CD Pipeline

```yaml
# .github/workflows/test.yml
name: Test Suite

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - run: pnpm install
      - run: pnpm test:unit
      - run: pnpm test:integration
      - run: pnpm test:e2e
      - run: pnpm test:coverage
```

## 📈 Test Metrics and Reporting

### Coverage Reports
- HTML coverage reports
- Coverage thresholds
- Coverage trends
- Uncovered code analysis

### Test Results
- Test execution time
- Pass/fail rates
- Flaky test detection
- Performance metrics

### Quality Gates
- Minimum coverage requirements
- Maximum test execution time
- Zero critical bugs
- All E2E tests passing

This implementation plan provides a comprehensive framework for testing the Fitness Coach Hub application, ensuring high quality and reliability across all features and components.

