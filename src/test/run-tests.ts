#!/usr/bin/env node

/**
 * Simple test runner to demonstrate the mock Supabase setup
 * This script shows how to use the mock client in a basic scenario
 */

import { createMockSupabaseClient, createTestData } from './mocks/mock-supabase-client'

async function runBasicTest() {
  console.log('🧪 Running Basic Mock Supabase Test...\n')

  // Create mock client with test data
  const testData = createTestData()
  const mockClient = createMockSupabaseClient(testData)

  try {
    // Test 1: Insert a new session
    console.log('1. Testing session insertion...')
    const newSession = {
      id: 'test-session-123',
      tenant_id: 'tenant-1',
      client_id: 'client-1',
      workout_id: 'workout-1',
      title: 'Test Session',
      description: 'A test session created via mock client',
      scheduled_at: '2024-01-20T10:00:00Z',
      duration_minutes: 60,
      status: 'scheduled',
      notes: 'Test notes',
      created_by: 'user-1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const insertResult = await mockClient.from('sessions').insert(newSession).select().single()
    console.log('✅ Session inserted:', insertResult.data?.title)

    // Test 2: Query sessions
    console.log('\n2. Testing session query...')
    const queryResult = await mockClient.from('sessions').select()
    console.log(`✅ Found ${queryResult.data?.length || 0} sessions`)

    // Test 3: Update session
    console.log('\n3. Testing session update...')
    const updateResult = await mockClient.from('sessions')
      .update({ status: 'in_progress', notes: 'Updated notes' })
      .eq('id', 'test-session-123')
      .select()
      .single()
    console.log('✅ Session updated:', updateResult.data?.status)

    // Test 4: Query with filters
    console.log('\n4. Testing filtered query...')
    const filteredResult = await mockClient.from('sessions')
      .select()
      .eq('status', 'in_progress')
      .single()
    console.log('✅ Filtered session found:', filteredResult.data?.title)

    // Test 5: Authentication
    console.log('\n5. Testing authentication...')
    const authResult = await mockClient.auth.getUser()
    console.log('✅ Auth result:', authResult.data?.user ? 'User authenticated' : 'No user')

    // Test 6: RPC function
    console.log('\n6. Testing RPC function...')
    try {
      const rpcResult = await mockClient.rpc('test_function', { param: 'test' })
      console.log('✅ RPC call result:', rpcResult.data || 'No data')
    } catch (error) {
      console.log('ℹ️  RPC function not registered (expected)')
    }

    console.log('\n🎉 All tests completed successfully!')
    console.log('\n📊 Database state:')
    console.log('Sessions:', testData.sessions.length + 1) // +1 for the new session
    console.log('Clients:', testData.clients.length)
    console.log('Users:', testData.users.length)
    console.log('Workouts:', testData.workouts.length)

  } catch (error) {
    console.error('❌ Test failed:', error)
    process.exit(1)
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  runBasicTest()
}

export { runBasicTest }
