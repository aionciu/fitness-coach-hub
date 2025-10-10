'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Dumbbell, TrendingUp, BarChart3, Calendar } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-[#1A1A1D] border-[#2A2A2D]">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">0</p>
              <p className="text-xs text-[#A1A1AA] mt-1">Today&apos;s Sessions</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1A1A1D] border-[#2A2A2D]">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">0</p>
              <p className="text-xs text-[#A1A1AA] mt-1">Active Clients</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1A1A1D] border-[#2A2A2D] col-span-2 lg:col-span-1">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">0</p>
              <p className="text-xs text-[#A1A1AA] mt-1">This Week</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Sessions */}
      <Card className="bg-[#1A1A1D] border-[#2A2A2D]">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-white">Today&apos;s Sessions</CardTitle>
          <CardDescription className="text-[#A1A1AA] text-sm">
            Your scheduled sessions for today
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-[#2A2A2D] rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-[#A1A1AA]" />
            </div>
            <p className="text-[#A1A1AA] text-sm">No sessions scheduled today</p>
            <Button 
              className="mt-4 bg-gradient-to-r from-[#0070f3] to-[#7e3ff2] hover:from-[#0051a2] hover:to-[#5a2a9a] text-white text-sm px-4 py-2"
              size="sm"
            >
              Schedule Session
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          <Button className="bg-gradient-to-r from-[#0070f3] to-[#7e3ff2] hover:from-[#0051a2] hover:to-[#5a2a9a] text-white h-12 text-sm">
            <Users className="w-4 h-4 mr-2" />
            Add Client
          </Button>
          <Button variant="outline" className="h-12 text-sm">
            <Dumbbell className="w-4 h-4 mr-2" />
            Create Workout
          </Button>
          <Button variant="outline" className="h-12 text-sm">
            <TrendingUp className="w-4 h-4 mr-2" />
            View Progress
          </Button>
          <Button variant="outline" className="h-12 text-sm">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </Button>
        </div>
      </div>
    </div>
  )
}
