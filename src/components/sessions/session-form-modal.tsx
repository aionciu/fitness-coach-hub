'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { X, Calendar, Clock, User, Dumbbell, FileText, Search } from 'lucide-react'
import { Session, SessionFormData, CreateSessionData, UpdateSessionData } from '@/lib/types/session'
import { Client } from '@/lib/types/client'

interface SessionFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Omit<CreateSessionData, 'tenant_id' | 'created_by'> | UpdateSessionData) => Promise<void>
  session?: Session | null
  isLoading?: boolean
  clients: Client[]
  workouts?: Array<{
    id: string
    name: string
    description: string | null
    duration_minutes: number | null
  }>
}

export function SessionFormModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  session, 
  isLoading = false,
  clients = [],
  workouts = []
}: SessionFormModalProps) {
  const [formData, setFormData] = useState<SessionFormData>({
    client_id: '',
    workout_id: null,
    title: '',
    description: '',
    scheduled_at: '',
    duration_minutes: null,
    notes: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [clientSearch, setClientSearch] = useState('')
  const [workoutSearch, setWorkoutSearch] = useState('')
  const [showClientDropdown, setShowClientDropdown] = useState(false)
  const [showWorkoutDropdown, setShowWorkoutDropdown] = useState(false)

  const filteredClients = clients.filter(client =>
    `${client.first_name} ${client.last_name}`.toLowerCase().includes(clientSearch.toLowerCase()) ||
    client.email?.toLowerCase().includes(clientSearch.toLowerCase())
  )

  const filteredWorkouts = workouts.filter(workout =>
    workout.name.toLowerCase().includes(workoutSearch.toLowerCase())
  )

  useEffect(() => {
    if (session) {
      setFormData({
        client_id: session.client_id,
        workout_id: session.workout_id,
        title: session.title,
        description: session.description || '',
        scheduled_at: session.scheduled_at ? new Date(session.scheduled_at).toISOString().slice(0, 16) : '',
        duration_minutes: session.duration_minutes,
        notes: session.notes || '',
      })
    } else {
      setFormData({
        client_id: '',
        workout_id: null,
        title: '',
        description: '',
        scheduled_at: '',
        duration_minutes: null,
        notes: '',
      })
    }
    setErrors({})
    setClientSearch('')
    setWorkoutSearch('')
    setShowClientDropdown(false)
    setShowWorkoutDropdown(false)
  }, [session, isOpen])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.client_id) {
      newErrors.client_id = 'Client is required'
    }
    if (!formData.title.trim()) {
      newErrors.title = 'Session title is required'
    }
    if (!formData.scheduled_at) {
      newErrors.scheduled_at = 'Scheduled date and time is required'
    } else {
      const scheduledDate = new Date(formData.scheduled_at)
      const now = new Date()
      if (scheduledDate < now) {
        newErrors.scheduled_at = 'Scheduled time cannot be in the past'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      const submitData = {
        ...formData,
        workout_id: formData.workout_id || null,
        duration_minutes: formData.duration_minutes || null,
        description: formData.description || null,
        notes: formData.notes || null,
      }

      await onSubmit(submitData)
      onClose()
    } catch (error) {
      console.error('Error submitting session:', error)
    }
  }

  const handleInputChange = (field: keyof SessionFormData, value: string | number | null) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleClientSelect = (client: Client) => {
    setFormData(prev => ({ ...prev, client_id: client.id }))
    setClientSearch(`${client.first_name} ${client.last_name}`)
    setShowClientDropdown(false)
  }

  const handleWorkoutSelect = (workout: { id: string; name: string; duration_minutes: number | null }) => {
    setFormData(prev => ({ 
      ...prev, 
      workout_id: workout.id,
      duration_minutes: workout.duration_minutes || prev.duration_minutes
    }))
    setWorkoutSearch(workout.name)
    setShowWorkoutDropdown(false)
  }

  const selectedClient = clients.find(c => c.id === formData.client_id)
  const selectedWorkout = workouts.find(w => w.id === formData.workout_id)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#1A1A1D] border-[#2A2A2D]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-semibold text-white">
            {session ? 'Edit Session' : 'Schedule New Session'}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-[#A1A1AA] hover:text-white"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Client Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white flex items-center gap-2">
                <User className="w-4 h-4" />
                Client *
              </label>
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A1A1AA] w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search clients..."
                    value={clientSearch}
                    onChange={(e) => {
                      setClientSearch(e.target.value)
                      setShowClientDropdown(true)
                    }}
                    onFocus={() => setShowClientDropdown(true)}
                    className="pl-10 bg-[#2A2A2D] border-[#3A3A3D] text-white placeholder-[#A1A1AA] focus:border-[#0070f3]"
                  />
                </div>
                {showClientDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-[#2A2A2D] border border-[#3A3A3D] rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {filteredClients.length > 0 ? (
                      filteredClients.map((client) => (
                        <button
                          key={client.id}
                          type="button"
                          className="w-full px-4 py-3 text-left hover:bg-[#3A3A3D] text-white flex items-center gap-3"
                          onClick={() => handleClientSelect(client)}
                        >
                          <div className="w-8 h-8 bg-[#0070f3] rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {client.first_name[0]}{client.last_name[0]}
                          </div>
                          <div>
                            <div className="font-medium">{client.first_name} {client.last_name}</div>
                            {client.email && (
                              <div className="text-sm text-[#A1A1AA]">{client.email}</div>
                            )}
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-[#A1A1AA]">No clients found</div>
                    )}
                  </div>
                )}
                {errors.client_id && (
                  <p className="text-red-400 text-sm mt-1">{errors.client_id}</p>
                )}
              </div>
            </div>

            {/* Workout Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white flex items-center gap-2">
                <Dumbbell className="w-4 h-4" />
                Workout Template (Optional)
              </label>
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A1A1AA] w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search workout templates..."
                    value={workoutSearch}
                    onChange={(e) => {
                      setWorkoutSearch(e.target.value)
                      setShowWorkoutDropdown(true)
                    }}
                    onFocus={() => setShowWorkoutDropdown(true)}
                    className="pl-10 bg-[#2A2A2D] border-[#3A3A3D] text-white placeholder-[#A1A1AA] focus:border-[#0070f3]"
                  />
                </div>
                {showWorkoutDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-[#2A2A2D] border border-[#3A3A3D] rounded-md shadow-lg max-h-60 overflow-y-auto">
                    <button
                      type="button"
                      className="w-full px-4 py-3 text-left hover:bg-[#3A3A3D] text-white flex items-center gap-3"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, workout_id: null }))
                        setWorkoutSearch('')
                        setShowWorkoutDropdown(false)
                      }}
                    >
                      <div className="w-8 h-8 bg-[#3A3A3D] rounded-full flex items-center justify-center text-white text-sm">
                        ✕
                      </div>
                      <div className="font-medium">No workout template</div>
                    </button>
                    {filteredWorkouts.map((workout) => (
                      <button
                        key={workout.id}
                        type="button"
                        className="w-full px-4 py-3 text-left hover:bg-[#3A3A3D] text-white flex items-center gap-3"
                        onClick={() => handleWorkoutSelect(workout)}
                      >
                        <div className="w-8 h-8 bg-[#7e3ff2] rounded-full flex items-center justify-center text-white text-sm">
                          <Dumbbell className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-medium">{workout.name}</div>
                          {workout.duration_minutes && (
                            <div className="text-sm text-[#A1A1AA]">
                              {workout.duration_minutes} minutes
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Session Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Session Title *
              </label>
              <Input
                type="text"
                placeholder="e.g., Upper Body Strength Training"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="bg-[#2A2A2D] border-[#3A3A3D] text-white placeholder-[#A1A1AA] focus:border-[#0070f3]"
              />
              {errors.title && (
                <p className="text-red-400 text-sm">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Description</label>
              <textarea
                placeholder="Session description, goals, or special instructions..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-[#2A2A2D] border border-[#3A3A3D] rounded-md text-white placeholder-[#A1A1AA] focus:border-[#0070f3] focus:outline-none resize-none"
              />
            </div>

            {/* Date and Time */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Scheduled Date & Time *
              </label>
              <Input
                type="datetime-local"
                value={formData.scheduled_at}
                onChange={(e) => handleInputChange('scheduled_at', e.target.value)}
                className="bg-[#2A2A2D] border-[#3A3A3D] text-white focus:border-[#0070f3]"
              />
              {errors.scheduled_at && (
                <p className="text-red-400 text-sm">{errors.scheduled_at}</p>
              )}
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Duration (minutes)
              </label>
              <Input
                type="number"
                placeholder="60"
                value={formData.duration_minutes || ''}
                onChange={(e) => handleInputChange('duration_minutes', e.target.value ? parseInt(e.target.value) : null)}
                min="1"
                max="480"
                className="bg-[#2A2A2D] border-[#3A3A3D] text-white placeholder-[#A1A1AA] focus:border-[#0070f3]"
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Notes</label>
              <textarea
                placeholder="Additional notes or special instructions..."
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-[#2A2A2D] border border-[#3A3A3D] rounded-md text-white placeholder-[#A1A1AA] focus:border-[#0070f3] focus:outline-none resize-none"
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="text-[#A1A1AA] hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-[#0070f3] to-[#7e3ff2] hover:from-[#0051a2] hover:to-[#5a2a9a] text-white"
              >
                {isLoading ? 'Saving...' : (session ? 'Update Session' : 'Schedule Session')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

