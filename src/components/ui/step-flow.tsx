'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Types
interface Step {
  id: string
  title: string
  description?: string
  completed?: boolean
  disabled?: boolean
}

interface StepFlowContextType {
  steps: Step[]
  currentStep: number
  goToStep: (stepIndex: number) => void
  nextStep: () => void
  prevStep: () => void
  canGoNext: boolean
  canGoPrev: boolean
  isStepCompleted: (stepIndex: number) => boolean
  markStepCompleted: (stepIndex: number) => void
  setCurrentStep: (step: number) => void
}

// Context
const StepFlowContext = createContext<StepFlowContextType | undefined>(undefined)

// Hook
export function useStepFlow() {
  const context = useContext(StepFlowContext)
  if (context === undefined) {
    throw new Error('useStepFlow must be used within a StepFlowProvider')
  }
  return context
}

// Provider Component
interface StepFlowProviderProps {
  children: ReactNode
  steps: Step[]
  initialStep?: number
  onStepChange?: (stepIndex: number) => void
  onComplete?: () => void
}

export function StepFlowProvider({ 
  children, 
  steps, 
  initialStep = 0,
  onStepChange,
  onComplete 
}: StepFlowProviderProps) {
  const [currentStep, setCurrentStep] = useState(initialStep)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())

  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < steps.length && stepIndex <= currentStep) {
      setCurrentStep(stepIndex)
      onStepChange?.(stepIndex)
    }
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      const newStep = currentStep + 1
      setCurrentStep(newStep)
      onStepChange?.(newStep)
    } else {
      onComplete?.()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      const newStep = currentStep - 1
      setCurrentStep(newStep)
      onStepChange?.(newStep)
    }
  }

  const canGoNext = currentStep < steps.length - 1
  const canGoPrev = currentStep > 0

  const isStepCompleted = (stepIndex: number) => {
    return completedSteps.has(stepIndex) || steps[stepIndex]?.completed || false
  }

  const markStepCompleted = (stepIndex: number) => {
    setCompletedSteps(prev => new Set([...prev, stepIndex]))
  }

  const value: StepFlowContextType = {
    steps,
    currentStep,
    goToStep,
    nextStep,
    prevStep,
    canGoNext,
    canGoPrev,
    isStepCompleted,
    markStepCompleted,
    setCurrentStep
  }

  return (
    <StepFlowContext.Provider value={value}>
      {children}
    </StepFlowContext.Provider>
  )
}

// Step Indicator Component
interface StepIndicatorProps {
  className?: string
  variant?: 'default' | 'minimal' | 'detailed'
}

