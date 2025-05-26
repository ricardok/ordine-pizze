import { NextResponse } from 'next/server'
import { getPizzasWithImages } from '@/lib/mocks/pizzas'

export async function GET() {
  try {
    // Get pizzas with images from centralized mock
    const pizzasWithImages = await getPizzasWithImages()
    
    // Return mock data sorted by name
    const sortedPizzas = [...pizzasWithImages].sort((a, b) => a.name.localeCompare(b.name))
    
    return NextResponse.json(sortedPizzas)
  } catch (error) {
    console.error('Error fetching pizzas:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pizzas' },
      { status: 500 }
    )
  }
} 