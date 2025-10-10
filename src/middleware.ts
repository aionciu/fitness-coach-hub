import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session if expired - required for Server Components
  await supabase.auth.getUser()

  // Get the current path
  const { pathname } = request.nextUrl

  // Define protected routes
  const protectedRoutes = ['/dashboard', '/clients', '/sessions', '/workouts', '/progress']
  const authRoutes = ['/login']
  const onboardingRoute = '/onboarding'

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))
  const isOnboardingRoute = pathname.startsWith(onboardingRoute)

  // Get the current user
  const { data: { user } } = await supabase.auth.getUser()

  // Redirect logic
  if (isProtectedRoute && !user) {
    // Redirect to login if trying to access protected route without auth
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // If user is authenticated, check onboarding status
  if (user) {
    try {
      const { data: userData, error } = await supabase
        .from('users')
        .select('onboarding_completed')
        .eq('id', user.id)
        .single()

      let onboardingCompleted = false

      if (error) {
        // If user doesn't exist in our database yet, they need onboarding
        if (error.code === 'PGRST116') {
          onboardingCompleted = false
        } else if (error.code === '42P17' || error.message?.includes('infinite recursion')) {
          // Handle RLS policy errors
          console.log('RLS policy issue detected in middleware, assuming user needs onboarding')
          onboardingCompleted = false
        } else {
          console.error('Error checking onboarding status:', error)
          onboardingCompleted = false
        }
      } else {
        onboardingCompleted = userData?.onboarding_completed ?? false
      }

      // Redirect to onboarding if not completed and not already on onboarding page
      if (!onboardingCompleted && !isOnboardingRoute) {
        const url = request.nextUrl.clone()
        url.pathname = '/onboarding'
        return NextResponse.redirect(url)
      }

      // Redirect to dashboard if onboarding is completed and on onboarding page
      if (onboardingCompleted && isOnboardingRoute) {
        const url = request.nextUrl.clone()
        url.pathname = '/dashboard'
        return NextResponse.redirect(url)
      }

      // Redirect to dashboard if accessing auth routes while authenticated and onboarded
      if (isAuthRoute && onboardingCompleted) {
        const url = request.nextUrl.clone()
        url.pathname = '/dashboard'
        return NextResponse.redirect(url)
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error)
      // If there's an error, redirect to onboarding to be safe
      if (!isOnboardingRoute) {
        const url = request.nextUrl.clone()
        url.pathname = '/onboarding'
        return NextResponse.redirect(url)
      }
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
