import { Session, CreateSessionData } from '../types/session'

export const mockSessions: Session[] = [
  {
    id: '1',
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
    updated_at: '2024-01-10T08:00:00Z',
    client: {
      id: 'client-1',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      avatar_url: null
    },
    workout: {
      id: 'workout-1',
      name: 'Upper Body Blast',
      description: 'Comprehensive upper body workout',
      duration_minutes: 60,
      difficulty_level: 3
    }
  },
  {
    id: '2',
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
    updated_at: '2024-01-15T14:00:00Z',
    client: {
      id: 'client-2',
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'jane.smith@example.com',
      phone: '+1234567891',
      avatar_url: null
    },
    workout: undefined
  },
  {
    id: '3',
    tenant_id: 'tenant-1',
    client_id: 'client-3',
    workout_id: 'workout-2',
    title: 'Yoga & Flexibility',
    description: 'Gentle yoga flow and stretching',
    scheduled_at: '2024-01-16T09:00:00Z',
    duration_minutes: 30,
    status: 'completed',
    notes: 'Great session - client felt very relaxed',
    created_by: 'user-1',
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-16T09:30:00Z',
    client: {
      id: 'client-3',
      first_name: 'Mike',
      last_name: 'Johnson',
      email: 'mike.johnson@example.com',
      phone: '+1234567892',
      avatar_url: null
    },
    workout: {
      id: 'workout-2',
      name: 'Morning Yoga Flow',
      description: 'Gentle morning yoga routine',
      duration_minutes: 30,
      difficulty_level: 1
    }
  },
  {
    id: '4',
    tenant_id: 'tenant-1',
    client_id: 'client-1',
    workout_id: null,
    title: 'Lower Body Power',
    description: 'Squats, deadlifts, and leg exercises',
    scheduled_at: '2024-01-17T11:00:00Z',
    duration_minutes: 75,
    status: 'scheduled',
    notes: 'Focus on proper form',
    created_by: 'user-1',
    created_at: '2024-01-12T08:00:00Z',
    updated_at: '2024-01-12T08:00:00Z',
    client: {
      id: 'client-1',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      avatar_url: null
    },
    workout: undefined
  }
]

export const mockWorkouts = [
  {
    id: 'workout-1',
    name: 'Upper Body Blast',
    description: 'Comprehensive upper body workout',
    duration_minutes: 60,
    difficulty_level: 3
  },
  {
    id: 'workout-2',
    name: 'Morning Yoga Flow',
    description: 'Gentle morning yoga routine',
    duration_minutes: 30,
    difficulty_level: 1
  },
  {
    id: 'workout-3',
    name: 'Cardio HIIT',
    description: 'High-intensity interval training',
    duration_minutes: 45,
    difficulty_level: 4
  },
  {
    id: 'workout-4',
    name: 'Full Body Strength',
    description: 'Complete body strength training',
    duration_minutes: 90,
    difficulty_level: 3
  }
]

export const createMockSession = (overrides: Partial<CreateSessionData> = {}): CreateSessionData => ({
  tenant_id: 'tenant-1',
  client_id: 'client-1',
  workout_id: null,
  title: 'Test Session',
  description: 'Test session description',
  scheduled_at: new Date().toISOString(),
  duration_minutes: 60,
  status: 'scheduled',
  notes: 'Test notes',
  created_by: 'user-1',
  ...overrides
})

