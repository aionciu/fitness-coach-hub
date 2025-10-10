'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function OnboardingPage() {
  return (
    <Card className="w-full max-w-md bg-[#1A1A1D] border-[#2A2A2D]">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-[#0070f3] to-[#7e3ff2] rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-white">FC</span>
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            Welcome to Fitness Coach Hub
          </CardTitle>
          <CardDescription className="text-[#A1A1AA]">
            Let&apos;s set up your coaching profile
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-[#A1A1AA] mb-6">
            This is where you&apos;ll configure your tenant and profile settings.
            For now, this is a placeholder page.
          </p>
          <Button 
            className="w-full bg-gradient-to-r from-[#0070f3] to-[#7e3ff2] hover:from-[#0051a2] hover:to-[#5a2a9a] text-white font-medium"
            onClick={() => window.location.href = '/dashboard'}
          >
            Continue to Dashboard
          </Button>
        </CardContent>
      </Card>
  )
}
