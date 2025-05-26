import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ShoppingCart, Plus } from 'lucide-react'
import { Pizza } from '@/lib/types'
import { PizzaCard } from '@/components/molecules/pizza-card'
import { useTranslations } from '@/components/simple-i18n-provider'

interface PizzaSelectorProps {
  pizzas: Pizza[]
  selectedPizza: string
  selectedNotes: string
  onPizzaSelect: (pizzaId: string) => void
  onNotesChange: (notes: string) => void
  onAddToCart: () => void
  getPizzaName: (pizzaId: string) => string
  getPizzaDescription: (pizza: Pizza) => string
}

export function PizzaSelector({
  pizzas,
  selectedPizza,
  selectedNotes,
  onPizzaSelect,
  onNotesChange,
  onAddToCart,
  getPizzaName,
  getPizzaDescription
}: PizzaSelectorProps) {
  const { t } = useTranslations()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          {t('pizza.select.title')}
        </CardTitle>
        <CardDescription>
          {t('pizza.select.description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="pizza">{t('pizza.select.label')}</Label>
          
          <div className="grid gap-3 mt-2 max-h-96 overflow-y-auto pr-2">
            {pizzas.map(pizza => (
              <PizzaCard
                key={pizza.id}
                pizza={pizza}
                isSelected={selectedPizza === pizza.id}
                onSelect={onPizzaSelect}
                getPizzaName={getPizzaName}
                getPizzaDescription={getPizzaDescription}
              />
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="pizzaNotes">{t('pizza.select.notes')}</Label>
          <Input
            id="pizzaNotes"
            value={selectedNotes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder={t('pizza.select.notesPlaceholder')}
          />
        </div>

        <Button 
          onClick={(e) => {
            e.preventDefault()
            onAddToCart()
          }} 
          disabled={!selectedPizza}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t('pizza.select.addToCart')}
        </Button>
      </CardContent>
    </Card>
  )
} 