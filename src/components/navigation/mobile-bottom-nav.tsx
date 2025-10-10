'use client'

import { usePathname } from 'next/navigation'
import { navigationItems } from './navigation-data'
import { NavigationItemComponent } from './navigation-item'

export function MobileBottomNavigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#1A1A1D] border-t border-[#2A2A2D] lg:hidden z-50">
      <div className="flex">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <NavigationItemComponent
              key={item.name}
              item={item}
              isActive={isActive}
              variant="mobile"
            />
          )
        })}
      </div>
    </nav>
  )
}
