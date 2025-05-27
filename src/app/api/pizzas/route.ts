import { NextResponse } from 'next/server'
import { mockPizzas } from '@/lib/mocks/pizzas'

// Force this route to be dynamic since it fetches external data
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Return mock data sorted by name
    const sortedPizzas = [...mockPizzas].sort((a, b) => a.name.localeCompare(b.name))
    
    return NextResponse.json(sortedPizzas)
  } catch (error) {
    console.error('Error fetching pizzas:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pizzas' },
      { status: 500 }
    )
  }
} 