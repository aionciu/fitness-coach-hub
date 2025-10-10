'use client'

import { 
  MobileHeader, 
  DesktopSidebar, 
  MobileBottomNavigation 
} from '@/components/navigation'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      {/* Mobile Header */}
      <MobileHeader />

      {/* Desktop Sidebar */}
      <DesktopSidebar />

      {/* Main Content */}
      <main className="pb-20 lg:pb-0 lg:ml-64">
        {/* Page Content */}
        <div className="px-4 py-6 lg:px-8 lg:py-0 lg:pb-8">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNavigation />
    </div>
  )
}
