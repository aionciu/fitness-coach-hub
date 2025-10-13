'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Calendar, 
  Clock, 
  User, 
  Dumbbell, 
  MoreVertical, 
  Play, 
  Edit, 
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'
import { Session } from '@/lib/types/session'
import { format, isToday, isTomorrow, isYesterday, parseISO } from 'date-fns'

interface SessionCardProps {
  session: Session
  onEdit: (session: Session) => void
  onDelete: (session: Session) => void
  onStart: (session: Session) => void
  onStatusChange: (session: Session, status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled') => void
}

export function SessionCard({ session, onEdit, onDelete, onStart, onStatusChange }: SessionCardProps) {
  const [showActions, setShowActions] = useState(false)

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

  const formatDate = (dateString: string) => {
    const date = parseISO(dateString)
    
    if (isToday(date)) {
      return `Today at ${format(date, 'h:mm a')}`
    } else if (isTomorrow(date)) {
      return `Tomorrow at ${format(date, 'h:mm a')}`
    } else if (isYesterday(date)) {
      return `Yesterday at ${format(date, 'h:mm a')}`
    } else {
      return format(date, 'MMM d, yyyy h:mm a')
    }
  }

  const canStart = session.status === 'scheduled' || session.status === 'in_progress'
  const canEdit = session.status === 'scheduled'
  const canDelete = session.status === 'scheduled' || session.status === 'cancelled'

  return (
    <Card className="bg-[#1A1A1D] border-[#2A2A2D] hover:border-[#3A3A3D] transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">{session.title}</h3>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(session.status)}`}>
                  {getStatusIcon(session.status)}
                  {session.status.replace('_', ' ')}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-[#A1A1AA] hover:text-white"
                  onClick={() => setShowActions(!showActions)}
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Client Info */}
            <div className="flex items-center gap-2 text-[#A1A1AA]">
              <User className="w-4 h-4" />
              <span className="text-sm">
                {session.client?.first_name} {session.client?.last_name}
              </span>
              {session.client?.email && (
                <span className="text-xs text-[#666]">• {session.client.email}</span>
              )}
            </div>

            {/* Workout Info */}
            {session.workout && (
              <div className="flex items-center gap-2 text-[#A1A1AA]">
                <Dumbbell className="w-4 h-4" />
                <span className="text-sm">{session.workout.name}</span>
                {session.workout.duration_minutes && (
                  <span className="text-xs text-[#666]">
                    • {session.workout.duration_minutes} min
                  </span>
                )}
              </div>
            )}

            {/* Date and Duration */}
            <div className="flex items-center gap-4 text-sm text-[#A1A1AA]">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(session.scheduled_at)}</span>
              </div>
              {session.duration_minutes && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{session.duration_minutes} minutes</span>
                </div>
              )}
            </div>

            {/* Description */}
            {session.description && (
              <p className="text-sm text-[#A1A1AA] line-clamp-2">{session.description}</p>
            )}

            {/* Notes */}
            {session.notes && (
              <div className="text-xs text-[#666] bg-[#2A2A2D] p-2 rounded">
                <strong>Notes:</strong> {session.notes}
              </div>
            )}
          </div>

          {/* Actions Dropdown */}
          {showActions && (
            <div className="absolute right-4 top-12 bg-[#2A2A2D] border border-[#3A3A3D] rounded-md shadow-lg z-10 min-w-[160px]">
              <div className="py-1">
                {canStart && (
                  <button
                    className="w-full px-4 py-2 text-left text-sm text-white hover:bg-[#3A3A3D] flex items-center gap-2"
                    onClick={() => {
                      onStart(session)
                      setShowActions(false)
                    }}
                  >
                    <Play className="w-4 h-4" />
                    {session.status === 'scheduled' ? 'Start Session' : 'Continue Session'}
                  </button>
                )}
                
                {canEdit && (
                  <button
                    className="w-full px-4 py-2 text-left text-sm text-white hover:bg-[#3A3A3D] flex items-center gap-2"
                    onClick={() => {
                      onEdit(session)
                      setShowActions(false)
                    }}
                  >
                    <Edit className="w-4 h-4" />
                    Edit Session
                  </button>
                )}

                {session.status === 'scheduled' && (
                  <button
                    className="w-full px-4 py-2 text-left text-sm text-white hover:bg-[#3A3A3D] flex items-center gap-2"
                    onClick={() => {
                      onStatusChange(session, 'cancelled')
                      setShowActions(false)
                    }}
                  >
                    <XCircle className="w-4 h-4" />
                    Cancel Session
                  </button>
                )}

                {session.status === 'in_progress' && (
                  <button
                    className="w-full px-4 py-2 text-left text-sm text-white hover:bg-[#3A3A3D] flex items-center gap-2"
                    onClick={() => {
                      onStatusChange(session, 'completed')
                      setShowActions(false)
                    }}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Complete Session
                  </button>
                )}

                {canDelete && (
                  <button
                    className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-[#3A3A3D] flex items-center gap-2"
                    onClick={() => {
                      onDelete(session)
                      setShowActions(false)
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Session
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 mt-4 pt-4 border-t border-[#2A2A2D]">
          {canStart && (
            <Button
              size="sm"
              className="bg-gradient-to-r from-[#0070f3] to-[#7e3ff2] hover:from-[#0051a2] hover:to-[#5a2a9a] text-white flex-1"
              onClick={() => onStart(session)}
            >
              <Play className="w-4 h-4 mr-2" />
              {session.status === 'scheduled' ? 'Start Session' : 'Continue'}
            </Button>
          )}
          
          {canEdit && (
            <Button
              size="sm"
              variant="outline"
              className="border-[#3A3A3D] text-[#A1A1AA] hover:text-white hover:border-[#0070f3]"
              onClick={() => onEdit(session)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

