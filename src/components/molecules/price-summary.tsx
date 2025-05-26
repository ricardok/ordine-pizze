import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calculator } from 'lucide-react'
import { PriceDisplay } from '@/components/atoms/price-display'
import { useTranslations } from '@/components/simple-i18n-provider'
import type { DiscountResult } from '@/lib/discountEngine'

interface PriceSummaryProps {
  pricePreview: DiscountResult
  title?: string
  className?: string
}

export function PriceSummary({ 
  pricePreview, 
  title,
  className = "bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800"
}: PriceSummaryProps) {
  const { t } = useTranslations()
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-green-900 dark:text-green-100 flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          {title || t('orderSummary.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-green-900 dark:text-green-100">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>{t('orderSummary.subtotal')}</span>
            <PriceDisplay price={pricePreview.originalPrice} />
          </div>
          
          {pricePreview.discountApplied && (
            <div className="flex justify-between text-green-700 dark:text-green-300">
              <span>{pricePreview.discountApplied} (-{pricePreview.discountPercentage}%)</span>
              <span>-<PriceDisplay price={pricePreview.discountAmount} /></span>
            </div>
          )}
          
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>{t('orderSummary.total')}</span>
            <PriceDisplay price={pricePreview.finalPrice} size="lg" />
          </div>
          
          {pricePreview.priceFloorApplied && (
            <p className="text-sm text-green-700 dark:text-green-300">
              {t('orderSummary.minimumPrice')}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 