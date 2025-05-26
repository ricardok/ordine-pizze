export const getBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_BASE_URL || window.location.origin
  }
  
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL
  }
  
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  return 'http://localhost:3000'
}

/**
 * Get the API base URL for making requests
 */
export const getApiUrl = (endpoint: string): string => {
  const baseUrl = getBaseUrl()
  return `${baseUrl}/api/${endpoint.replace(/^\//, '')}`
}
