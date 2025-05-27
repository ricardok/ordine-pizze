import { Pizza } from '@/lib/types'

// Mock pizza data with fixed images
export const mockPizzas: Pizza[] = [
  {
    id: '1',
    name: 'Margherita',
    description: 'pizza.descriptions.margherita',
    basePrice: 12.00,
    image: 'https://foodish-api.com/images/pizza/pizza77.jpg'
  },
  {
    id: '2',
    name: 'Pepperoni',
    description: 'pizza.descriptions.pepperoni',
    basePrice: 14.00,
    image: 'https://foodish-api.com/images/pizza/pizza92.jpg'
  },
  {
    id: '3',
    name: 'Hawaiian',
    description: 'pizza.descriptions.hawaiian',
    basePrice: 15.00,
    image: 'https://foodish-api.com/images/pizza/pizza54.jpg'
  },
  {
    id: '4',
    name: 'Vegetarian',
    description: 'pizza.descriptions.vegetarian',
    basePrice: 15.00,
    image: 'https://foodish-api.com/images/pizza/pizza23.jpg'
  },
  {
    id: '5',
    name: 'Quattro Stagioni',
    description: 'pizza.descriptions.quattroStagioni',
    basePrice: 16.00,
    image: 'https://foodish-api.com/images/pizza/pizza15.jpg'
  },
  {
    id: '6',
    name: 'Meat Lovers',
    description: 'pizza.descriptions.meatLovers',
    basePrice: 18.00,
    image: 'https://foodish-api.com/images/pizza/pizza31.jpg'
  }
] 