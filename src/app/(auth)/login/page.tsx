'use client'

import { useState } from 'react'
import { createClientClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const supabase = createClientClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        setError(error.message)
      } else {
        setMessage('Check your email for the login link!')
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-sm bg-[#1A1A1D] border-[#2A2A2D]">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-[#0070f3] to-[#7e3ff2] rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-white">FC</span>
          </div>
          <CardTitle className="text-xl font-bold text-white">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-[#A1A1AA] text-sm">
            Enter your email to receive a magic link
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-white">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="coach@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-[#2A2A2D] border-[#3A3A3D] text-white placeholder:text-[#A1A1AA] focus:border-[#0070f3] h-12"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {message && (
              <div className="p-3 rounded-md bg-green-500/10 border border-green-500/20">
                <p className="text-sm text-green-400">{message}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#0070f3] to-[#7e3ff2] hover:from-[#0051a2] hover:to-[#5a2a9a] text-white font-medium h-12"
              disabled={loading || !email}
            >
              {loading ? 'Sending...' : 'Send Magic Link'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-[#A1A1AA]">
              New to Fitness Coach Hub?{' '}
              <span className="text-[#0070f3] cursor-pointer hover:underline">
                Contact your administrator
              </span>
            </p>
          </div>
        </CardContent>
      </Card>
  )
}
