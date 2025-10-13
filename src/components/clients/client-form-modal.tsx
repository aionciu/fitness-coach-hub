'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PhoneInput } from '@/components/ui/phone-input'
import { X, User, Mail, Calendar, Target, Ruler } from 'lucide-react'
import { Client, CreateClientData, UpdateClientData } from '@/lib/types/client'

interface ClientFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Omit<CreateClientData, 'tenant_id'> | UpdateClientData) => Promise<void>
  client?: Client | null
  isLoading?: boolean
}

export function ClientFormModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  client, 
  isLoading = false 
}: ClientFormModalProps) {
  const [formData, setFormData] = useState<Omit<CreateClientData, 'tenant_id'>>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: undefined,
    height_cm: undefined,
    weight_kg: undefined,
    goals: '',
    notes: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (client) {
      setFormData({
        first_name: client.first_name,
        last_name: client.last_name,
        email: client.email || '',
        phone: client.phone || '',
        date_of_birth: client.date_of_birth || undefined,
        height_cm: client.height_cm || undefined,
        weight_kg: client.weight_kg || undefined,
        goals: client.goals || '',
        notes: client.notes || '',
      })
    } else {
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        date_of_birth: undefined,
        height_cm: undefined,
        weight_kg: undefined,
        goals: '',
        notes: '',
      })
    }
    setErrors({})
  }, [client, isOpen])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required'
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required'
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (formData.phone && formData.phone.trim() === '') {
      newErrors.phone = 'Please enter a valid phone number'
    }

    if (formData.date_of_birth) {
      const birthDate = new Date(formData.date_of_birth)
      const today = new Date()
      if (birthDate > today) {
        newErrors.date_of_birth = 'Date of birth cannot be in the future'
      }
    }

    if (formData.height_cm && (formData.height_cm < 50 || formData.height_cm > 300)) {
      newErrors.height_cm = 'Height must be between 50 and 300 cm'
    }

    if (formData.weight_kg && (formData.weight_kg < 20 || formData.weight_kg > 500)) {
      newErrors.weight_kg = 'Weight must be between 20 and 500 kg'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      await onSubmit(formData)
      onClose()
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  const handleInputChange = (field: keyof Omit<CreateClientData, 'tenant_id'>, value: string | number | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#1A1A1D] border-[#2A2A2D]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-semibold text-white">
            {client ? 'Edit Client' : 'Add New Client'}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-[#A1A1AA] hover:text-white"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Personal Information</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => handleInputChange('first_name', e.target.value)}
                    className="w-full bg-[#2A2A2D] border border-[#3A3A3D] rounded-lg px-3 py-2 text-white placeholder:text-[#A1A1AA] focus:border-[#0070f3] focus:outline-none"
                    placeholder="Enter first name"
                  />
                  {errors.first_name && (
                    <p className="text-red-400 text-sm mt-1">{errors.first_name}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => handleInputChange('last_name', e.target.value)}
                    className="w-full bg-[#2A2A2D] border border-[#3A3A3D] rounded-lg px-3 py-2 text-white placeholder:text-[#A1A1AA] focus:border-[#0070f3] focus:outline-none"
                    placeholder="Enter last name"
                  />
                  {errors.last_name && (
                    <p className="text-red-400 text-sm mt-1">{errors.last_name}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-[#A1A1AA]" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full bg-[#2A2A2D] border border-[#3A3A3D] rounded-lg pl-10 pr-3 py-2 text-white placeholder:text-[#A1A1AA] focus:border-[#0070f3] focus:outline-none"
                      placeholder="Enter email address"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Phone
                  </label>
                  <PhoneInput
                    value={formData.phone || ''}
                    onChange={(value) => handleInputChange('phone', value)}
                    placeholder="e.g., 712345678"
                    error={errors.phone}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Date of Birth
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-4 h-4 text-[#A1A1AA]" />
                  <input
                    type="date"
                    value={formData.date_of_birth || ''}
                    onChange={(e) => handleInputChange('date_of_birth', e.target.value || undefined)}
                    className="w-full bg-[#2A2A2D] border border-[#3A3A3D] rounded-lg pl-10 pr-3 py-2 text-white placeholder:text-[#A1A1AA] focus:border-[#0070f3] focus:outline-none"
                    aria-label="Date of birth"
                  />
                </div>
                {errors.date_of_birth && (
                  <p className="text-red-400 text-sm mt-1">{errors.date_of_birth}</p>
                )}
              </div>
            </div>

            {/* Physical Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white flex items-center space-x-2">
                <Ruler className="w-5 h-5" />
                <span>Physical Information</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    min="50"
                    max="300"
                    value={formData.height_cm || ''}
                    onChange={(e) => handleInputChange('height_cm', e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full bg-[#2A2A2D] border border-[#3A3A3D] rounded-lg px-3 py-2 text-white placeholder:text-[#A1A1AA] focus:border-[#0070f3] focus:outline-none"
                    placeholder="Enter height in cm"
                  />
                  {errors.height_cm && (
                    <p className="text-red-400 text-sm mt-1">{errors.height_cm}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    min="20"
                    max="500"
                    step="0.1"
                    value={formData.weight_kg || ''}
                    onChange={(e) => handleInputChange('weight_kg', e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full bg-[#2A2A2D] border border-[#3A3A3D] rounded-lg px-3 py-2 text-white placeholder:text-[#A1A1AA] focus:border-[#0070f3] focus:outline-none"
                    placeholder="Enter weight in kg"
                  />
                  {errors.weight_kg && (
                    <p className="text-red-400 text-sm mt-1">{errors.weight_kg}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Goals and Notes */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white flex items-center space-x-2">
                <Target className="w-5 h-5" />
                <span>Goals & Notes</span>
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Goals
                </label>
                <textarea
                  value={formData.goals}
                  onChange={(e) => handleInputChange('goals', e.target.value)}
                  rows={3}
                  className="w-full bg-[#2A2A2D] border border-[#3A3A3D] rounded-lg px-3 py-2 text-white placeholder:text-[#A1A1AA] focus:border-[#0070f3] focus:outline-none resize-none"
                  placeholder="Enter client's fitness goals..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={3}
                  className="w-full bg-[#2A2A2D] border border-[#3A3A3D] rounded-lg px-3 py-2 text-white placeholder:text-[#A1A1AA] focus:border-[#0070f3] focus:outline-none resize-none"
                  placeholder="Enter any additional notes..."
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-[#3A3A3D] text-[#A1A1AA] hover:bg-[#2A2A2D]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-[#0070f3] to-[#7e3ff2] hover:from-[#0051a2] hover:to-[#5a2a9a] text-white"
              >
                {isLoading ? 'Saving...' : (client ? 'Update Client' : 'Add Client')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
