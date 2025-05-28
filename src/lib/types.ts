import { type DiscountInput } from './discountEngine'

export interface Pizza {
  id: string
  name: string
  description: string
  basePrice: number
  image?: string
}

export interface OrderFormData {
  customerAge?: number | null | undefined
  hasLoyaltyCard: boolean
  isDisabled: boolean
  isEarlyDiner: boolean
  groupSize?: number | null | undefined
  orderDateTime: string
  items: OrderItem[]
}

export interface OrderItem {
  pizzaId: string
  quantity: number
  notes?: string
}

export interface PriceCalculation {
  subtotal: number
  discountInput: DiscountInput
  finalPrice: number
  discountApplied: string | null
  discountPercentage: number
  discountAmount: number
  priceFloorApplied: boolean
}

export interface FoodishResponse {
  image: string
} 