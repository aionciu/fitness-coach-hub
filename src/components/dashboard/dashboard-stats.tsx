'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { sessionAPI } from '@/lib/api/sessions'
import { clientAPI } from '@/lib/api/clients'
import { SessionStats } from '@/lib/types/session'
import { ClientStats } from '@/lib/types/client'

export function DashboardStats() {
  const [sessionStats, setSessionStats] = useState<SessionStats | null>(null)
  const [clientStats, setClientStats] = useState<ClientStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setIsLoading(true)
      const [sessionsData, clientsData] = await Promise.all([
        sessionAPI.getSessionStats(),
        clientAPI.getClientStats()
      ])
      setSessionStats(sessionsData)
      setClientStats(clientsData)
    } catch (error) {
      console.error('Error loading stats:', error)
      // Use mock data for development
      setSessionStats({
        total_sessions: 24,
        scheduled_sessions: 8,
        in_progress_sessions: 2,
        completed_sessions: 12,
        cancelled_sessions: 2,
        upcoming_sessions: 10,
        today_sessions: 3
      })
      setClientStats({
        total_clients: 15,
        active_clients: 12,
        inactive_clients: 3,
        recent_clients: 4
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="bg-[#1A1A1D] border-[#2A2A2D]">
            <CardContent className="p-4">
              <div className="text-center animate-pulse">
                <div className="h-6 bg-[#2A2A2D] rounded w-8 mx-auto mb-2"></div>
                <div className="h-3 bg-[#2A2A2D] rounded w-20 mx-auto"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      <Card className="bg-[#1A1A1D] border-[#2A2A2D]">
        <CardContent className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">
              {sessionStats?.today_sessions || 0}
            </p>
            <p className="text-xs text-[#A1A1AA] mt-1">Today&apos;s Sessions</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#1A1A1D] border-[#2A2A2D]">
        <CardContent className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">
              {clientStats?.active_clients || 0}
            </p>
            <p className="text-xs text-[#A1A1AA] mt-1">Active Clients</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#1A1A1D] border-[#2A2A2D] col-span-2 lg:col-span-1">
        <CardContent className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">
              {sessionStats?.upcoming_sessions || 0}
            </p>
            <p className="text-xs text-[#A1A1AA] mt-1">Upcoming</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
