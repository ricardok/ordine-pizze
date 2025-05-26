import { Pizza } from '@/lib/types'
import OrderHandler from '@/components/order-handler'
import { SimpleI18nProvider } from '@/components/simple-i18n-provider'

async function getPizzas(): Promise<Pizza[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/pizzas`, {
    cache: 'no-store'
  })
  
  if (!res.ok) {
    throw new Error('Failed to fetch pizzas')
  }
  
  return res.json()
}

export default async function Home() {
  const pizzas = await getPizzas()

  return (
    <SimpleI18nProvider>
      <div className="container mx-auto px-4 py-8">
        <OrderHandler pizzas={pizzas} />
      </div>
    </SimpleI18nProvider>
  )
} 