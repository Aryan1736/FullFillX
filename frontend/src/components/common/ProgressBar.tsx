import { cn } from '../../utils/cn'

type ProgressBarProps = {
  value: number
  max?: number
  tone?: 'auto' | 'emerald' | 'amber' | 'rose' | 'indigo' | 'violet'
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  labelPrefix?: string
  className?: string
}

function resolveTone(percentage: number): 'emerald' | 'amber' | 'rose' {
  if (percentage >= 85) return 'rose'
  if (percentage >= 65) return 'amber'
  return 'emerald'
}

const toneStyles = {
  emerald: 'bg-[#3FA66B]',
  amber: 'bg-[#D08A35]',
  rose: 'bg-[#C95555]',
  indigo: 'bg-[#C4622D]',
  violet: 'bg-[#C4622D]',
}

const sizeStyles = {
  sm: 'h-1.5',
  md: 'h-2',
  lg: 'h-2.5',
}

export function ProgressBar({
  value,
  max = 100,
  tone = 'auto',
  size = 'md',
  showLabel = false,
  labelPrefix,
  className,
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  const resolvedTone = tone === 'auto' ? resolveTone(percentage) : tone

  return (
    <div className={cn('w-full', className)}>
      {showLabel ? (
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="font-mono text-[#71717A]">{labelPrefix}</span>
          <span className="font-mono font-semibold text-[#F4F4F5]">{percentage.toFixed(1)}%</span>
        </div>
      ) : null}
      <div className={cn('w-full overflow-hidden rounded-full bg-[#1C1C21] ring-1 ring-[#262630]', sizeStyles[size])}>
        <div
          className={cn('h-full rounded-full transition-all duration-500 ease-out', toneStyles[resolvedTone])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