export function StepIndicator({ className = '', variant = 'default' }: StepIndicatorProps) {
  const { steps, currentStep, goToStep, isStepCompleted } = useStepFlow()

  if (variant === 'minimal') {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="flex items-center space-x-2">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentStep
                    ? 'bg-[#0070f3] scale-125'
                    : index < currentStep || isStepCompleted(index)
                    ? 'bg-[#0070f3]'
                    : 'bg-[#2A2A2D]'
                }`}
              />
              {index < steps.length - 1 && (
                <div className="w-4 h-px bg-[#2A2A2D] mx-1" />
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (variant === 'detailed') {
    return (
      <div className={`space-y-4 ${className}`}>
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center space-x-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 cursor-pointer ${
                index === currentStep
                  ? 'bg-[#0070f3] text-white'
                  : index < currentStep || isStepCompleted(index)
                  ? 'bg-[#2A2A2D] text-[#0070f3]'
                  : 'bg-[#2A2A2D] text-[#A1A1AA] border border-[#3A3A3D]'
              }`}
              onClick={() => goToStep(index)}
            >
              {index < currentStep || isStepCompleted(index) ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                index + 1
              )}
            </div>
            <div className="flex-1">
              <h3 className={`text-sm font-medium ${
                index === currentStep ? 'text-white' : 'text-[#A1A1AA]'
              }`}>
                {step.title}
              </h3>
              {step.description && (
                <p className="text-xs text-[#A1A1AA] mt-1">{step.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Default variant (pill style)
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex items-center bg-[#1A1A1D] rounded-full p-1 border border-[#2A2A2D]">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div
              className={`w-16 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 cursor-pointer ${
                index === currentStep
                  ? 'bg-[#0070f3] text-white shadow-sm'
                  : index < currentStep || isStepCompleted(index)
                  ? 'bg-[#2A2A2D] text-[#0070f3]'
                  : 'text-[#A1A1AA] hover:text-white border border-[#3A3A3D]'
              }`}
              onClick={() => goToStep(index)}
            >
              {index < currentStep || isStepCompleted(index) ? (
                <div className="flex items-center">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  <span className="text-xs">Done</span>
                </div>
              ) : (
                `${index + 1}`
              )}
            </div>
            {index < steps.length - 1 && (
              <div className="w-3 h-px mx-2 bg-[#2A2A2D] flex-shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Step Navigation Component
interface StepNavigationProps {
  className?: string
  showBack?: boolean
  showNext?: boolean
  backLabel?: string
  nextLabel?: string
  completeLabel?: string
  onBack?: () => void
  onNext?: () => void
  onComplete?: () => void
  backDisabled?: boolean
  nextDisabled?: boolean
  loading?: boolean
}

export function StepNavigation({
  className = '',
  showBack = true,
  showNext = true,
  backLabel = 'Back',
  nextLabel = 'Next',
  completeLabel = 'Complete',
  onBack,
  onNext,
  onComplete,
  backDisabled = false,
  nextDisabled = false,
  loading = false
}: StepNavigationProps) {
  const { currentStep, nextStep, prevStep, canGoPrev, steps } = useStepFlow()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      prevStep()
    }
  }

  const handleNext = () => {
    if (onNext) {
      onNext()
    } else {
      nextStep()
    }
  }

  const handleComplete = () => {
    if (onComplete) {
      onComplete()
    }
  }

  const isLastStep = currentStep === steps.length - 1

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div>
        {showBack && (
          <Button
            onClick={handleBack}
            variant="outline"
            disabled={!canGoPrev || backDisabled}
            className="h-10 px-4 border-[#3A3A3D] text-[#A1A1AA] hover:text-white hover:border-[#0070f3] rounded-xl text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            {backLabel}
          </Button>
        )}
      </div>

      <div>
        {showNext && (
          <Button
            onClick={isLastStep ? handleComplete : handleNext}
            disabled={nextDisabled || loading}
            className="h-10 px-5 bg-[#0070f3] hover:bg-[#0051a2] text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                Loading...
              </>
            ) : (
              <>
                {isLastStep ? completeLabel : nextLabel}
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}

// Step Content Wrapper
interface StepContentProps {
  children: ReactNode
  className?: string
}

export function StepContent({ children, className = '' }: StepContentProps) {
  const { currentStep, steps } = useStepFlow()
  
  return (
    <div className={className}>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-2">
          {steps[currentStep]?.title}
        </h2>
        {steps[currentStep]?.description && (
          <p className="text-[#A1A1AA] text-sm">
            {steps[currentStep]?.description}
          </p>
        )}
      </div>
      {children}
    </div>
  )
}

// Main Step Flow Component
interface StepFlowProps {
  steps: Step[]
  children: ReactNode
  initialStep?: number
  onStepChange?: (stepIndex: number) => void
  onComplete?: () => void
  className?: string
}

export function StepFlow({
  steps,
  children,
  initialStep = 0,
  onStepChange,
  onComplete,
  className = ''
}: StepFlowProps) {
  return (
    <StepFlowProvider
      steps={steps}
      initialStep={initialStep}
      onStepChange={onStepChange}
      onComplete={onComplete}
    >
      <div className={className}>
        {children}
      </div>
    </StepFlowProvider>
  )
}
