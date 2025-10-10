export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E0E10] to-[#1A1A1D] flex items-center justify-center p-4">
      {children}
    </div>
  )
}
