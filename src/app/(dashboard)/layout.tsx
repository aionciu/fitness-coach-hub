'use client'

import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  { name: 'Clients', href: '/clients', icon: '👥' },
  { name: 'Sessions', href: '/sessions', icon: '🗓️' },
  { name: 'Workouts', href: '/workouts', icon: '🏗️' },
  { name: 'Progress', href: '/progress', icon: '📈' },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, signOut } = useAuth()
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E0E10] to-[#1A1A1D]">
      {/* Header */}
      <header className="bg-[#1A1A1D] border-b border-[#2A2A2D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-[#0070f3] to-[#7e3ff2] rounded-full flex items-center justify-center mr-3">
                <span className="text-sm font-bold text-white">FC</span>
              </div>
              <h1 className="text-xl font-bold text-white">Fitness Coach Hub</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-[#A1A1AA]">{user?.email}</span>
              <Button
                onClick={signOut}
                variant="outline"
                size="sm"
                className="border-[#2A2A2D] text-white hover:bg-[#2A2A2D]"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-[#1A1A1D] border-b border-[#2A2A2D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 transition-colors ${
                    isActive
                      ? 'border-[#0070f3] text-[#0070f3]'
                      : 'border-transparent text-[#A1A1AA] hover:text-white hover:border-[#3A3A3D]'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
