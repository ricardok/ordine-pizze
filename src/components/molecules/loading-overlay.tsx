import { Card } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/atoms/loading-spinner'
import { useTranslations } from '@/components/simple-i18n-provider'

export function LoadingOverlay() {
  const { t } = useTranslations()
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="p-8">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-lg font-medium">{t('success.processing')}</p>
          <p className="text-sm text-muted-foreground mt-2">{t('success.pleaseWait')}</p>
        </div>
      </Card>
    </div>
  )
} 