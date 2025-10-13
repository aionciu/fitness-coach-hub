'use client'

import { useState } from 'react'
import { Session } from '@/lib/types/session'
import { SessionCard } from './session-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Calendar, Plus } from 'lucide-react'

interface SessionsListProps {
  sessions: Session[]
  onEdit: (session: Session) => void
  onDelete: (session: Session) => void
  onStart: (session: Session) => void
  onStatusChange: (session: Session, status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled') => void
  onCreateNew: () => void
  onSearch: (query: string) => void
  onFilter: (status: string) => void
  isLoading?: boolean
}

export function SessionsList({
  sessions,
  onEdit,
  onDelete,
  onStart,
  onStatusChange,
  onCreateNew,
  onSearch,
  onFilter,
  isLoading = false
}: SessionsListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    onSearch(query)
  }

  const handleFilter = (status: string) => {
    setStatusFilter(status)
    onFilter(status)
  }

  const groupedSessions = sessions.reduce((groups, session) => {
    const date = new Date(session.scheduled_at).toDateString()
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(session)
    return groups
  }, {} as Record<string, Session[]>)

  const sortedDates = Object.keys(groupedSessions).sort((a, b) => 
    new Date(a).getTime() - new Date(b).getTime()
  )

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-[#1A1A1D] border border-[#2A2A2D] rounded-lg p-4">
              <div className="space-y-3">
                <div className="h-4 bg-[#2A2A2D] rounded w-3/4"></div>
                <div className="h-3 bg-[#2A2A2D] rounded w-1/2"></div>
                <div className="h-3 bg-[#2A2A2D] rounded w-1/3"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A1A1AA] w-4 h-4" />
          <Input
            type="text"
            placeholder="Search sessions..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 bg-[#2A2A2D] border-[#3A3A3D] text-white placeholder-[#A1A1AA] focus:border-[#0070f3]"
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => handleFilter(e.target.value)}
            className="px-3 py-2 bg-[#2A2A2D] border border-[#3A3A3D] rounded-md text-white text-sm focus:border-[#0070f3] focus:outline-none"
            aria-label="Filter sessions by status"
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          
          <Button
            onClick={onCreateNew}
            className="bg-gradient-to-r from-[#0070f3] to-[#7e3ff2] hover:from-[#0051a2] hover:to-[#5a2a9a] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Schedule
          </Button>
        </div>
      </div>

      {/* Sessions List */}
      {sessions.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-[#A1A1AA] mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No sessions found</h3>
          <p className="text-[#A1A1AA] text-sm mb-6">
            {searchQuery || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Start by scheduling your first training session'
            }
          </p>
          <Button
            onClick={onCreateNew}
            className="bg-gradient-to-r from-[#0070f3] to-[#7e3ff2] hover:from-[#0051a2] hover:to-[#5a2a9a] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Schedule Session
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedDates.map((date) => (
            <div key={date} className="space-y-3">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-white">
                  {new Date(date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h3>
                <span className="text-sm text-[#A1A1AA]">
                  ({groupedSessions[date].length} session{groupedSessions[date].length !== 1 ? 's' : ''})
                </span>
              </div>
              
              <div className="space-y-3">
                {groupedSessions[date].map((session) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onStart={onStart}
                    onStatusChange={onStatusChange}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
