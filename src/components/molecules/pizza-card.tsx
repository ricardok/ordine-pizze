import { Pizza } from '@/lib/types'
import { PriceDisplay } from '@/components/atoms/price-display'
import { cn } from '@/lib/utils'

interface PizzaCardProps {
  pizza: Pizza
  isSelected?: boolean
  onSelect: (pizzaId: string) => void
  getPizzaName: (pizzaId: string) => string
  getPizzaDescription: (pizza: Pizza) => string
  className?: string
}

export function PizzaCard({
  pizza,
  isSelected = false,
  onSelect,
  getPizzaName,
  getPizzaDescription,
  className
}: PizzaCardProps) {
  return (
    <div
      className={cn(
        'p-3 border rounded-lg cursor-pointer transition-all',
        isSelected
          ? 'border-primary bg-primary/5 ring-1 ring-primary'
          : 'border-border hover:border-primary/50',
        className
      )}
      onClick={() => onSelect(pizza.id)}
    >
      <div className="flex items-center gap-3">
        <img 
          src={pizza.image} 
          alt={getPizzaName(pizza.id)}
          className="w-16 h-12 object-cover rounded flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm md:text-base">{getPizzaName(pizza.id)}</h4>
            <PriceDisplay price={pizza.basePrice} variant="primary" />
          </div>
          <p className="text-xs md:text-sm text-muted-foreground mt-1 line-clamp-2">
            {getPizzaDescription(pizza)}
          </p>
        </div>
      </div>
    </div>
  )
} 