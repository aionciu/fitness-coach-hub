'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Plus, Trash2, UserCheck, UserX } from 'lucide-react'
import { ClientCard, ClientFormModal, ClientStats, ClientFilters } from '@/components/clients'
import { clientAPI } from '@/lib/api/clients'
import { Client, CreateClientData, UpdateClientData, ClientStats as ClientStatsType } from '@/lib/types/client'

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [filteredClients, setFilteredClients] = useState<Client[]>([])
  const [stats, setStats] = useState<ClientStatsType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all')
  const [selectedClients, setSelectedClients] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [updatingClients, setUpdatingClients] = useState<Set<string>>(new Set())

  // Load clients and stats
  useEffect(() => {
    loadData()
  }, [])

  // Filter clients based on search and filter
  useEffect(() => {
    let filtered = clients

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(client =>
        `${client.first_name} ${client.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.phone?.includes(searchQuery)
      )
    }

    // Apply active/inactive filter
    if (filterActive === 'active') {
      filtered = filtered.filter(client => client.is_active)
    } else if (filterActive === 'inactive') {
      filtered = filtered.filter(client => !client.is_active)
    }

    setFilteredClients(filtered)
  }, [clients, searchQuery, filterActive])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [clientsData, statsData] = await Promise.all([
        clientAPI.getClients(),
        clientAPI.getClientStats()
      ])
      setClients(clientsData)
      setStats(statsData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddClient = () => {
    setEditingClient(null)
    setIsFormOpen(true)
  }

  const handleEditClient = (client: Client) => {
    setEditingClient(client)
    setIsFormOpen(true)
  }

  const handleSubmitClient = async (data: Omit<CreateClientData, 'tenant_id'> | UpdateClientData) => {
    try {
      setIsSubmitting(true)
      if (editingClient) {
        await clientAPI.updateClient(editingClient.id, data)
      } else {
        await clientAPI.createClient(data as Omit<CreateClientData, 'tenant_id'>)
      }
      await loadData()
    } catch (error) {
      console.error('Error saving client:', error)
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteClient = async (clientId: string) => {
    if (!confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
      return
    }

    try {
      await clientAPI.deleteClient(clientId)
      await loadData()
    } catch (error) {
      console.error('Error deleting client:', error)
    }
  }

  const handleToggleActive = async (clientId: string, isActive: boolean) => {
    try {
      console.log('Toggling client status:', clientId, 'to', isActive)
      
      // Add to updating clients set
      setUpdatingClients(prev => new Set(prev).add(clientId))
      
      // Optimistic update - immediately update the UI
      setClients(prevClients => 
        prevClients.map(client => 
          client.id === clientId 
            ? { ...client, is_active: isActive }
            : client
        )
      )
      
      // Update in database
      await clientAPI.updateClient(clientId, { is_active: isActive })
      
      console.log('Client status updated successfully')
    } catch (error) {
      console.error('Error updating client status:', error)
      
      // Revert optimistic update on error
      setClients(prevClients => 
        prevClients.map(client => 
          client.id === clientId 
            ? { ...client, is_active: !isActive } // Revert to previous state
            : client
        )
      )
      
      alert(`Failed to update client status: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      // Remove from updating clients set
      setUpdatingClients(prev => {
        const newSet = new Set(prev)
        newSet.delete(clientId)
        return newSet
      })
    }
  }

  const handleBulkAction = async (action: 'activate' | 'deactivate' | 'delete') => {
    if (selectedClients.length === 0) return

    const actionText = action === 'delete' ? 'delete' : `${action}`
    if (!confirm(`Are you sure you want to ${actionText} ${selectedClients.length} client(s)?`)) {
      return
    }

    try {
      if (action === 'delete') {
        await clientAPI.bulkDeleteClients(selectedClients)
      } else {
        await clientAPI.bulkUpdateClients(selectedClients, { 
          is_active: action === 'activate' 
        })
      }
      setSelectedClients([])
      await loadData()
    } catch (error) {
      console.error(`Error ${action}ing clients:`, error)
    }
  }

  const toggleClientSelection = (clientId: string) => {
    setSelectedClients(prev =>
      prev.includes(clientId)
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    )
  }


  const clearSelection = () => {
    setSelectedClients([])
  }

  return (
    <div className="max-w-4xl mx-auto px-4 space-y-6 lg:mt-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Clients</h1>
          <p className="text-[#A1A1AA] text-sm">Manage your client base</p>
        </div>
        <Button 
          onClick={handleAddClient}
          className="bg-gradient-to-r from-[#0070f3] to-[#7e3ff2] hover:from-[#0051a2] hover:to-[#5a2a9a] text-white h-10 px-4"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Client
        </Button>
      </div>

      {/* Stats - Hidden on mobile */}
      {stats && (
        <div className="hidden md:block">
          <ClientStats stats={stats} isLoading={isLoading} />
        </div>
      )}

      {/* Search and Filters */}
      <ClientFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterActive={filterActive}
        onFilterChange={setFilterActive}
      />

      {/* Bulk Actions */}
      {selectedClients.length > 0 && (
        <Card className="bg-[#1A1A1D] border-[#2A2A2D]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-white text-sm">
                  {selectedClients.length} client(s) selected
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearSelection}
                  className="border-[#3A3A3D] text-[#A1A1AA] hover:bg-[#2A2A2D]"
                >
                  Clear Selection
                </Button>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('activate')}
                  className="border-[#3A3A3D] text-[#A1A1AA] hover:bg-[#2A2A2D]"
                >
                  <UserCheck className="w-4 h-4 mr-1" />
                  Activate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('deactivate')}
                  className="border-[#3A3A3D] text-[#A1A1AA] hover:bg-[#2A2A2D]"
                >
                  <UserX className="w-4 h-4 mr-1" />
                  Deactivate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('delete')}
                  className="border-[#3A3A3D] text-red-400 hover:bg-[#2A2A2D]"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Client List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="bg-[#1A1A1D] border-[#2A2A2D]">
              <CardContent className="p-4">
                <div className="animate-pulse">
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 bg-[#2A2A2D] rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-[#2A2A2D] rounded w-3/4"></div>
                      <div className="h-3 bg-[#2A2A2D] rounded w-1/2"></div>
                      <div className="h-3 bg-[#2A2A2D] rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredClients.length === 0 ? (
        <Card className="bg-[#1A1A1D] border-[#2A2A2D]">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-[#2A2A2D] rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-[#A1A1AA]" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {clients.length === 0 ? 'No clients yet' : 'No clients found'}
            </h3>
            <p className="text-[#A1A1AA] text-sm mb-6">
              {clients.length === 0 
                ? 'Start building your client base by adding your first client'
                : 'Try adjusting your search or filter criteria'
              }
            </p>
            {clients.length === 0 && (
              <Button 
                onClick={handleAddClient}
                className="bg-gradient-to-r from-[#0070f3] to-[#7e3ff2] hover:from-[#0051a2] hover:to-[#5a2a9a] text-white"
              >
                Add Your First Client
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-visible">
          {filteredClients.map((client) => (
            <div key={client.id} className="relative h-full overflow-visible">
              {selectedClients.length > 0 && (
                <input
                  type="checkbox"
                  checked={selectedClients.includes(client.id)}
                  onChange={() => toggleClientSelection(client.id)}
                  className="absolute top-4 left-4 z-10 w-4 h-4 text-[#0070f3] bg-[#2A2A2D] border-[#3A3A3D] rounded focus:ring-[#0070f3] focus:ring-2"
                  aria-label={`Select ${client.first_name} ${client.last_name}`}
                />
              )}
              <ClientCard
                client={client}
                onEdit={handleEditClient}
                onDelete={handleDeleteClient}
                onToggleActive={handleToggleActive}
                isUpdating={updatingClients.has(client.id)}
              />
            </div>
          ))}
        </div>
      )}


      {/* Client Form Modal */}
      <ClientFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setEditingClient(null)
        }}
        onSubmit={handleSubmitClient}
        client={editingClient}
        isLoading={isSubmitting}
      />
    </div>
  )
}
