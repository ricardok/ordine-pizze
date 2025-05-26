import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Minus } from 'lucide-react'
import { Pizza } from '@/lib/types'
import { PriceDisplay } from '@/components/atoms/price-display'
import { useTranslations } from '@/components/simple-i18n-provider'

interface CartItem {
  pizzaId: string
  quantity: number
  notes?: string
}

interface CartItemProps {
  item: CartItem
  index: number
  pizza: Pizza | undefined
  getPizzaName: (pizzaId: string) => string
  onUpdateQuantity: (index: number, change: number) => void
  onRemove: (index: number) => void
  onUpdateNotes: (index: number, notes: string) => void
  onStartEditingNotes: (index: number) => void
  onFinishEditingNotes: () => void
  editingItemIndex: number | null
  onNotesKeyPress: (e: React.KeyboardEvent) => void
}

export function CartItemComponent({
  item,
  index,
  pizza,
  getPizzaName,
  onUpdateQuantity,
  onRemove,
  onUpdateNotes,
  onStartEditingNotes,
  onFinishEditingNotes,
  editingItemIndex,
  onNotesKeyPress
}: CartItemProps) {
  const { t } = useTranslations()

  if (!pizza) return null

  return (
    <div className="p-4 border rounded-lg space-y-3">
      {/* Mobile Layout */}
      <div className="block md:hidden">
        <div className="flex items-start gap-3">
          <img 
            src={pizza.image} 
            alt={getPizzaName(item.pizzaId)}
            className="w-16 h-12 object-cover rounded flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm">
              {getPizzaName(item.pizzaId)}
            </div>
            {item.notes && (
              <div 
                className="text-xs text-muted-foreground italic cursor-pointer hover:text-foreground transition-colors mt-1"
                onClick={() => onStartEditingNotes(index)}
              >
                &ldquo;{item.notes}&rdquo;
              </div>
            )}
            {!item.notes && (
              <div 
                className="text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors mt-1"
                onClick={() => onStartEditingNotes(index)}
              >
                {t('pizza.select.addNotes')}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onUpdateQuantity(index, -1)}
              className="h-8 w-8 p-0"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onUpdateQuantity(index, 1)}
              className="h-8 w-8 p-0"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onRemove(index)}
            className="text-xs"
          >
            {t('cart.remove')}
          </Button>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <img 
            src={pizza.image} 
            alt={getPizzaName(item.pizzaId)}
            className="w-16 h-12 object-cover rounded flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="font-medium">
              {getPizzaName(item.pizzaId)}
            </div>
            {item.notes && (
              <div 
                className="text-sm text-muted-foreground italic cursor-pointer hover:text-foreground transition-colors"
                onClick={() => onStartEditingNotes(index)}
              >
                &ldquo;{item.notes}&rdquo;
              </div>
            )}
            {!item.notes && (
              <div 
                className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                onClick={() => onStartEditingNotes(index)}
              >
                {t('pizza.select.addNotes')}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onUpdateQuantity(index, -1)}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-8 text-center">{item.quantity}</span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onUpdateQuantity(index, 1)}
          >
            <Plus className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onRemove(index)}
          >
            {t('cart.remove')}
          </Button>
        </div>
      </div>

      {editingItemIndex === index && (
        <div>
          <Input
            value={item.notes || ''}
            onChange={(e) => onUpdateNotes(index, e.target.value)}
            onBlur={onFinishEditingNotes}
            onKeyDown={onNotesKeyPress}
            placeholder={t('pizza.select.notesPlaceholder')}
            autoFocus
          />
        </div>
      )}
    </div>
  )
} 