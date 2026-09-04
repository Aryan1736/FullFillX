import { Loader2 } from 'lucide-react'

import { cn } from '../../utils/cn'

type LoadingSpinnerProps = {
  label?: string
  className?: string
}

export function LoadingSpinner({ label = 'Loading', className }: LoadingSpinnerProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={cn('flex items-center justify-center gap-2 font-mono text-xs text-[#A1A1AA]', className)}
    >
      <Loader2 className="size-4 animate-spin text-[#C4622D]" aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}
