'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  StepFlow, 
  StepIndicator, 
  StepNavigation, 
  StepContent, 
  useStepFlow 
} from '@/components/ui/step-flow'
import { createClientClient } from '@/lib/supabase'
import { useAuth } from '@/contexts/auth-context'
import { User, Building2, Sparkles, Target, Users, FileText } from 'lucide-react'

export default function OnboardingPage() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    tenantName: '',
    acceptedTerms: false,
  })
  const router = useRouter()
  const supabase = createClientClient()
  const { user } = useAuth()

  const steps = [
    {
      id: 'personal',
      title: 'Personal Information',
      description: 'Tell us about yourself'
    },
    {
      id: 'business',
      title: 'Business Setup',
      description: 'Create your coaching brand'
    },
    {
      id: 'terms',
      title: 'Terms & Conditions',
      description: 'Review and accept our terms'
    }
  ]

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    const { currentStep } = useStepFlow()
    if (currentStep === 0 && formData.fullName.trim()) {
      // Move to next step
    } else if (currentStep === 1 && formData.tenantName.trim()) {
      // Move to next step
    } else if (currentStep === 2 && formData.acceptedTerms) {
      handleComplete()
    }
  }

  const handleComplete = async () => {
    if (!user || !formData.fullName.trim() || !formData.tenantName.trim() || !formData.acceptedTerms) {
      return
    }

    setLoading(true)
    try {
      console.log('Starting onboarding completion...')
      console.log('User:', user?.id, 'Email:', user?.email)
      console.log('Form data:', formData)
      console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
      console.log('Supabase Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
      
      // Create tenant
      const tenantData = {
        name: formData.tenantName,
        color_theme: '#0070f3',
      }
      console.log('Creating tenant with data:', tenantData)
      
      const { data: tenant, error: tenantError } = await supabase
        .from('tenants')
        .insert(tenantData)
        .select()
        .single()

      if (tenantError) {
        console.error('Error creating tenant:', tenantError)
        console.error('Full error object:', JSON.stringify(tenantError, null, 2))
        console.error('Error details:', tenantError.details, 'Error hint:', tenantError.hint, 'Error code:', tenantError.code)
        alert('Error creating tenant: ' + (tenantError.message || 'Unknown error'))
        return
      }

      // Update user with tenant and onboarding completion
      const { error: userError } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          tenant_id: tenant.id,
          email: user.email!,
          full_name: formData.fullName,
          role: 'coach',
          onboarding_completed: true,
        })

      if (userError) {
        console.error('Error updating user:', userError)
        alert('Error updating user: ' + userError.message)
        return
      }

      // Redirect to dashboard
      router.push('/dashboard')
    } catch (error) {
      console.error('Error completing onboarding:', error)
      alert('Error completing onboarding: ' + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const WelcomeSection = () => (
    <div className="text-center mb-4">
      <div className="w-12 h-12 bg-[#0070f3] rounded-xl flex items-center justify-center mx-auto mb-3">
        <Sparkles className="w-5 h-5 text-white" />
      </div>
      
      <h1 className="text-xl font-bold text-white mb-2">
        Welcome to Fitness Coach Hub!
      </h1>
      <p className="text-[#A1A1AA] text-sm max-w-md mx-auto leading-relaxed">
        Let&apos;s set up your coaching business and start transforming lives
      </p>
    </div>
  )

  const PersonalInfoStep = () => {
    const { nextStep } = useStepFlow()
    
    const handleContinue = () => {
      if (formData.fullName.trim()) {
        nextStep()
      }
    }

    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-10 h-10 bg-[#0070f3] rounded-xl flex items-center justify-center mx-auto mb-3">
            <User className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg font-semibold text-white mb-1">Personal Information</h2>
          <p className="text-sm text-[#A1A1AA]">Tell us about yourself</p>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-3">
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
            
            <div className="bg-[#1A1A1D] border border-[#2A2A2D] rounded-xl p-4">
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
        </div>

        <StepNavigation
          showBack={false}
          nextDisabled={!formData.fullName.trim()}
          onNext={handleContinue}
        />
      </div>
    )
  }

  const BusinessSetupStep = () => {
    const { prevStep } = useStepFlow()
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-10 h-10 bg-[#7e3ff2] rounded-xl flex items-center justify-center mx-auto mb-3">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg font-semibold text-white mb-1">Business Setup</h2>
          <p className="text-sm text-[#A1A1AA]">Create your coaching brand</p>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-3">
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
            
            <div className="bg-[#1A1A1D] border border-[#2A2A2D] rounded-xl p-4">
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
        </div>

        <StepNavigation
          nextDisabled={!formData.tenantName.trim()}
        />
      </div>
    )
  }

  const TermsStep = () => {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-10 h-10 bg-[#ff6b6b] rounded-xl flex items-center justify-center mx-auto mb-3">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg font-semibold text-white mb-1">Terms & Conditions</h2>
          <p className="text-sm text-[#A1A1AA]">Review and accept our terms</p>
        </div>
        
        <div className="space-y-4">
          <div className="bg-[#1A1A1D] border border-[#2A2A2D] rounded-xl p-4 max-h-48 overflow-y-auto">
              <div className="space-y-3 text-xs text-[#A1A1AA] leading-relaxed">
                <p>
                  <strong className="text-white">1. Service Agreement</strong><br />
                  By using Fitness Coach Hub, you agree to provide accurate information and use the platform responsibly for fitness coaching purposes only.
                </p>
                
                <p>
                  <strong className="text-white">2. Data Privacy</strong><br />
                  We protect your client data with industry-standard security measures. You are responsible for maintaining client confidentiality.
                </p>
                
                <p>
                  <strong className="text-white">3. Payment Terms</strong><br />
                  Subscription fees are billed monthly. You can cancel anytime. Refunds are processed within 30 days of cancellation.
                </p>
                
                <p>
                  <strong className="text-white">4. Liability</strong><br />
                  Fitness Coach Hub is a tool to assist your coaching business. You remain responsible for the safety and effectiveness of your training programs.
                </p>
                
                <p>
                  <strong className="text-white">5. Account Termination</strong><br />
                  We reserve the right to suspend accounts that violate these terms or engage in fraudulent activity.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Checkbox
                id="terms"
                checked={formData.acceptedTerms}
                onCheckedChange={(checked) => handleInputChange('acceptedTerms', checked as boolean)}
                className="mt-1"
              />
              <label htmlFor="terms" className="text-sm text-[#A1A1AA] leading-relaxed cursor-pointer">
                I have read and agree to the Terms & Conditions and Privacy Policy. I understand my responsibilities as a fitness coach.
              </label>
            </div>
        </div>

        <StepNavigation
          nextDisabled={!formData.acceptedTerms || loading}
          loading={loading}
          onComplete={handleComplete}
        />
      </div>
    )
  }

  const OnboardingContent = () => {
    const { currentStep } = useStepFlow()
    
    return (
      <div className="space-y-6">
        {currentStep === 0 && <PersonalInfoStep />}
        {currentStep === 1 && <BusinessSetupStep />}
        {currentStep === 2 && <TermsStep />}
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col justify-center p-4">
      <div className="w-full max-w-lg mx-auto">
        <StepFlow
          steps={steps}
          onComplete={handleComplete}
        >
          {/* Welcome Section - Outside Card */}
          <WelcomeSection />
          
          {/* Step Indicator - Outside Card */}
          <StepIndicator className="mb-4" />
          
          {/* Form Card */}
          <Card className="bg-[#0E0E10] border-[#1A1A1D] shadow-2xl shadow-black/50">
            <CardContent className="px-6 py-6">
              <OnboardingContent />
            </CardContent>
          </Card>
        </StepFlow>
        
        {/* Background decoration */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-[#0070f3]/10 to-[#7e3ff2]/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-[#ff6b6b]/10 to-[#ffa500]/10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  )
}