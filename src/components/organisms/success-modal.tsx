import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'
import { PriceSummary } from '@/components/molecules/price-summary'
import { useTranslations } from '@/components/simple-i18n-provider'

interface OrderResult {
  id: string
  subtotal: number
  discountApplied: string | null
  discountAmount: number
  finalPrice: number
  discountPercentage?: number
  priceFloorApplied?: boolean
}

interface SuccessModalProps {
  orderResult: OrderResult
  onNewOrder: () => void
}

export function SuccessModal({ orderResult, onNewOrder }: SuccessModalProps) {
  const { t } = useTranslations()

  const priceData = {
    originalPrice: orderResult.subtotal,
    finalPrice: orderResult.finalPrice,
    discountApplied: orderResult.discountApplied,
    discountAmount: orderResult.discountAmount,
    discountPercentage: orderResult.discountPercentage || 0,
    priceFloorApplied: orderResult.priceFloorApplied || false
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-2xl w-full mx-auto text-center animate-in fade-in zoom-in duration-300">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
          <CardTitle className="text-3xl text-green-600">
            {t('success.orderCreated')}
          </CardTitle>
          <CardDescription className="text-lg">
            {t('success.orderDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <PriceSummary 
            pricePreview={priceData}
            title={t('success.orderSummaryTitle').replace('{orderId}', orderResult.id)}
          />
          
          <div className="flex justify-center gap-4">
            <Button
              onClick={onNewOrder}
              size="lg"
            >
              {t('success.newOrder')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 