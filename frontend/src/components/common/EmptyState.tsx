import type { LucideIcon } from 'lucide-react'
import { Inbox } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '../../utils/cn'

type EmptyStateProps = {
  icon?: LucideIcon
  title: string
  description: string
  action?: ReactNode
  className?: string
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm sm:p-10',
        className,
      )}
    >
      <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors">
        <Icon className="size-6" aria-hidden="true" />
      </div>
      <h2 className="mt-4 text-lg font-semibold tracking-tight text-slate-900">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}
