import { Pizza } from '@/lib/types'
import { getApiUrl } from '@/lib/config'

// Mock pizza 
export const mockPizzas: Pizza[] = [
  {
    id: '1',
    name: 'Margherita',
    description: 'pizza.descriptions.margherita',
    basePrice: 12.00
  },
  {
    id: '2',
    name: 'Pepperoni',
    description: 'pizza.descriptions.pepperoni',
    basePrice: 14.00
  },
  {
    id: '3',
    name: 'Hawaiian',
    description: 'pizza.descriptions.hawaiian',
    basePrice: 15.00
  },
  {
    id: '4',
    name: 'Vegetarian',
    description: 'pizza.descriptions.vegetarian',
    basePrice: 15.00
  },
  {
    id: '5',
    name: 'Quattro Stagioni',
    description: 'pizza.descriptions.quattroStagioni',
    basePrice: 16.00
  },
  {
    id: '6',
    name: 'Meat Lovers',
    description: 'pizza.descriptions.meatLovers',
    basePrice: 18.00
  }
]

// Fetch random pizza image
export async function fetchRandomPizzaImage(useCache: boolean = true): Promise<string> {
  try {
    const cacheParam = useCache ? '?cache=true' : ''
    const response = await fetch(`${getApiUrl('random-pizza-image')}${cacheParam}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })
    
    const data = await response.json()
    return data.image
  } catch (error) {
    console.log('Error fetching random pizza image:', error)
    return 'https://placehold.co/300x300?text=Pizza'
  }
}

// Get pizzas with images
export async function getPizzasWithImages(useCache: boolean = false): Promise<Pizza[]> {
  const pizzasWithImages = await Promise.all(
    mockPizzas.map(async (pizza) => {
      const imageUrl = await fetchRandomPizzaImage(useCache)
      return {
        ...pizza,
        image: imageUrl
      }
    })
  )

  return pizzasWithImages
} 