import { NextRequest, NextResponse } from 'next/server'
import { calculateFinalPrice } from '@/lib/discountEngine'
import { OrderFormData } from '@/lib/types'
import { mockPizzas } from '@/lib/mocks/pizzas'

export async function POST(request: NextRequest) {
  try {
    const orderData: OrderFormData = await request.json()

    // Add artificial delay to simulate processing time (2-3 seconds)
    await new Promise(resolve => setTimeout(resolve, 2500))

    let subtotal = 0
    const orderItems = []

    for (const item of orderData.items) {
      const pizza = mockPizzas.find(p => p.id === item.pizzaId)

      if (!pizza) {
        return NextResponse.json(
          { error: `Pizza not found for item` },
          { status: 400 }
        )
      }

      const itemPrice = pizza.basePrice * item.quantity
      subtotal += itemPrice

      orderItems.push({
        pizzaId: item.pizzaId,
        pizzaName: pizza.name,
        quantity: item.quantity,
        notes: item.notes,
        itemPrice
      })
    }

    const discountInput = {
      basePrice: subtotal,
      hasLoyaltyCard: orderData.hasLoyaltyCard,
      isDisabled: orderData.isDisabled,
      age: orderData.customerAge,
      groupSize: orderData.groupSize || null,
      orderDate: new Date(orderData.orderDateTime)
    }

    const priceResult = calculateFinalPrice(discountInput)

    const order = {
      id: Date.now().toString(), 
      customerAge: orderData.customerAge,
      hasLoyaltyCard: orderData.hasLoyaltyCard,
      isDisabled: orderData.isDisabled,
      groupSize: orderData.groupSize,
      orderDateTime: orderData.orderDateTime,
      subtotal,
      discountApplied: priceResult.discountApplied,
      discountPercentage: priceResult.discountPercentage,
      discountAmount: priceResult.discountAmount,
      finalPrice: priceResult.finalPrice,
      priceFloorApplied: priceResult.priceFloorApplied,
      items: orderItems,
      createdAt: new Date().toISOString()
    }

    try {
      const existingOrders = JSON.parse(localStorage.getItem('pizza-orders') || '[]')
      existingOrders.push(order)
      localStorage.setItem('pizza-orders', JSON.stringify(existingOrders))
    } catch (localStorageError) {
      console.log('Could not save to localStorage (likely server-side):', localStorageError)
    }

    return NextResponse.json({
      success: true,
      order,
      message: 'Pedido criado com sucesso!'
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const mockOrders = [
      {
        id: '1',
        customerAge: 25,
        hasLoyaltyCard: true,
        isDisabled: false,
        groupSize: null,
        orderDateTime: '2024-01-15T19:30:00',
        subtotal: 27.00,
        discountApplied: 'Loyalty Card Discount',
        discountPercentage: 15,
        discountAmount: 4.05,
        finalPrice: 22.95,
        priceFloorApplied: false,
        items: [
          {
            pizzaId: '1',
            pizzaName: 'Margherita',
            quantity: 1,
            notes: 'Extra cheese',
            itemPrice: 12.00
          },
          {
            pizzaId: '2',
            pizzaName: 'Pepperoni',
            quantity: 1,
            notes: null,
            itemPrice: 15.00
          }
        ],
        createdAt: '2024-01-15T19:30:00.000Z'
      }
    ]

    return NextResponse.json(mockOrders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
} 