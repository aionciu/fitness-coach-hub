import { BarChart3, Users, Calendar, Dumbbell, TrendingUp } from 'lucide-react'

export interface NavigationItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  description?: string
}

export const navigationItems: NavigationItem[] = [
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    icon: BarChart3,
    description: 'Overview and quick actions'
  },
  { 
    name: 'Clients', 
    href: '/clients', 
    icon: Users,
    description: 'Manage your client base'
  },
  { 
    name: 'Sessions', 
    href: '/sessions', 
    icon: Calendar,
    description: 'Schedule and track sessions'
  },
  { 
    name: 'Workouts', 
    href: '/workouts', 
    icon: Dumbbell,
    description: 'Build and manage workouts'
  },
  { 
    name: 'Progress', 
    href: '/progress', 
    icon: TrendingUp,
    description: 'Track client progress'
  },
]
