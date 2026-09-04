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
        'rounded-xl border border-dashed border-[#262630] bg-[#17171B] p-8 text-center shadow-xl sm:p-10 text-[#F4F4F5]',
        className,
      )}
    >
      <div className="mx-auto flex size-12 items-center justify-center rounded-xl border border-[#262630] bg-[#1C1C21] text-[#71717A]">
        <Icon className="size-6 text-[#C4622D]" aria-hidden="true" />
      </div>
      <h2 className="mt-4 font-display text-base font-bold tracking-tight text-[#F4F4F5]">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-[#A1A1AA]">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}
