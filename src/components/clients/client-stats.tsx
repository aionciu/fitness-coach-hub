'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Users, UserCheck, UserX, UserPlus, TrendingUp } from 'lucide-react'
import { ClientStats } from '@/lib/types/client'

interface ClientStatsProps {
  stats: ClientStats
  isLoading?: boolean
}

export function ClientStats({ stats, isLoading = false }: ClientStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-[#1A1A1D] border-[#2A2A2D]">
            <CardContent className="p-4">
              <div className="animate-pulse">
                <div className="h-4 bg-[#2A2A2D] rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-[#2A2A2D] rounded w-1/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Clients',
      value: stats.total_clients,
      icon: Users,
      color: 'from-[#0070f3] to-[#7e3ff2]',
      bgColor: 'bg-[#0070f3]/10',
    },
    {
      title: 'Active Clients',
      value: stats.active_clients,
      icon: UserCheck,
      color: 'from-[#10b981] to-[#059669]',
      bgColor: 'bg-[#10b981]/10',
    },
    {
      title: 'Inactive Clients',
      value: stats.inactive_clients,
      icon: UserX,
      color: 'from-[#6b7280] to-[#4b5563]',
      bgColor: 'bg-[#6b7280]/10',
    },
    {
      title: 'New This Month',
      value: stats.recent_clients,
      icon: UserPlus,
      color: 'from-[#f59e0b] to-[#d97706]',
      bgColor: 'bg-[#f59e0b]/10',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index} className="bg-[#1A1A1D] border-[#2A2A2D] hover:border-[#3A3A3D] transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#A1A1AA] text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

