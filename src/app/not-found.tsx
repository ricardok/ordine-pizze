'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home } from 'lucide-react'
import { useTranslations, SimpleI18nProvider } from '@/components/simple-i18n-provider'

function NotFoundContent() {
  const { t } = useTranslations()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-background to-muted">
      <div className="text-center space-y-8 max-w-2xl mx-auto">
        {/* Título */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-primary">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
            {t('notFound.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            {t('notFound.message')}
          </p>
        </div>

        {/* Imagem */}
        <div className="relative w-full max-w-lg mx-auto aspect-square">
          <Image
            src="/not-found-bg.png"
            alt="Page not found"
            fill
            className="object-contain drop-shadow-2xl"
            priority
          />
        </div>

        {/* Botão para voltar */}
        <div className="pt-4">
          <Button asChild size="lg" className="gap-2">
            <Link href="/">
              <Home className="h-5 w-5" />
              {t('notFound.goHome')}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function NotFound() {
  return (
    <SimpleI18nProvider>
      <NotFoundContent />
    </SimpleI18nProvider>
  )
} 