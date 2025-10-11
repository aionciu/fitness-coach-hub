'use client'

import { Search } from 'lucide-react'

interface ClientFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  filterActive: 'all' | 'active' | 'inactive'
  onFilterChange: (filter: 'all' | 'active' | 'inactive') => void
}

export function ClientFilters({
  searchQuery,
  onSearchChange,
  filterActive,
  onFilterChange
}: ClientFiltersProps) {
  return (
    <div className="flex gap-2 max-w-2xl">
      {/* Search Input */}
      <div className="relative flex-1">
        <input
          type="text"
          placeholder="Search clients..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-[#2A2A2D] border border-[#3A3A3D] rounded-lg px-3 py-2 text-white placeholder:text-[#A1A1AA] focus:border-[#0070f3] focus:outline-none text-sm"
        />
        <Search className="absolute right-3 top-2.5 w-4 h-4 text-[#A1A1AA]" />
      </div>
      
      {/* Filter Dropdown */}
      <select
        value={filterActive}
        onChange={(e) => onFilterChange(e.target.value as 'all' | 'active' | 'inactive')}
        className="bg-[#2A2A2D] border border-[#3A3A3D] rounded-lg px-3 py-2 text-white focus:border-[#0070f3] focus:outline-none text-sm w-24"
        aria-label="Filter clients by status"
      >
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
    </div>
  )
}
