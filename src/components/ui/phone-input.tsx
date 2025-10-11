'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Country {
  code: string
  name: string
  flag: string
  phoneCode: string
  phonePattern: RegExp
}

const countries: Country[] = [
  {
    code: 'RO',
    name: 'Romania',
    flag: '🇷🇴',
    phoneCode: '+40',
    phonePattern: /^(\+40|0040|0)?[2-7][0-9]{8}$/
  },
  {
    code: 'US',
    name: 'United States',
    flag: '🇺🇸',
    phoneCode: '+1',
    phonePattern: /^(\+1|1)?[2-9]\d{2}[2-9]\d{2}\d{4}$/
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    flag: '🇬🇧',
    phoneCode: '+44',
    phonePattern: /^(\+44|0044|0)?[1-9]\d{8,9}$/
  },
  {
    code: 'AU',
    name: 'Australia',
    flag: '🇦🇺',
    phoneCode: '+61',
    phonePattern: /^(\+61|0061|0)?[1-9]\d{8}$/
  },
  {
    code: 'DE',
    name: 'Germany',
    flag: '🇩🇪',
    phoneCode: '+49',
    phonePattern: /^(\+49|0049|0)?[1-9]\d{10,11}$/
  },
  {
    code: 'FR',
    name: 'France',
    flag: '🇫🇷',
    phoneCode: '+33',
    phonePattern: /^(\+33|0033|0)?[1-9]\d{8}$/
  },
  {
    code: 'IT',
    name: 'Italy',
    flag: '🇮🇹',
    phoneCode: '+39',
    phonePattern: /^(\+39|0039|0)?[3-9]\d{8,9}$/
  },
  {
    code: 'ES',
    name: 'Spain',
    flag: '🇪🇸',
    phoneCode: '+34',
    phonePattern: /^(\+34|0034|0)?[6-9]\d{8}$/
  },
  {
    code: 'NL',
    name: 'Netherlands',
    flag: '🇳🇱',
    phoneCode: '+31',
    phonePattern: /^(\+31|0031|0)?[1-9]\d{8}$/
  },
  {
    code: 'BE',
    name: 'Belgium',
    flag: '🇧🇪',
    phoneCode: '+32',
    phonePattern: /^(\+32|0032|0)?[1-9]\d{7,8}$/
  },
  {
    code: 'CH',
    name: 'Switzerland',
    flag: '🇨🇭',
    phoneCode: '+41',
    phonePattern: /^(\+41|0041|0)?[1-9]\d{8}$/
  },
  {
    code: 'AT',
    name: 'Austria',
    flag: '🇦🇹',
    phoneCode: '+43',
    phonePattern: /^(\+43|0043|0)?[1-9]\d{10,11}$/
  },
  {
    code: 'PL',
    name: 'Poland',
    flag: '🇵🇱',
    phoneCode: '+48',
    phonePattern: /^(\+48|0048|0)?[1-9]\d{8}$/
  },
  {
    code: 'CZ',
    name: 'Czech Republic',
    flag: '🇨🇿',
    phoneCode: '+420',
    phonePattern: /^(\+420|00420|0)?[1-9]\d{8}$/
  },
  {
    code: 'HU',
    name: 'Hungary',
    flag: '🇭🇺',
    phoneCode: '+36',
    phonePattern: /^(\+36|0036|0)?[1-9]\d{8}$/
  },
  {
    code: 'BG',
    name: 'Bulgaria',
    flag: '🇧🇬',
    phoneCode: '+359',
    phonePattern: /^(\+359|00359|0)?[1-9]\d{8}$/
  },
  {
    code: 'GR',
    name: 'Greece',
    flag: '🇬🇷',
    phoneCode: '+30',
    phonePattern: /^(\+30|0030|0)?[1-9]\d{9}$/
  },
  {
    code: 'TR',
    name: 'Turkey',
    flag: '🇹🇷',
    phoneCode: '+90',
    phonePattern: /^(\+90|0090|0)?[1-9]\d{9}$/
  },
  {
    code: 'CA',
    name: 'Canada',
    flag: '🇨🇦',
    phoneCode: '+1',
    phonePattern: /^(\+1|1)?[2-9]\d{2}[2-9]\d{2}\d{4}$/
  },
  {
    code: 'JP',
    name: 'Japan',
    flag: '🇯🇵',
    phoneCode: '+81',
    phonePattern: /^(\+81|0081|0)?[1-9]\d{9,10}$/
  }
]

