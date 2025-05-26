'use client'

import { ThemeToggle } from '@/components/theme-toggle'
import { LanguageToggle } from '@/components/language-toggle'
import { useTranslations } from 'next-intl'

export function LocalizedHeader() {
  const t = useTranslations()
  
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center gap-4 mb-4">
        <h1 className="text-4xl font-bold">{t('title')}</h1>
        <div className="flex gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
      <p className="text-lg text-muted-foreground">
        {t('subtitle')}
      </p>
    </div>
  )
} 