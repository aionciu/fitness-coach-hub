'use client'

import { useState, useEffect } from 'react'
import { SessionsList, SessionFormModal } from '@/components/sessions'
import { sessionAPI } from '@/lib/api/sessions'
import { clientAPI } from '@/lib/api/clients'
import { Session, SessionFormData, SessionFilters, CreateSessionData, UpdateSessionData } from '@/lib/types/session'
import { Client } from '@/lib/types/client'
import { mockSessions, mockWorkouts } from '@/lib/test-data/sessions'

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [workouts, setWorkouts] = useState<any[]>([]) // TODO: Add workout types
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingSession, setEditingSession] = useState<Session | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [filters, setFilters] = useState<SessionFilters>({})

  // Load initial data
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      console.log('Loading sessions data...')
      setIsLoading(true)
      const [sessionsData, clientsData] = await Promise.all([
        sessionAPI.getSessions(filters),
        clientAPI.getClients()
      ])
      console.log('Sessions data loaded:', sessionsData)
      console.log('Clients data loaded:', clientsData)
      setSessions(sessionsData)
      setClients(clientsData)
      // TODO: Load workouts when workout API is available
      setWorkouts([])
    } catch (error) {
      console.error('Error loading data:', error)
      // Use mock data for development/testing
      console.log('Using mock data for development...')
      setSessions(mockSessions)
      setClients([
        { id: 'client-1', first_name: 'John', last_name: 'Doe', email: 'john.doe@example.com', phone: '+1234567890', avatar_url: null, tenant_id: 'tenant-1', date_of_birth: null, height_cm: null, weight_kg: null, goals: null, notes: null, is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
        { id: 'client-2', first_name: 'Jane', last_name: 'Smith', email: 'jane.smith@example.com', phone: '+1234567891', avatar_url: null, tenant_id: 'tenant-1', date_of_birth: null, height_cm: null, weight_kg: null, goals: null, notes: null, is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
        { id: 'client-3', first_name: 'Mike', last_name: 'Johnson', email: 'mike.johnson@example.com', phone: '+1234567892', avatar_url: null, tenant_id: 'tenant-1', date_of_birth: null, height_cm: null, weight_kg: null, goals: null, notes: null, is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' }
      ])
      setWorkouts(mockWorkouts)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateSession = async (data: SessionFormData) => {
    try {
      setIsSubmitting(true)
      const newSession = await sessionAPI.createSession(data)
      setSessions(prev => [newSession, ...prev])
      setIsFormOpen(false)
    } catch (error) {
      console.error('Error creating session:', error)
      // TODO: Show error toast
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateSession = async (data: SessionFormData) => {
    if (!editingSession) return

    try {
      setIsSubmitting(true)
      const updatedSession = await sessionAPI.updateSession(editingSession.id, data)
      setSessions(prev => prev.map(s => s.id === updatedSession.id ? updatedSession : s))
      setIsFormOpen(false)
      setEditingSession(null)
    } catch (error) {
      console.error('Error updating session:', error)
      // TODO: Show error toast
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditSession = (session: Session) => {
    setEditingSession(session)
    setIsFormOpen(true)
  }

  const handleDeleteSession = async (session: Session) => {
    if (!confirm(`Are you sure you want to delete the session "${session.title}"?`)) {
      return
    }

    try {
      await sessionAPI.deleteSession(session.id)
      setSessions(prev => prev.filter(s => s.id !== session.id))
    } catch (error) {
      console.error('Error deleting session:', error)
      // TODO: Show error toast
    }
  }

  const handleStartSession = (session: Session) => {
    // TODO: Navigate to session tracking page
    console.log('Starting session:', session.id)
  }

  const handleStatusChange = async (session: Session, status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled') => {
    try {
      const updatedSession = await sessionAPI.updateSessionStatus(session.id, status)
      setSessions(prev => prev.map(s => s.id === updatedSession.id ? updatedSession : s))
    } catch (error) {
      console.error('Error updating session status:', error)
      // TODO: Show error toast
    }
  }

  const handleSearch = async (query: string) => {
    const newFilters = { ...filters, search: query }
    setFilters(newFilters)
    
    try {
      const filteredSessions = await sessionAPI.getSessions(newFilters)
      setSessions(filteredSessions)
    } catch (error) {
      console.error('Error searching sessions:', error)
    }
  }

  const handleFilter = async (status: string) => {
    const newFilters = { ...filters, status: status === 'all' ? undefined : status as any }
    setFilters(newFilters)
    
    try {
      const filteredSessions = await sessionAPI.getSessions(newFilters)
      setSessions(filteredSessions)
    } catch (error) {
      console.error('Error filtering sessions:', error)
    }
  }

  const handleFormSubmit = async (data: Omit<CreateSessionData, 'tenant_id' | 'created_by'> | UpdateSessionData) => {
    if (editingSession) {
      await handleUpdateSession(data as SessionFormData)
    } else {
      await handleCreateSession(data as SessionFormData)
    }
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingSession(null)
  }

  return (
    <div className="space-y-6 lg:mt-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Sessions</h1>
          <p className="text-[#A1A1AA] text-sm">Track and manage training sessions</p>
        </div>
      </div>

      {/* Sessions List */}
      <SessionsList
        sessions={sessions}
        onEdit={handleEditSession}
        onDelete={handleDeleteSession}
        onStart={handleStartSession}
        onStatusChange={handleStatusChange}
        onCreateNew={() => setIsFormOpen(true)}
        onSearch={handleSearch}
        onFilter={handleFilter}
        isLoading={isLoading}
      />

      {/* Session Form Modal */}
      <SessionFormModal
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        session={editingSession}
        isLoading={isSubmitting}
        clients={clients}
        workouts={workouts}
      />
    </div>
  )
}
