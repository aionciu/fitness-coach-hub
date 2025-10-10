'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClientClient } from '@/lib/supabase'
import { useAuth } from '@/contexts/auth-context'
import { User, Building2, CheckCircle, ArrowRight, ArrowLeft, Sparkles, Target, Users } from 'lucide-react'

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    tenantName: '',
  })
  const router = useRouter()
  const supabase = createClientClient()
  const { user } = useAuth()

  const totalSteps = 2

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (step === 1 && formData.fullName.trim()) {
      setStep(2)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleComplete = async () => {
    if (!user || !formData.fullName.trim() || !formData.tenantName.trim()) {
      return
    }

    setLoading(true)
    try {
      // Create tenant
      const { data: tenant, error: tenantError } = await supabase
        .from('tenants')
        .insert({
          name: formData.tenantName,
          color_theme: '#0070f3',
        })
        .select()
        .single()

      if (tenantError) {
        console.error('Error creating tenant:', tenantError)
        return
      }

      // Update user with tenant and onboarding completion
      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          tenant_id: tenant.id,
          email: user.email!,
          full_name: formData.fullName,
          role: 'coach',
          onboarding_completed: true,
        })

      if (userError) {
        console.error('Error updating user:', userError)
        return
      }

      // Redirect to dashboard
      router.push('/dashboard')
    } catch (error) {
      console.error('Error completing onboarding:', error)
    } finally {
      setLoading(false)
    }
  }

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-6">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div key={i} className="flex items-center">
          <div className="relative">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                i + 1 <= step
                  ? 'bg-gradient-to-r from-[#0070f3] to-[#7e3ff2] text-white shadow-lg shadow-[#0070f3]/25'
                  : 'bg-[#2A2A2D] text-[#A1A1AA] border border-[#3A3A3D]'
              }`}
            >
              {i + 1 < step ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                i + 1
              )}
            </div>
            {i + 1 === step && (
              <div className="absolute -inset-1 bg-gradient-to-r from-[#0070f3] to-[#7e3ff2] rounded-full opacity-20 animate-pulse"></div>
            )}
          </div>
          {i < totalSteps - 1 && (
            <div
              className={`w-8 h-0.5 mx-3 rounded-full transition-all duration-300 ${
                i + 1 < step 
                  ? 'bg-gradient-to-r from-[#0070f3] to-[#7e3ff2]' 
                  : 'bg-[#2A2A2D]'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )

  const WelcomeSection = () => (
    <div className="text-center mb-6">
      <div className="relative inline-block mb-4">
        <div className="w-14 h-14 bg-gradient-to-r from-[#0070f3] to-[#7e3ff2] rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-[#0070f3]/25">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-[#ff6b6b] to-[#ffa500] rounded-full flex items-center justify-center">
          <span className="text-xs font-bold text-white">✨</span>
        </div>
      </div>
      
      <h1 className="text-xl font-bold text-white mb-2">
        Welcome to Fitness Coach Hub!
      </h1>
      <p className="text-[#A1A1AA] text-sm max-w-md mx-auto leading-relaxed">
        Let&apos;s set up your coaching business and start transforming lives
      </p>
    </div>
  )

  const StepContent = () => {
    if (step === 1) {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-10 h-10 bg-gradient-to-r from-[#0070f3] to-[#7e3ff2] rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-[#0070f3]/25">
              <User className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-bold text-white mb-1">Personal Information</h2>
            <p className="text-[#A1A1AA] text-xs">Tell us about yourself</p>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-white mb-2">
                What&apos;s your full name?
              </label>
              <Input
                type="text"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="h-11 bg-[#1A1A1D] border-[#3A3A3D] text-white placeholder:text-[#A1A1AA] focus:border-[#0070f3] focus:ring-2 focus:ring-[#0070f3]/20 text-sm rounded-xl"
                autoFocus
              />
            </div>
            
            <div className="bg-[#1A1A1D] border border-[#2A2A2D] rounded-xl p-3">
              <div className="flex items-start space-x-2">
                <Target className="w-4 h-4 text-[#0070f3] mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-semibold text-white mb-1">Why we need this</h4>
                  <p className="text-xs text-[#A1A1AA] leading-relaxed">
                    Your name will appear on client schedules and communications to build trust and personal connection.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              onClick={handleNext}
              disabled={!formData.fullName.trim()}
              className="h-10 px-5 bg-gradient-to-r from-[#0070f3] to-[#7e3ff2] hover:from-[#0051a2] hover:to-[#5a2a9a] text-white font-semibold rounded-xl shadow-lg shadow-[#0070f3]/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )
    }

    if (step === 2) {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-10 h-10 bg-gradient-to-r from-[#7e3ff2] to-[#ff6b6b] rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-[#7e3ff2]/25">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-bold text-white mb-1">Business Setup</h2>
            <p className="text-[#A1A1AA] text-xs">Create your coaching brand</p>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-white mb-2">
                What&apos;s your business or studio name?
              </label>
              <Input
                type="text"
                placeholder="e.g., FitLife Studio, Personal Training Co."
                value={formData.tenantName}
                onChange={(e) => handleInputChange('tenantName', e.target.value)}
                className="h-11 bg-[#1A1A1D] border-[#3A3A3D] text-white placeholder:text-[#A1A1AA] focus:border-[#0070f3] focus:ring-2 focus:ring-[#0070f3]/20 text-sm rounded-xl"
                autoFocus
              />
            </div>
            
            <div className="bg-[#1A1A1D] border border-[#2A2A2D] rounded-xl p-3">
              <div className="flex items-start space-x-2">
                <Users className="w-4 h-4 text-[#7e3ff2] mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-semibold text-white mb-1">This will be your brand</h4>
                  <p className="text-xs text-[#A1A1AA] leading-relaxed">
                    Your business name will be visible to clients and used in all communications. You can change this later in settings.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-2">
            <Button
              onClick={handleBack}
              variant="outline"
              className="h-10 px-4 border-[#3A3A3D] text-[#A1A1AA] hover:text-white hover:border-[#0070f3] rounded-xl text-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
            <Button
              onClick={handleComplete}
              disabled={!formData.tenantName.trim() || loading}
              className="h-10 px-5 bg-gradient-to-r from-[#0070f3] to-[#7e3ff2] hover:from-[#0051a2] hover:to-[#5a2a9a] text-white font-semibold rounded-xl shadow-lg shadow-[#0070f3]/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Setting up...
                </>
              ) : (
                <>
                  Complete Setup
                  <CheckCircle className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      )
    }

    return null
  }

  return (
    <div className="h-screen flex flex-col justify-center p-4">
      <div className="w-full max-w-lg mx-auto">
        <Card className="bg-[#0E0E10] border-[#1A1A1D] shadow-2xl shadow-black/50">
          <CardHeader className="pb-6">
            <WelcomeSection />
            <StepIndicator />
          </CardHeader>

          <CardContent className="px-6 pb-6">
            <StepContent />
          </CardContent>
        </Card>
        
        {/* Background decoration */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-[#0070f3]/10 to-[#7e3ff2]/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-[#ff6b6b]/10 to-[#ffa500]/10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  )
}