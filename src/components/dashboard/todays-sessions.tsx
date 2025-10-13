'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, Play, CheckCircle, XCircle, AlertCircle, Dumbbell } from 'lucide-react'
import { sessionAPI } from '@/lib/api/sessions'
import { Session } from '@/lib/types/session'
import { format, parseISO } from 'date-fns'
import Link from 'next/link'

export function TodaysSessions() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadTodaysSessions()
  }, [])

  const loadTodaysSessions = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Get today's date range
      const today = new Date()
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
      
      const todaysSessions = await sessionAPI.getSessionsByDateRange(
        startOfDay.toISOString(),
        endOfDay.toISOString()
      )
      
      setSessions(todaysSessions)
    } catch (err) {
      console.error('Error loading today\'s sessions:', err)
      setError('Failed to load today\'s sessions')
      // Use mock data for development
      setSessions([
        {
          id: '1',
          tenant_id: 'tenant-1',
          client_id: 'client-1',
          workout_id: 'workout-1',
          title: 'Upper Body Strength',
          description: 'Focus on chest and shoulders',
          scheduled_at: new Date().toISOString(),
          duration_minutes: 60,
          status: 'scheduled',
          notes: 'Client prefers free weights',
          created_by: 'user-1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
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
          title: 'Cardio HIIT',
          description: 'High-intensity interval training',
          scheduled_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
          duration_minutes: 45,
          status: 'scheduled',
          notes: 'First time doing HIIT',
          created_by: 'user-1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          client: {
            id: 'client-2',
            first_name: 'Jane',
            last_name: 'Smith',
            email: 'jane.smith@example.com',
            phone: '+1234567891',
            avatar_url: null
          },
          workout: undefined
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'text-blue-400 bg-blue-400/10 border-blue-400/20'
      case 'in_progress':
        return 'text-orange-400 bg-orange-400/10 border-orange-400/20'
      case 'completed':
        return 'text-green-400 bg-green-400/10 border-green-400/20'
      case 'cancelled':
        return 'text-red-400 bg-red-400/10 border-red-400/20'
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Calendar className="w-3 h-3" />
      case 'in_progress':
        return <Play className="w-3 h-3" />
      case 'completed':
        return <CheckCircle className="w-3 h-3" />
      case 'cancelled':
        return <XCircle className="w-3 h-3" />
      default:
        return <AlertCircle className="w-3 h-3" />
    }
  }

  const formatTime = (dateString: string) => {
    const date = parseISO(dateString)
    return format(date, 'h:mm a')
  }

  const handleStartSession = (session: Session) => {
    // TODO: Navigate to session tracking page
    console.log('Starting session:', session.id)
  }

  const handleStatusChange = async (session: Session, status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled') => {
    try {
      await sessionAPI.updateSessionStatus(session.id, status)
      // Reload sessions to reflect changes
      loadTodaysSessions()
    } catch (error) {
      console.error('Error updating session status:', error)
    }
  }

  if (isLoading) {
    return (
      <Card className="bg-[#1A1A1D] border-[#2A2A2D]">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-white">Today&apos;s Sessions</CardTitle>
          <CardDescription className="text-[#A1A1AA] text-sm">
            Your scheduled sessions for today
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-[#2A2A2D] rounded-lg p-3">
                  <div className="h-4 bg-[#3A3A3D] rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-[#3A3A3D] rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="bg-[#1A1A1D] border-[#2A2A2D]">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-white">Today&apos;s Sessions</CardTitle>
          <CardDescription className="text-[#A1A1AA] text-sm">
            Your scheduled sessions for today
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-center py-4">
            <p className="text-red-400 text-sm mb-2">{error}</p>
            <Button 
              onClick={loadTodaysSessions}
              variant="outline"
              size="sm"
              className="text-[#A1A1AA] hover:text-white"
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-[#1A1A1D] border-[#2A2A2D]">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg text-white">Today&apos;s Sessions</CardTitle>
            <CardDescription className="text-[#A1A1AA] text-sm">
              {sessions.length} session{sessions.length !== 1 ? 's' : ''} scheduled
            </CardDescription>
          </div>
          <Link href="/sessions">
            <Button variant="ghost" size="sm" className="text-[#A1A1AA] hover:text-white">
              View All
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {sessions.length === 0 ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-[#2A2A2D] rounded-full flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-6 h-6 text-[#A1A1AA]" />
            </div>
            <h3 className="text-base font-semibold text-white mb-1">No sessions today</h3>
            <p className="text-[#A1A1AA] text-sm mb-3">Schedule your first session to get started</p>
            <Link href="/sessions">
              <Button 
                size="sm"
                className="bg-gradient-to-r from-[#0070f3] to-[#7e3ff2] hover:from-[#0051a2] hover:to-[#5a2a9a] text-white"
              >
                Schedule Session
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {sessions.map((session) => (
              <div key={session.id} className="bg-[#2A2A2D] rounded-lg p-3 hover:bg-[#3A3A3D] transition-colors">
                {/* Compact Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-[#0070f3] to-[#7e3ff2] rounded-md flex flex-col items-center justify-center">
                      <span className="text-white font-semibold text-xs leading-none">
                        {formatTime(session.scheduled_at).split(' ')[0]}
                      </span>
                      <span className="text-white text-xs leading-none opacity-80">
                        {formatTime(session.scheduled_at).split(' ')[1]}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">
                        {session.client?.first_name} {session.client?.last_name}
                      </h4>
                      <p className="text-xs text-[#A1A1AA] font-medium">
                        {session.title}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                      {getStatusIcon(session.status)}
                      {session.status.replace('_', ' ')}
                    </span>
                    
                    {/* Inline Action Button */}
                    {session.status === 'scheduled' && (
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-[#0070f3] to-[#7e3ff2] hover:from-[#0051a2] hover:to-[#5a2a9a] text-white px-3 py-1 h-6 text-xs"
                        onClick={() => handleStartSession(session)}
                      >
                        <Play className="w-3 h-3 mr-1" />
                        Start
                      </Button>
                    )}
                    
                    {session.status === 'in_progress' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-green-400 text-green-400 hover:bg-green-400/10 px-3 py-1 h-6 text-xs"
                        onClick={() => handleStatusChange(session, 'completed')}
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Complete
                      </Button>
                    )}

                    {session.status === 'completed' && (
                      <div className="flex items-center gap-1 text-green-400">
                        <CheckCircle className="w-3 h-3" />
                        <span className="text-xs font-medium">Done</span>
                      </div>
                    )}

                    {session.status === 'cancelled' && (
                      <div className="flex items-center gap-1 text-red-400">
                        <XCircle className="w-3 h-3" />
                        <span className="text-xs font-medium">Cancelled</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Compact Details Row */}
                <div className="flex items-center justify-between text-xs text-[#A1A1AA]">
                  <div className="flex items-center gap-3">
                    {session.duration_minutes && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{session.duration_minutes} min</span>
                      </div>
                    )}
                    {session.workout && (
                      <div className="flex items-center gap-1">
                        <Dumbbell className="w-3 h-3" />
                        <span className="truncate max-w-24">{session.workout.name}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description (if exists) */}
                {session.description && (
                  <p className="text-xs text-[#A1A1AA] mt-1 line-clamp-1">{session.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
