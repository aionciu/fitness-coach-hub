'use client'

import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'

export function MobileHeader() {
  const { signOut } = useAuth()

  return (
    <header className="bg-[#1A1A1D] border-b border-[#2A2A2D] lg:hidden">
      <div className="px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-[#0070f3] to-[#7e3ff2] rounded-full flex items-center justify-center mr-3">
              <span className="text-sm font-bold text-white">FC</span>
            </div>
            <h1 className="text-lg font-bold text-white">Fitness Coach Hub</h1>
          </div>
          
          <Button
            onClick={signOut}
            variant="outline"
            size="sm"
            className="text-xs px-2 py-1"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  )
}
