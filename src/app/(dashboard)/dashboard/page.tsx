'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Dumbbell, TrendingUp, BarChart3, Calendar } from 'lucide-react'
import Link from 'next/link'
import { TodaysSessions, DashboardStats } from '@/components/dashboard'

export default function DashboardPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 space-y-6 lg:mt-4">
      {/* Welcome Section - Desktop Only */}
      <div className="hidden lg:block">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">Welcome back!</h2>
          <p className="text-[#A1A1AA] mt-1">Here&apos;s your day at a glance</p>
        </div>
      </div>

      {/* Stats Grid */}
      <DashboardStats />

      {/* Today's Sessions */}
      <TodaysSessions />

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          <Link href="/clients">
            <Button className="bg-gradient-to-r from-[#0070f3] to-[#7e3ff2] hover:from-[#0051a2] hover:to-[#5a2a9a] text-white h-12 text-sm w-full">
              <Users className="w-4 h-4 mr-2" />
              Add Client
            </Button>
          </Link>
          <Link href="/sessions">
            <Button variant="outline" className="h-12 text-sm w-full">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Session
            </Button>
          </Link>
          <Link href="/workouts">
            <Button variant="outline" className="h-12 text-sm w-full">
              <Dumbbell className="w-4 h-4 mr-2" />
              Create Workout
            </Button>
          </Link>
          <Link href="/progress">
            <Button variant="outline" className="h-12 text-sm w-full">
              <TrendingUp className="w-4 h-4 mr-2" />
              View Progress
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
