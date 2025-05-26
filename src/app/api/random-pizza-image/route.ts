import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Get cache parameter from query string
    const { searchParams } = new URL(request.url)
    const shouldCache = searchParams.get('cache') === 'true'
    
    // Configure fetch options based on cache parameter
    const fetchOptions: RequestInit = shouldCache 
      ? {
          // Use default caching when cache=true
          headers: {
            'Accept': 'application/json'
          }
        }
      : {
          // Disable caching when cache=false or not specified
          cache: 'no-store',
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
          }
        }
    
    const response = await fetch('https://foodish-api.com/api/images/pizza', fetchOptions)
    
    if (!response.ok) {
      throw new Error('Failed to fetch from Foodish API')
    }
    
    const data = await response.json()
    
    // Configure response headers based on cache parameter
    const responseHeaders: Record<string, string> = shouldCache 
      ? {
          'Content-Type': 'application/json',
          // Allow caching for 5 minutes when cache=true
          'Cache-Control': 'public, max-age=300, stale-while-revalidate=60'
        }
      : {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
    
    return new NextResponse(JSON.stringify(data), {
      status: 200,
      headers: responseHeaders
    })
  } catch (error) {
    console.error('Error fetching pizza image:', error)
    
    // Get cache parameter for fallback response
    const { searchParams } = new URL(request.url)
    const shouldCache = searchParams.get('cache') === 'true'
    
    // Configure fallback response headers
    const fallbackHeaders: Record<string, string> = shouldCache
      ? {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300, stale-while-revalidate=60'
        }
      : {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
    
    // Fallback to a default pizza image
    return new NextResponse(JSON.stringify({
      image: 'https://placehold.co/300x300?text=Pizza'
    }), {
      status: 200,
      headers: fallbackHeaders
    })
  }
} 