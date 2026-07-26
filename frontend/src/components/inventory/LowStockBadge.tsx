import { AlertTriangle, CheckCircle2 } from 'lucide-react'

import { cn } from '../../utils/cn'

type LowStockBadgeProps = {
  lowStock: boolean
  className?: string
}

export function LowStockBadge({ lowStock, className }: LowStockBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
        lowStock ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-700',
        className,
      )}
    >
      {lowStock ? (
        <>
          <AlertTriangle className="size-3" aria-hidden="true" />
          Low stock
        </>
      ) : (
        <>
          <CheckCircle2 className="size-3" aria-hidden="true" />
          In stock
        </>
      )}
    </span>
  )
}
