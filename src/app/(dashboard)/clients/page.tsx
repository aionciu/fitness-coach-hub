import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Plus, Search } from 'lucide-react'

export default function ClientsPage() {
  return (
    <div className="space-y-6 lg:mt-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Clients</h1>
          <p className="text-[#A1A1AA] text-sm">Manage your client base</p>
        </div>
        <Button className="bg-gradient-to-r from-[#0070f3] to-[#7e3ff2] hover:from-[#0051a2] hover:to-[#5a2a9a] text-white h-10 px-4">
          <Plus className="w-4 h-4 mr-2" />
          Add Client
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search clients..."
          className="w-full bg-[#2A2A2D] border border-[#3A3A3D] rounded-lg px-4 py-3 text-white placeholder:text-[#A1A1AA] focus:border-[#0070f3] focus:outline-none"
        />
        <Search className="absolute right-3 top-3 w-5 h-5 text-[#A1A1AA]" />
      </div>

      {/* Empty State */}
      <Card className="bg-[#1A1A1D] border-[#2A2A2D]">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-[#2A2A2D] rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-[#A1A1AA]" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No clients yet</h3>
          <p className="text-[#A1A1AA] text-sm mb-6">
            Start building your client base by adding your first client
          </p>
          <Button className="bg-gradient-to-r from-[#0070f3] to-[#7e3ff2] hover:from-[#0051a2] hover:to-[#5a2a9a] text-white">
            Add Your First Client
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
