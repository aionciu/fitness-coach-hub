import Link from 'next/link'
import { NavigationItem } from './navigation-data'

interface NavigationItemProps {
  item: NavigationItem
  isActive: boolean
  variant?: 'mobile' | 'desktop' | 'sidebar'
  onClick?: () => void
}

export function NavigationItemComponent({ 
  item, 
  isActive, 
  variant = 'desktop',
  onClick 
}: NavigationItemProps) {
  const baseClasses = "transition-colors"
  
  const variantClasses = {
    mobile: `flex-1 flex flex-col items-center py-2 px-1 text-xs ${
      isActive ? 'text-[#0070f3]' : 'text-[#A1A1AA] hover:text-white'
    }`,
    desktop: `flex items-center px-3 py-2 text-sm font-medium rounded-md ${
      isActive 
        ? 'bg-[#0070f3] text-white' 
        : 'text-[#A1A1AA] hover:text-white hover:bg-[#2A2A2D]'
    }`,
    sidebar: `flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
      isActive 
        ? 'bg-gradient-to-r from-[#0070f3] to-[#7e3ff2] text-white shadow-lg' 
        : 'text-[#A1A1AA] hover:text-white hover:bg-[#2A2A2D] hover:shadow-md'
    }`
  }

  const content = (
    <>
      <span className="text-lg mb-1 lg:text-base lg:mb-0 lg:mr-3">
        <item.icon className="w-5 h-5" />
      </span>
      <div className="flex flex-col lg:flex-row lg:items-center">
        <span className="font-medium">{item.name}</span>
        {variant === 'sidebar' && item.description && (
          <span className="text-xs text-[#A1A1AA] mt-1 lg:mt-0 lg:ml-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
            {item.description}
          </span>
        )}
      </div>
    </>
  )

  return (
    <Link
      href={item.href}
      className={`${baseClasses} ${variantClasses[variant]} ${variant === 'sidebar' ? 'group' : ''}`}
      onClick={onClick}
    >
      {content}
    </Link>
  )
}
