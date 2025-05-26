import { cn } from '@/lib/utils'

interface PriceDisplayProps {
  price: number
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'primary' | 'discount'
  className?: string
}

export function PriceDisplay({ 
  price, 
  size = 'md', 
  variant = 'default',
  className 
}: PriceDisplayProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  const variantClasses = {
    default: 'text-foreground',
    primary: 'text-primary font-semibold',
    discount: 'text-green-600 dark:text-green-400'
  }

  return (
    <span className={cn(
      sizeClasses[size],
      variantClasses[variant],
      className
    )}>
      €{price.toFixed(2)}
    </span>
  )
} 