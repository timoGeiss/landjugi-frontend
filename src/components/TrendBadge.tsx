import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface TrendBadgeProps {
  value: number | null
  className?: string
}

export function TrendBadge({ value, className = '' }: TrendBadgeProps) {
  if (value == null) return null

  if (Math.abs(value) < 0.05) {
    return (
      <span className={`inline-flex items-center gap-1 text-xs text-muted ${className}`}>
        <Minus size={12} /> Stabil
      </span>
    )
  }

  const positive = value > 0
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${positive ? 'text-grade-6' : 'text-grade-fail'} ${className}`}>
      {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
      {positive ? '+' : ''}{value.toFixed(2)}
    </span>
  )
}
