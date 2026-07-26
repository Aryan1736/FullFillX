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
      className={cn('flex items-center justify-center gap-2 text-sm text-slate-600', className)}
    >
      <Loader2 className="size-5 animate-spin text-indigo-600" aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}
