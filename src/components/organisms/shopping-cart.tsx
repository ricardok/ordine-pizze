import { forwardRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CartItemComponent } from '@/components/molecules/cart-item'
import { Pizza } from '@/lib/types'
import { useTranslations } from '@/components/simple-i18n-provider'

interface CartItem {
  pizzaId: string
  quantity: number
  notes?: string
}

interface ShoppingCartProps {
  cart: CartItem[]
  pizzas: Pizza[]
  getPizzaName: (pizzaId: string) => string
  onUpdateQuantity: (index: number, change: number) => void
  onRemoveItem: (index: number) => void
  onUpdateNotes: (index: number, notes: string) => void
  onStartEditingNotes: (index: number) => void
  onFinishEditingNotes: () => void
  editingItemIndex: number | null
  onNotesKeyPress: (e: React.KeyboardEvent) => void
}

export const ShoppingCart = forwardRef<HTMLDivElement, ShoppingCartProps>(
  ({
    cart,
    pizzas,
    getPizzaName,
    onUpdateQuantity,
    onRemoveItem,
    onUpdateNotes,
    onStartEditingNotes,
    onFinishEditingNotes,
    editingItemIndex,
    onNotesKeyPress
  }, ref) => {
    const { t } = useTranslations()

    const getSelectedPizza = (pizzaId: string) => pizzas.find(p => p.id === pizzaId)

    if (cart.length === 0) return null

    return (
      <Card ref={ref}>
        <CardHeader>
          <CardTitle>{t('cart.title')} ({cart.length} {cart.length === 1 ? 'item' : 'itens'})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cart.map((item, index) => (
              <CartItemComponent
                key={index}
                item={item}
                index={index}
                pizza={getSelectedPizza(item.pizzaId)}
                getPizzaName={getPizzaName}
                onUpdateQuantity={onUpdateQuantity}
                onRemove={onRemoveItem}
                onUpdateNotes={onUpdateNotes}
                onStartEditingNotes={onStartEditingNotes}
                onFinishEditingNotes={onFinishEditingNotes}
                editingItemIndex={editingItemIndex}
                onNotesKeyPress={onNotesKeyPress}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }
)

ShoppingCart.displayName = 'ShoppingCart' 