interface PhoneInputProps {
  value: string
  onChange: (value: string) => void
  onCountryChange?: (country: Country) => void
  placeholder?: string
  className?: string
  error?: string
}

export function PhoneInput({
  value,
  onChange,
  onCountryChange,
  placeholder,
  className = '',
  error
}: PhoneInputProps) {
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]) // Romania as default
  const [isOpen, setIsOpen] = useState(false)

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country)
    onCountryChange?.(country)
    setIsOpen(false)
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    // Remove any non-digit characters except +
    const cleanValue = inputValue.replace(/[^\d+]/g, '')
    onChange(cleanValue)
  }

  const formatPhoneNumber = (value: string) => {
    if (!value) return ''
    
    // If it starts with the country code, remove it for display
    if (value.startsWith(selectedCountry.phoneCode)) {
      return value.substring(selectedCountry.phoneCode.length)
    }
    
    // If it starts with 0, remove it for display
    if (value.startsWith('0')) {
      return value.substring(1)
    }
    
    return value
  }

  const getFullPhoneNumber = () => {
    if (!value) return ''
    
    // If value already includes country code, return as is
    if (value.startsWith('+')) {
      return value
    }
    
    // Add country code if not present
    return `${selectedCountry.phoneCode}${value}`
  }

  const validatePhoneNumber = (phoneNumber: string) => {
    if (!phoneNumber) return true
    return selectedCountry.phonePattern.test(phoneNumber)
  }

  const isValid = validatePhoneNumber(getFullPhoneNumber())

  return (
    <div className={`space-y-1 ${className}`}>
      <div className={`relative flex ${!isValid && value ? 'ring-2 ring-red-500 rounded-lg' : ''}`}>
        {/* Country Selector */}
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              className={`shrink-0 z-10 inline-flex items-center h-10 px-3 text-sm font-medium text-center text-white bg-[#2A2A2D] border border-[#3A3A3D] rounded-l-lg rounded-r-none hover:bg-[#3A3A3D] focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-[#2A2A2D] dark:hover:bg-[#3A3A3D] dark:focus:ring-gray-700 dark:text-white dark:border-[#3A3A3D] ${
                !isValid && value ? 'border-red-500' : ''
              }`}
            >
              <span className="text-sm font-medium">{selectedCountry.phoneCode}</span>
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="z-50 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-64 dark:bg-[#1A1A1D] dark:divide-gray-600">
            <div className="py-2 text-sm text-gray-700 dark:text-gray-200">
              {countries.map((country) => (
                <DropdownMenuItem
                  key={country.code}
                  onClick={() => handleCountrySelect(country)}
                  className="inline-flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer"
                >
                  <span className="inline-flex items-center">
                    <span className="text-lg mr-2">{country.flag}</span>
                    <span className="font-medium">{country.name} ({country.phoneCode})</span>
                  </span>
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Phone Input */}
        <div className="relative flex-1">
          <Input
            type="text"
            value={formatPhoneNumber(value)}
            onChange={handlePhoneChange}
            placeholder={placeholder || '123-456-7890'}
            className="h-10 px-3 w-full text-sm text-white bg-[#2A2A2D] border-l-0 border border-[#3A3A3D] focus:ring-[#0070f3] focus:border-[#0070f3] dark:bg-[#2A2A2D] dark:border-[#3A3A3D] dark:placeholder-gray-400 dark:text-white dark:focus:border-[#0070f3] rounded-r-lg rounded-l-none"
          />
        </div>
      </div>
      
      {/* Error Message */}
      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}
      
      {/* Validation Message */}
      {!isValid && value && !error && (
        <p className="text-red-400 text-sm">
          Please enter a valid {selectedCountry.name} phone number
        </p>
      )}
      
      {/* Full Number Display */}
      {value && (
        <p className="text-xs text-gray-400">
          Full number: {getFullPhoneNumber()}
        </p>
      )}
    </div>
  )
}
