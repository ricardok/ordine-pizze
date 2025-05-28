'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { calculateFinalPrice, type DiscountResult } from '@/lib/discountEngine'
import { Pizza, OrderFormData } from '@/lib/types'
import { PizzaSelector } from '@/components/organisms/pizza-selector'
import { ShoppingCart } from '@/components/organisms/shopping-cart'
import { CustomerForm } from '@/components/organisms/customer-form'
import { useTranslations } from '@/components/simple-i18n-provider'

const createOrderSchema = (t: (key: string) => string) => z.object({
  customerAge: z.union([
    z.number().positive(t('errors.agePositive')),
    z.literal(''),
    z.undefined(),
    z.null()
  ]).optional().transform((val) => {
    if (val === '' || val === undefined || val === null) return undefined;
    return Number(val);
  }),
  hasLoyaltyCard: z.boolean(),
  isDisabled: z.boolean(),
  isEarlyDiner: z.boolean(),
  groupSize: z.union([
    z.number().positive(t('errors.groupSizePositive')),
    z.literal(''),
    z.undefined(),
    z.null()
  ]).optional().transform((val) => {
    if (val === '' || val === undefined || val === null) return null;
    return Number(val);
  }),
  orderDateTime: z.string().min(1, t('errors.orderDateTimeRequired')),
})

export type OrderFormInputs = z.infer<ReturnType<typeof createOrderSchema>>

interface PizzaOrderFormProps {
  pizzas: Pizza[]
  onSubmit: (data: OrderFormData) => Promise<void>
}

interface CartItem {
  pizzaId: string
  quantity: number
  notes?: string
}

export function PizzaOrderForm({ pizzas, onSubmit }: PizzaOrderFormProps) {
  const { t } = useTranslations()
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedPizza, setSelectedPizza] = useState<string>('')
  const [selectedNotes, setSelectedNotes] = useState<string>('')
  const [pricePreview, setPricePreview] = useState<DiscountResult | null>(null)
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null)
  const cartRef = useRef<HTMLDivElement>(null)

  // Get current date and time in local timezone for default value
  const getCurrentDateTime = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${minutes}`
  }

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<OrderFormInputs>({
    resolver: zodResolver(createOrderSchema(t)),
    defaultValues: {
      hasLoyaltyCard: false,
      isDisabled: false,
      isEarlyDiner: false,
      orderDateTime: getCurrentDateTime(),
    }
  })

  const customerAge = watch('customerAge')
  const hasLoyaltyCard = watch('hasLoyaltyCard')
  const isDisabled = watch('isDisabled')
  const isEarlyDiner = watch('isEarlyDiner')
  const groupSize = watch('groupSize')
  const orderDateTime = watch('orderDateTime')

  const calculateSubtotal = useCallback(() => {
    return cart.reduce((total, item) => {
      const pizza = pizzas.find(p => p.id === item.pizzaId)
      
      if (!pizza) return total
      
      const itemTotal = pizza.basePrice * item.quantity
      
      return total + itemTotal
    }, 0)
  }, [cart, pizzas])

  useEffect(() => {
    if (cart.length > 0 && orderDateTime) {
      const subtotal = calculateSubtotal()
      
      const discountInput = {
        basePrice: subtotal,
        hasLoyaltyCard: hasLoyaltyCard || false,
        isDisabled: isDisabled || false,
        isEarlyDiner: isEarlyDiner || false,
        age: customerAge, 
        groupSize: groupSize || null,
        orderDate: new Date(orderDateTime) 
      }

      const result = calculateFinalPrice(discountInput)
      setPricePreview(result)
    } else {
      setPricePreview(null)
    }
  }, [cart, customerAge, hasLoyaltyCard, isDisabled, isEarlyDiner, groupSize, orderDateTime, calculateSubtotal])

  const addToCart = () => {
    if (!selectedPizza) return

    const existingItemIndex = cart.findIndex(
      item => item.pizzaId === selectedPizza && 
               (item.notes || '') === selectedNotes
    )

    if (existingItemIndex >= 0) {
      const newCart = [...cart]
      newCart[existingItemIndex].quantity += 1
      setCart(newCart)
    } else {
      setCart([...cart, {
        pizzaId: selectedPizza,
        quantity: 1,
        notes: selectedNotes
      }])
    }

    // Reset selections
    setSelectedPizza('')
    setSelectedNotes('')

    // Scroll to cart section after adding item
    setTimeout(() => {
      cartRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      })
    }, 100)
  }

  const updateQuantity = (index: number, change: number) => {
    const newCart = [...cart]
    newCart[index].quantity += change
    
    if (newCart[index].quantity <= 0) {
      newCart.splice(index, 1)
    }
    
    setCart(newCart)
  }

  const removeFromCart = (index: number) => {
    const newCart = [...cart]
    newCart.splice(index, 1)
    setCart(newCart)
  }

  const updateItemNotes = (index: number, notes: string) => {
    const newCart = [...cart]
    newCart[index].notes = notes
    setCart(newCart)
  }

  const startEditingNotes = (index: number) => {
    setEditingItemIndex(index)
  }

  const finishEditingNotes = () => {
    setEditingItemIndex(null)
  }

  const handleNotesKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      finishEditingNotes()
    }
  }

  const onFormSubmit = async (data: OrderFormInputs) => {
    if (cart.length === 0) {
      alert(t('errors.addItemFirst'))
      return
    }

    const orderData: OrderFormData = {
      ...data,
      items: cart.map(item => ({
        pizzaId: item.pizzaId,
        quantity: item.quantity,
        notes: item.notes
      }))
    }

    await onSubmit(orderData)
  }

  const getPizzaName = (pizzaId: string) => {
    const pizza = pizzas.find(p => p.id === pizzaId)
    if (!pizza) return ''
    
    const nameKey = `pizza.names.${pizza.name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z]/g, '')}`
    const translated = t(nameKey)
    
    return translated !== nameKey ? translated : pizza.name
  }
  
  const getPizzaDescription = (pizza: Pizza) => {
    return t(pizza.description)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PizzaSelector
        pizzas={pizzas}
        selectedPizza={selectedPizza}
        selectedNotes={selectedNotes}
        onPizzaSelect={setSelectedPizza}
        onNotesChange={setSelectedNotes}
        onAddToCart={addToCart}
        getPizzaName={getPizzaName}
        getPizzaDescription={getPizzaDescription}
      />

      <ShoppingCart
        ref={cartRef}
        cart={cart}
        pizzas={pizzas}
        getPizzaName={getPizzaName}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onUpdateNotes={updateItemNotes}
        onStartEditingNotes={startEditingNotes}
        onFinishEditingNotes={finishEditingNotes}
        editingItemIndex={editingItemIndex}
        onNotesKeyPress={handleNotesKeyPress}
      />

      <CustomerForm
        register={register}
        errors={errors}
        setValue={setValue}
        pricePreview={pricePreview}
        isSubmitting={isSubmitting}
        cartHasItems={cart.length > 0}
        getCurrentDateTime={getCurrentDateTime}
        onSubmit={handleSubmit(onFormSubmit)}
      />
    </div>
  )
} 