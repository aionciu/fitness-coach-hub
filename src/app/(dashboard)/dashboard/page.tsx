'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
  return (
    <div>
      {/* Dashboard Content */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-[#1A1A1D] border-[#2A2A2D]">
            <CardHeader>
              <CardTitle className="text-white">Today&apos;s Sessions</CardTitle>
              <CardDescription className="text-[#A1A1AA]">
                Your scheduled sessions for today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-white">0</p>
              <p className="text-sm text-[#A1A1AA]">No sessions scheduled</p>
            </CardContent>
          </Card>

          <Card className="bg-[#1A1A1D] border-[#2A2A2D]">
            <CardHeader>
              <CardTitle className="text-white">Active Clients</CardTitle>
              <CardDescription className="text-[#A1A1AA]">
                Total number of active clients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-white">0</p>
              <p className="text-sm text-[#A1A1AA]">No clients yet</p>
            </CardContent>
          </Card>

          <Card className="bg-[#1A1A1D] border-[#2A2A2D]">
            <CardHeader>
              <CardTitle className="text-white">This Week</CardTitle>
              <CardDescription className="text-[#A1A1AA]">
                Sessions completed this week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-white">0</p>
              <p className="text-sm text-[#A1A1AA]">No sessions this week</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button className="bg-gradient-to-r from-[#0070f3] to-[#7e3ff2] hover:from-[#0051a2] hover:to-[#5a2a9a] text-white">
              Add Client
            </Button>
            <Button variant="outline" className="border-[#2A2A2D] text-white hover:bg-[#2A2A2D]">
              Schedule Session
            </Button>
            <Button variant="outline" className="border-[#2A2A2D] text-white hover:bg-[#2A2A2D]">
              Create Workout
            </Button>
            <Button variant="outline" className="border-[#2A2A2D] text-white hover:bg-[#2A2A2D]">
              View Progress
            </Button>
          </div>
        </div>
    </div>
  )
}
