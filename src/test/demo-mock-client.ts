#!/usr/bin/env node

/**
 * Demonstration of the Mock Supabase Client
 * This script shows how the mock client works with basic operations
 */

import { createMockSupabaseClient, createTestData } from './mocks/mock-supabase-client'

async function demonstrateMockClient() {
  console.log('🧪 Mock Supabase Client Demonstration\n')

  // Create mock client with test data
  const testData = createTestData()
  const mockClient = createMockSupabaseClient(testData)

  try {
    // 1. Show initial data
    console.log('📊 Initial Database State:')
    console.log(`- Sessions: ${testData.sessions.length}`)
    console.log(`- Clients: ${testData.clients.length}`)
    console.log(`- Users: ${testData.users.length}`)
    console.log(`- Workouts: ${testData.workouts.length}\n`)

    // 2. Insert a new session
    console.log('1. Inserting a new session...')
    const newSession = {
      id: 'demo-session-1',
      tenant_id: 'tenant-1',
      client_id: 'client-1',
      workout_id: 'workout-1',
      title: 'Demo Session',
      description: 'A demonstration session',
      scheduled_at: '2024-01-20T10:00:00Z',
      duration_minutes: 60,
      status: 'scheduled',
      notes: 'Demo notes',
      created_by: 'user-1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const insertResult = await mockClient.from('sessions').insert(newSession).select().single()
    console.log('✅ Session inserted:', insertResult.data?.title)

    // 3. Query sessions
    console.log('\n2. Querying all sessions...')
    const queryResult = await mockClient.from('sessions').select()
    console.log(`✅ Found ${queryResult.data?.length || 0} sessions`)

    // 4. Update session
    console.log('\n3. Updating session status...')
    const updateResult = await mockClient.from('sessions')
      .update({ status: 'in_progress', notes: 'Updated demo notes' })
      .eq('id', 'demo-session-1')
      .select()
      .single()
    console.log('✅ Session updated:', updateResult.data?.status)

    // 5. Query with filters
    console.log('\n4. Querying sessions by status...')
    const filteredResult = await mockClient.from('sessions')
      .select()
      .eq('status', 'in_progress')
      .single()
    console.log('✅ Filtered session found:', filteredResult.data?.title)

    // 6. Authentication
    console.log('\n5. Testing authentication...')
    const authResult = await mockClient.auth.getUser()
    console.log('✅ Auth result:', authResult.data?.user ? 'User authenticated' : 'No user')

    // 7. Show final database state
    console.log('\n📊 Final Database State:')
    const finalSessions = await mockClient.from('sessions').select()
    console.log(`- Sessions: ${finalSessions.data?.length || 0}`)

    console.log('\n🎉 Mock Supabase Client demonstration completed successfully!')
    console.log('\n💡 Key Features Demonstrated:')
    console.log('- ✅ Database operations (insert, select, update)')
    console.log('- ✅ Query filtering (eq)')
    console.log('- ✅ Authentication simulation')
    console.log('- ✅ Error handling')
    console.log('- ✅ In-memory data persistence')

  } catch (error) {
    console.error('❌ Demonstration failed:', error)
    process.exit(1)
  }
}

// Run the demonstration if this file is executed directly
if (require.main === module) {
  demonstrateMockClient()
}

export { demonstrateMockClient }
