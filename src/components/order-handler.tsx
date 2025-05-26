'use client'

import { useState } from 'react'
import { PizzaOrderForm } from '@/components/pizza-order-form'
import { LoadingOverlay } from '@/components/molecules/loading-overlay'
import { SuccessModal } from '@/components/organisms/success-modal'
import { Pizza, OrderFormData } from '@/lib/types'
import { useTranslations } from '@/components/simple-i18n-provider'

interface OrderHandlerProps {
  pizzas: Pizza[]
}

interface OrderResult {
  id: string
  subtotal: number
  discountApplied: string | null
  discountAmount: number
  finalPrice: number
}

function saveOrderToLocalStorage(order: object) {
  if (typeof window !== 'undefined') {
    const existingOrders = JSON.parse(localStorage.getItem('pizza-orders') || '[]')
    existingOrders.push(order)
    localStorage.setItem('pizza-orders', JSON.stringify(existingOrders))
  }
}

export default function OrderHandler({ pizzas }: OrderHandlerProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState<OrderResult | null>(null)
  const { t } = useTranslations()

  const handleOrderSubmit = async (orderData: OrderFormData) => {
    setIsLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      const result = await response.json()

      if (result.success) {
        saveOrderToLocalStorage(result.order)
        setOrderSuccess(result.order)
      } else {
        alert(t('errors.orderFailed').replace('{error}', result.error))
      }
    } catch (error) {
      alert(t('errors.orderError'))
    } finally {
      setIsLoading(false)
    }
  }

  const startNewOrder = () => {
    setOrderSuccess(null)
    window.location.reload()
  }

  return (
    <div className="relative">
      <PizzaOrderForm pizzas={pizzas} onSubmit={handleOrderSubmit} />
      
      {isLoading && <LoadingOverlay />}
      
      {orderSuccess && (
        <SuccessModal 
          orderResult={orderSuccess} 
          onNewOrder={startNewOrder} 
        />
      )}
    </div>
  )
} 