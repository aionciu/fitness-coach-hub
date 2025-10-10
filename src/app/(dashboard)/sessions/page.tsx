import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Plus } from 'lucide-react'

export default function SessionsPage() {
  return (
    <div className="space-y-6 lg:mt-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Sessions</h1>
          <p className="text-[#A1A1AA] text-sm">Track and manage sessions</p>
        </div>
        <Button className="bg-gradient-to-r from-[#0070f3] to-[#7e3ff2] hover:from-[#0051a2] hover:to-[#5a2a9a] text-white h-10 px-4">
          <Plus className="w-4 h-4 mr-2" />
          Schedule
        </Button>
      </div>

      {/* Calendar View Toggle */}
      <div className="flex bg-[#2A2A2D] rounded-lg p-1">
        <button className="flex-1 py-2 px-3 text-sm font-medium text-white bg-[#0070f3] rounded-md">
          Week
        </button>
        <button className="flex-1 py-2 px-3 text-sm font-medium text-[#A1A1AA] hover:text-white">
          Month
        </button>
      </div>

      {/* Empty State */}
      <Card className="bg-[#1A1A1D] border-[#2A2A2D]">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-[#2A2A2D] rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-[#A1A1AA]" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No sessions scheduled</h3>
          <p className="text-[#A1A1AA] text-sm mb-6">
            Start by scheduling your first training session
          </p>
          <Button className="bg-gradient-to-r from-[#0070f3] to-[#7e3ff2] hover:from-[#0051a2] hover:to-[#5a2a9a] text-white">
            Schedule Session
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
