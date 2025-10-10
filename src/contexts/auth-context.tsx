'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClientClient } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  loading: boolean
  onboardingCompleted: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [onboardingCompleted, setOnboardingCompleted] = useState(false)
  const router = useRouter()
  const supabase = createClientClient()

  const checkOnboardingStatus = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('onboarding_completed')
        .eq('id', userId)
        .single()

      if (error) {
        // If user doesn't exist in our database yet, they need onboarding
        if (error.code === 'PGRST116') {
          console.log('User not found in database, needs onboarding')
          setOnboardingCompleted(false)
          return
        }
        console.error('Error checking onboarding status:', error)
        setOnboardingCompleted(false)
        return
      }

      setOnboardingCompleted(data?.onboarding_completed ?? false)
    } catch (error) {
      console.error('Error checking onboarding status:', error)
      setOnboardingCompleted(false)
    }
  }, [supabase])

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await checkOnboardingStatus(session.user.id)
      }
      
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await checkOnboardingStatus(session.user.id)
        } else {
          setOnboardingCompleted(false)
        }
        
        setLoading(false)
        
        // Redirect to login if user signs out
        if (event === 'SIGNED_OUT') {
          router.push('/login')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase.auth, router, checkOnboardingStatus])

  const signOut = async () => {
    await supabase.auth.signOut()
    // The redirect will be handled by the auth state change listener
  }

  const value = {
    user,
    loading,
    onboardingCompleted,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
