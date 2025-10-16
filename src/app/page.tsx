import { redirect } from 'next/navigation'

export default function HomePage() {
  // Redirect to login page
  redirect('/login')
}

// Force dynamic rendering to avoid static analysis issues with redirects
export const dynamic = 'force-dynamic'