import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

export type StatusVariant =
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'purple'
  | 'neutral'
  | 'primary'

type StatusBadgeProps = {
  label: string
  variant?: StatusVariant
  icon?: ReactNode
  showDot?: boolean
  pulseDot?: boolean
  size?: 'sm' | 'md'
  className?: string
}

const variantStyles: Record<
  StatusVariant,
  { badge: string; dot: string }
> = {
  success: {
    badge: 'bg-[#3FA66B]/15 text-[#3FA66B] border-[#3FA66B]/30',
    dot: 'bg-[#3FA66B]',
  },
  warning: {
    badge: 'bg-[#D08A35]/15 text-[#D08A35] border-[#D08A35]/30',
    dot: 'bg-[#D08A35]',
  },
  danger: {
    badge: 'bg-[#C95555]/15 text-[#C95555] border-[#C95555]/30',
    dot: 'bg-[#C95555]',
  },
  info: {
    badge: 'bg-[#C4622D]/15 text-[#C4622D] border-[#C4622D]/30',
    dot: 'bg-[#C4622D]',
  },
  purple: {
    badge: 'bg-[#C4622D]/15 text-[#C4622D] border-[#C4622D]/30',
    dot: 'bg-[#C4622D]',
  },
  neutral: {
    badge: 'bg-[#1C1C21] text-[#A1A1AA] border-[#262630]',
    dot: 'bg-[#71717A]',
  },
  primary: {
    badge: 'bg-[#C4622D]/15 text-[#C4622D] border-[#C4622D]/30',
    dot: 'bg-[#C4622D]',
  },
}

export function StatusBadge({
  label,
  variant = 'neutral',
  icon,
  showDot = true,
  pulseDot = false,
  size = 'md',
  className,
}: StatusBadgeProps) {
  const styles = variantStyles[variant]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border font-mono font-medium transition-colors',
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs',
        styles.badge,
        className,
      )}
    >
      {showDot ? (
        <span className="relative flex size-1.5 shrink-0 items-center justify-center">
          {pulseDot ? (
            <span
              className={cn(
                'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
                styles.dot,
              )}
            />
          ) : null}
          <span className={cn('relative inline-flex size-1.5 rounded-full', styles.dot)} />
        </span>
      ) : null}
      {icon ? <span className="shrink-0">{icon}</span> : null}
      <span className="truncate">{label}</span>
    </span>
  )
}
