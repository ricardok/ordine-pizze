import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { PriceSummary } from '@/components/molecules/price-summary'
import { useTranslations } from '@/components/simple-i18n-provider'
import type { DiscountResult } from '@/lib/discountEngine'
import type { UseFormRegister, FieldErrors, UseFormSetValue } from 'react-hook-form'
import type { OrderFormInputs } from '../pizza-order-form'

interface CustomerFormProps {
  register: UseFormRegister<OrderFormInputs>
  errors: FieldErrors<OrderFormInputs>
  setValue: UseFormSetValue<OrderFormInputs>
  pricePreview: DiscountResult | null
  isSubmitting: boolean
  cartHasItems: boolean
  getCurrentDateTime: () => string
  onSubmit: () => void
}

export function CustomerForm({
  register,
  errors,
  setValue,
  pricePreview,
  isSubmitting,
  cartHasItems,
  getCurrentDateTime,
  onSubmit
}: CustomerFormProps) {
  const { t } = useTranslations()

  if (!cartHasItems) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('customer.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customerAge">{t('customer.age.label')}</Label>
              <Input
                {...register('customerAge', { 
                  setValueAs: (value) => value === '' ? undefined : Number(value)
                })}
                type="number"
                min="0"
                placeholder="25"
              />
              {errors.customerAge && (
                <p className="text-sm text-destructive mt-1">{errors.customerAge.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="groupSize">{t('customer.groupSize.label')}</Label>
              <Input
                {...register('groupSize', { 
                  setValueAs: (value) => value === '' ? null : Number(value)
                })}
                type="number"
                min="1"
                placeholder={t('customer.groupSize.placeholder')}
              />
              {errors.groupSize && (
                <p className="text-sm text-destructive mt-1">{errors.groupSize.message}</p>
              )}
            </div>

            <div className="flex flex-col space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasLoyaltyCard"
                  {...register('hasLoyaltyCard')}
                  onCheckedChange={(checked) => setValue('hasLoyaltyCard', !!checked)}
                />
                <Label htmlFor="hasLoyaltyCard">{t('customer.loyaltyCard')}</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isDisabled"
                  {...register('isDisabled')}
                  onCheckedChange={(checked) => setValue('isDisabled', !!checked)}
                />
                <Label htmlFor="isDisabled">{t('customer.disabled')}</Label>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="orderDateTime">{t('customer.orderDateTime.label')}</Label>
            <Input
              {...register('orderDateTime')}
              type="datetime-local"
              min={getCurrentDateTime()}
            />
            {errors.orderDateTime && (
              <p className="text-sm text-destructive mt-1">{errors.orderDateTime.message}</p>
            )}
            <p className="text-sm text-muted-foreground mt-1">
              {t('customer.orderDateTime.help')}
            </p>
          </div>

          {pricePreview && (
            <PriceSummary pricePreview={pricePreview} />
          )}

          <Button 
            type="button"
            onClick={onSubmit}
            className="w-full" 
            size="lg"
            disabled={isSubmitting || !cartHasItems}
          >
            {isSubmitting ? t('customer.processing') : t('customer.finalizeOrder')}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 