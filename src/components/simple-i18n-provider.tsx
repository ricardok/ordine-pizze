'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { ThemeToggle } from '@/components/theme-toggle'
import ptMessages from '../../messages/pt.json'
import enMessages from '../../messages/en.json'
import itMessages from '../../messages/it.json'

const messages = {
  pt: ptMessages,
  en: enMessages,
  it: itMessages,
}

type Locale = 'pt' | 'en' | 'it'

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function useTranslations() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useTranslations must be used within SimpleI18nProvider')
  }
  return context
}

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  try {
    const result = path.split('.').reduce<unknown>((current, key) => {
      return current && typeof current === 'object' ? (current as Record<string, unknown>)[key] : undefined;
    }, obj);

    return typeof result === 'string' ? result : path;
  } catch {
    return path;
  }
}

export function SimpleI18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>('it')

  useEffect(() => {
    const saved = localStorage.getItem('locale') as Locale
    if (saved && ['pt', 'en', 'it'].includes(saved)) {
      setLocale(saved)
    }
  }, [])

  const changeLocale = (newLocale: Locale) => {
    setLocale(newLocale)
    localStorage.setItem('locale', newLocale)
  }

  const t = (key: string): string => {
    return getNestedValue(messages[locale], key)
  }

  const contextValue: I18nContextType = {
    locale,
    setLocale: changeLocale,
    t,
  }

  return (
    <I18nContext.Provider value={contextValue}>
      <div className="text-center mb-8 mt-4">
        {/* Mobile Layout */}
        <div className="block md:hidden">
          <div className="flex items-center justify-center gap-4 mb-4">
            <SimpleLanguageToggle />
            <ThemeToggle />
          </div>
          <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
        </div>
        
        {/* Desktop Layout */}
        <div className="hidden md:block">
          <div className="flex items-center justify-center gap-6 mb-4">
            <h1 className="text-4xl font-bold">{t('title')}</h1>
            <SimpleLanguageToggle />
            <ThemeToggle />
          </div>
        </div>
        
        <p className="text-lg text-muted-foreground">
          {t('subtitle')}
        </p>
      </div>
      {children}
    </I18nContext.Provider>
  )
}

function SimpleLanguageToggle() {
  const { locale, setLocale, t } = useTranslations()
  const [isOpen, setIsOpen] = useState(false)
  
  const locales = [
    { code: 'pt' as const, flag: '🇧🇷', name: 'Português' },
    { code: 'en' as const, flag: '🇺🇸', name: 'English' },
    { code: 'it' as const, flag: '🇮🇹', name: 'Italiano' },
  ]

  const currentLocale = locales.find(loc => loc.code === locale)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between h-9 px-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:bg-accent hover:text-accent-foreground transition-colors"
        title={t('language.select')}
      >
        <span className="text-lg">{currentLocale?.flag}</span>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          <div className="absolute top-full left-0 mt-1 bg-background border border-border rounded-md shadow-md z-20 py-1">
            {locales.map((loc) => (
              <button
                key={loc.code}
                onClick={() => {
                  setLocale(loc.code)
                  setIsOpen(false)
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors ${
                  locale === loc.code ? 'bg-accent text-accent-foreground' : ''
                }`}
              >
                <span className="text-base">{loc.flag}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
} 