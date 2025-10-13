'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { 
  User, 
  Building2, 
  Bell, 
  Shield, 
  Save,
  Edit3,
  X
} from 'lucide-react'

export default function SettingsPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: 'John Doe',
    businessName: 'FitLife Studio',
    email: 'john@fitlifestudio.com',
    colorTheme: '#0070f3',
    notifications: {
      emailReminders: true,
      sessionUpdates: true,
      clientMessages: true,
      progressReports: false,
    }
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as Record<string, unknown>),
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      // TODO: Implement save functionality
      console.log('Saving settings:', formData)
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      setIsEditing(false)
    } catch (error) {
      console.error('Error saving settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Reset form data to original values
    setFormData({
      fullName: 'John Doe',
      businessName: 'FitLife Studio',
      email: 'john@fitlifestudio.com',
      colorTheme: '#0070f3',
      notifications: {
        emailReminders: true,
        sessionUpdates: true,
        clientMessages: true,
        progressReports: false,
      }
    })
  }

  return (
    <div className="max-w-4xl mx-auto px-4 space-y-6 lg:mt-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-[#A1A1AA] text-sm mt-1">Manage your account and preferences</p>
        </div>
        <div className="flex items-center space-x-2">
          {isEditing ? (
            <>
              <Button
                onClick={handleCancel}
                variant="outline"
                className="h-10 px-4 border-[#3A3A3D] text-[#A1A1AA] hover:text-white hover:border-[#0070f3] rounded-xl text-sm"
              >
                <X className="w-4 h-4 mr-1" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={loading}
                className="h-10 px-4 bg-[#0070f3] hover:bg-[#0051a2] text-white font-semibold rounded-xl text-sm"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-1" />
                    Save Changes
                  </>
                )}
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              className="h-10 px-4 bg-[#0070f3] hover:bg-[#0051a2] text-white font-semibold rounded-xl text-sm"
            >
              <Edit3 className="w-4 h-4 mr-1" />
              Edit
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <Card className="bg-[#0E0E10] border-[#1A1A1D] shadow-2xl shadow-black/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-white flex items-center">
              <User className="w-5 h-5 mr-2 text-[#0070f3]" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-white">Full Name</label>
              <Input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                disabled={!isEditing}
                className="h-11 bg-[#1A1A1D] border-[#3A3A3D] text-white placeholder:text-[#A1A1AA] focus:border-[#0070f3] focus:ring-2 focus:ring-[#0070f3]/20 text-sm rounded-xl disabled:opacity-50"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-white">Email Address</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={!isEditing}
                className="h-11 bg-[#1A1A1D] border-[#3A3A3D] text-white placeholder:text-[#A1A1AA] focus:border-[#0070f3] focus:ring-2 focus:ring-[#0070f3]/20 text-sm rounded-xl disabled:opacity-50"
              />
            </div>
          </CardContent>
        </Card>

        {/* Business Settings */}
        <Card className="bg-[#0E0E10] border-[#1A1A1D] shadow-2xl shadow-black/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-white flex items-center">
              <Building2 className="w-5 h-5 mr-2 text-[#7e3ff2]" />
              Business Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-white">Business Name</label>
              <Input
                type="text"
                value={formData.businessName}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
                disabled={!isEditing}
                className="h-11 bg-[#1A1A1D] border-[#3A3A3D] text-white placeholder:text-[#A1A1AA] focus:border-[#0070f3] focus:ring-2 focus:ring-[#0070f3]/20 text-sm rounded-xl disabled:opacity-50"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-white">Brand Color</label>
              <div className="flex items-center space-x-3">
                <Input
                  type="color"
                  value={formData.colorTheme}
                  onChange={(e) => handleInputChange('colorTheme', e.target.value)}
                  disabled={!isEditing}
                  className="w-16 h-11 bg-[#1A1A1D] border-[#3A3A3D] rounded-xl disabled:opacity-50"
                />
                <Input
                  type="text"
                  value={formData.colorTheme}
                  onChange={(e) => handleInputChange('colorTheme', e.target.value)}
                  disabled={!isEditing}
                  className="flex-1 h-11 bg-[#1A1A1D] border-[#3A3A3D] text-white placeholder:text-[#A1A1AA] focus:border-[#0070f3] focus:ring-2 focus:ring-[#0070f3]/20 text-sm rounded-xl disabled:opacity-50"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="bg-[#0E0E10] border-[#1A1A1D] shadow-2xl shadow-black/50 lg:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-white flex items-center">
              <Bell className="w-5 h-5 mr-2 text-[#ff6b6b]" />
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-[#1A1A1D] border border-[#2A2A2D] rounded-xl">
                <div>
                  <h4 className="text-sm font-semibold text-white">Email Reminders</h4>
                  <p className="text-xs text-[#A1A1AA]">Session reminders and updates</p>
                </div>
                <input
                  type="checkbox"
                  id="emailReminders"
                  checked={formData.notifications.emailReminders}
                  onChange={(e) => handleInputChange('notifications.emailReminders', e.target.checked)}
                  disabled={!isEditing}
                  className="w-4 h-4 text-[#0070f3] bg-[#1A1A1D] border-[#3A3A3D] rounded focus:ring-[#0070f3] focus:ring-2 disabled:opacity-50"
                  aria-label="Email reminders"
                />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-[#1A1A1D] border border-[#2A2A2D] rounded-xl">
                <div>
                  <h4 className="text-sm font-semibold text-white">Session Updates</h4>
                  <p className="text-xs text-[#A1A1AA]">Changes to scheduled sessions</p>
                </div>
                <input
                  type="checkbox"
                  id="sessionUpdates"
                  checked={formData.notifications.sessionUpdates}
                  onChange={(e) => handleInputChange('notifications.sessionUpdates', e.target.checked)}
                  disabled={!isEditing}
                  className="w-4 h-4 text-[#0070f3] bg-[#1A1A1D] border-[#3A3A3D] rounded focus:ring-[#0070f3] focus:ring-2 disabled:opacity-50"
                  aria-label="Session updates"
                />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-[#1A1A1D] border border-[#2A2A2D] rounded-xl">
                <div>
                  <h4 className="text-sm font-semibold text-white">Client Messages</h4>
                  <p className="text-xs text-[#A1A1AA]">New messages from clients</p>
                </div>
                <input
                  type="checkbox"
                  id="clientMessages"
                  checked={formData.notifications.clientMessages}
                  onChange={(e) => handleInputChange('notifications.clientMessages', e.target.checked)}
                  disabled={!isEditing}
                  className="w-4 h-4 text-[#0070f3] bg-[#1A1A1D] border-[#3A3A3D] rounded focus:ring-[#0070f3] focus:ring-2 disabled:opacity-50"
                  aria-label="Client messages"
                />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-[#1A1A1D] border border-[#2A2A2D] rounded-xl">
                <div>
                  <h4 className="text-sm font-semibold text-white">Progress Reports</h4>
                  <p className="text-xs text-[#A1A1AA]">Weekly progress summaries</p>
                </div>
                <input
                  type="checkbox"
                  id="progressReports"
                  checked={formData.notifications.progressReports}
                  onChange={(e) => handleInputChange('notifications.progressReports', e.target.checked)}
                  disabled={!isEditing}
                  className="w-4 h-4 text-[#0070f3] bg-[#1A1A1D] border-[#3A3A3D] rounded focus:ring-[#0070f3] focus:ring-2 disabled:opacity-50"
                  aria-label="Progress reports"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="bg-[#0E0E10] border-[#1A1A1D] shadow-2xl shadow-black/50 lg:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-white flex items-center">
              <Shield className="w-5 h-5 mr-2 text-[#ffa500]" />
              Security & Privacy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#1A1A1D] border border-[#2A2A2D] rounded-xl">
                <div>
                  <h4 className="text-sm font-semibold text-white">Change Password</h4>
                  <p className="text-xs text-[#A1A1AA]">Update your account password</p>
                </div>
                <Button
                  variant="outline"
                  className="h-9 px-4 border-[#3A3A3D] text-[#A1A1AA] hover:text-white hover:border-[#0070f3] rounded-xl text-sm"
                >
                  Change
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-[#1A1A1D] border border-[#2A2A2D] rounded-xl">
                <div>
                  <h4 className="text-sm font-semibold text-white">Two-Factor Authentication</h4>
                  <p className="text-xs text-[#A1A1AA]">Add an extra layer of security</p>
                </div>
                <Button
                  variant="outline"
                  className="h-9 px-4 border-[#3A3A3D] text-[#A1A1AA] hover:text-white hover:border-[#0070f3] rounded-xl text-sm"
                >
                  Enable
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-[#1A1A1D] border border-[#2A2A2D] rounded-xl">
                <div>
                  <h4 className="text-sm font-semibold text-white">Data Export</h4>
                  <p className="text-xs text-[#A1A1AA]">Download your data</p>
                </div>
                <Button
                  variant="outline"
                  className="h-9 px-4 border-[#3A3A3D] text-[#A1A1AA] hover:text-white hover:border-[#0070f3] rounded-xl text-sm"
                >
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
