'use client'

import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { navigationItems } from './navigation-data'
import { NavigationItemComponent } from './navigation-item'

export function DesktopSidebar() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:bg-[#0E0E10] lg:border-r lg:border-[#2A2A2D] lg:h-screen lg:fixed lg:left-0 lg:top-0 lg:z-40">
      {/* Logo */}
      <div className="flex items-center px-6 py-6 border-b border-[#2A2A2D]">
        <div className="w-10 h-10 bg-gradient-to-r from-[#0070f3] to-[#7e3ff2] rounded-xl flex items-center justify-center mr-3">
          <span className="text-lg font-bold text-white">FC</span>
        </div>
        <div>
          <h1 className="text-lg font-bold text-white">Fitness Coach</h1>
          <p className="text-xs text-[#A1A1AA]">Hub</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <NavigationItemComponent
              key={item.name}
              item={item}
              isActive={isActive}
              variant="sidebar"
            />
          )
        })}
      </nav>

      {/* User Info */}
      <div className="px-4 py-4 border-t border-[#2A2A2D]">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-8 h-8 bg-gradient-to-r from-[#0070f3] to-[#7e3ff2] rounded-full flex items-center justify-center">
            <span className="text-sm font-bold text-white">
              {user?.email?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.email}
            </p>
            <p className="text-xs text-[#A1A1AA]">Coach</p>
          </div>
        </div>
        <Button
          onClick={signOut}
          variant="outline"
          size="sm"
          className="w-full"
        >
          Sign Out
        </Button>
      </div>
    </aside>
  )
}
