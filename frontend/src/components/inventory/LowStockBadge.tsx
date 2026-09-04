import type { StockStatus } from '../../types/inventory'
import { cn } from '../../utils/cn'

type LowStockBadgeProps = {
  status?: StockStatus
  lowStock?: boolean
  className?: string
}

export function LowStockBadge({ status, lowStock, className }: LowStockBadgeProps) {
  // Resolve effective status
  const resolvedStatus: StockStatus = status
    ? status
    : lowStock
    ? 'LOW_STOCK'
    : 'HEALTHY'

  const config = {
    HEALTHY: {
      label: 'HEALTHY',
      dotClass: 'bg-[#3FA66B]',
      textClass: 'text-[#3FA66B]',
    },
    LOW_STOCK: {
      label: 'LOW STOCK',
      dotClass: 'bg-[#D08A35]',
      textClass: 'text-[#D08A35]',
    },
    OUT_OF_STOCK: {
      label: 'OUT OF STOCK',
      dotClass: 'bg-[#C95555]',
      textClass: 'text-[#C95555]',
    },
  }[resolvedStatus]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold tracking-wider',
        config.textClass,
        className,
      )}
    >
      <span className={cn('size-1.5 rounded-full shrink-0', config.dotClass)} aria-hidden="true" />
      <span>{config.label}</span>
    </span>
  )
}
