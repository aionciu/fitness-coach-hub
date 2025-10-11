'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { 
  MoreVertical, 
  Phone, 
  Mail, 
  Calendar, 
  Target,
  Edit,
  Trash2,
  UserCheck,
  UserX
} from 'lucide-react'
import { Client } from '@/lib/types/client'
import { format } from 'date-fns'

interface ClientCardProps {
  client: Client
  onEdit: (client: Client) => void
  onDelete: (clientId: string) => void
  onToggleActive: (clientId: string, isActive: boolean) => void
  isUpdating?: boolean
}

export function ClientCard({ client, onEdit, onDelete, onToggleActive, isUpdating = false }: ClientCardProps) {
  const [showActions, setShowActions] = useState(false)
  const actionsRef = useRef<HTMLDivElement>(null)

  // Close actions menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionsRef.current && !actionsRef.current.contains(event.target as Node)) {
        setShowActions(false)
      }
    }

    if (showActions) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showActions])

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy')
    } catch {
      return 'Invalid date'
    }
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  const getAge = (dateOfBirth: string) => {
    try {
      const birthDate = new Date(dateOfBirth)
      const today = new Date()
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }
      
      return age
    } catch {
      return null
    }
  }

  const formatPhoneWithPrefix = (phone: string) => {
    let formattedPhone = phone
    
    // If phone already starts with +, use as is
    if (phone.startsWith('+')) {
      formattedPhone = phone
    }
    // If phone starts with 0, replace with +40 (Romania default)
    else if (phone.startsWith('0')) {
      formattedPhone = '+40' + phone.substring(1)
    }
    // If phone doesn't start with + or 0, add +40 prefix
    else {
      formattedPhone = '+40' + phone
    }
    
    // Add spaces for better readability
    // For Romanian numbers (+40): +40 XXX XXX XXX
    if (formattedPhone.startsWith('+40')) {
      const digits = formattedPhone.substring(3).replace(/\D/g, '')
      if (digits.length >= 9) {
        return `+40 ${digits.substring(0, 3)} ${digits.substring(3, 6)} ${digits.substring(6, 9)}`
      }
    }
    // For other countries, add spaces every 3 digits after country code
    else if (formattedPhone.startsWith('+')) {
      const match = formattedPhone.match(/^(\+\d{1,3})(\d+)$/)
      if (match) {
        const countryCode = match[1]
        const digits = match[2].replace(/\D/g, '')
        if (digits.length > 3) {
          const formatted = digits.replace(/(\d{3})(?=\d)/g, '$1 ')
          return `${countryCode} ${formatted}`
        }
        return `${countryCode} ${digits}`
      }
    }
    
    return formattedPhone
  }

  return (
    <Card className="relative bg-gradient-to-br from-[#0a0a0b] to-[#1a1a1d] border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 h-full group backdrop-blur-sm">
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/3 to-transparent pointer-events-none" />
      
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/15 to-purple-500/15 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-pink-500/15 to-orange-500/15 rounded-full blur-xl" />
      </div>
      
      <CardContent className="relative p-4 sm:p-5 h-full">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="relative group/avatar">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-sm opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300" />
              <Avatar className="relative w-12 h-12 sm:w-14 sm:h-14 ring-2 ring-white/10 group-hover:ring-white/20 transition-all duration-300 group-hover:scale-105">
                {client.avatar_url ? (
                  <img 
                    src={client.avatar_url} 
                    alt={`${client.first_name} ${client.last_name}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm sm:text-base">
                    {getInitials(client.first_name, client.last_name)}
                  </div>
                )}
              </Avatar>
              <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-[#0a0a0b] ${client.is_active ? 'bg-emerald-400 shadow-md shadow-emerald-400/50' : 'bg-gray-400'}`} />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-1 truncate">
                {client.first_name} {client.last_name}
              </h3>
              <span className="text-xs sm:text-sm font-medium text-gray-400">
                {client.is_active ? 'Active Client' : 'Inactive Client'}
              </span>
            </div>
          </div>
          
              <div className="relative" ref={actionsRef}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 sm:h-9 sm:w-9 p-0 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl backdrop-blur-sm border border-white/10 transition-all duration-200 hover:scale-105"
                  onClick={() => setShowActions(!showActions)}
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
                
                {showActions && (
                  <div className="absolute right-0 top-10 z-50 w-40 bg-black/95 backdrop-blur-xl border border-white/20 rounded-lg shadow-xl overflow-visible">
                <div className="py-1">
                  <button
                    className="w-full px-3 py-2 text-left text-sm text-white hover:bg-white/10 flex items-center space-x-2 transition-colors"
                    onClick={() => {
                      onEdit(client)
                      setShowActions(false)
                    }}
                  >
                    <Edit className="w-4 h-4 text-blue-400" />
                    <span>Edit</span>
                  </button>
                  
                  <button
                    className="w-full px-3 py-2 text-left text-sm text-white hover:bg-white/10 flex items-center space-x-2 transition-colors"
                    onClick={() => {
                      onToggleActive(client.id, !client.is_active)
                      setShowActions(false)
                    }}
                  >
                    {client.is_active ? (
                      <UserX className="w-4 h-4 text-orange-400" />
                    ) : (
                      <UserCheck className="w-4 h-4 text-emerald-400" />
                    )}
                    <span>{client.is_active ? 'Deactivate' : 'Activate'}</span>
                  </button>
                  
                  <div className="border-t border-white/10 my-1" />
                  
                  <button
                    className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 flex items-center space-x-2 transition-colors"
                    onClick={() => {
                      onDelete(client.id)
                      setShowActions(false)
                    }}
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Contact Information - Compact Layout */}
        <div className="space-y-2">
          {client.email && (
            <div className="flex items-center space-x-3 p-2.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-200">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="w-4 h-4 text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 truncate">{client.email}</p>
              </div>
            </div>
          )}
          
          {client.phone && (
            <div className="flex items-center space-x-3 p-2.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-200">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Phone className="w-4 h-4 text-purple-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white truncate">{formatPhoneWithPrefix(client.phone)}</p>
              </div>
            </div>
          )}
          
          {client.date_of_birth && (
            <div className="flex items-center space-x-3 p-2.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-200">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white truncate">
                  {formatDate(client.date_of_birth)}
                  {getAge(client.date_of_birth) && (
                    <span className="text-gray-400 ml-1">• {getAge(client.date_of_birth)}y</span>
                  )}
                </p>
              </div>
            </div>
          )}
          
          {client.goals && (
            <div className="p-2.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-200">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-pink-500/20 to-pink-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Target className="w-4 h-4 text-pink-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white line-clamp-2 leading-relaxed">{client.goals}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

