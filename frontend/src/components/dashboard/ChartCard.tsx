import type { ReactNode } from 'react'

import { cn } from '../../utils/cn'

type ChartCardProps = {
  title: string
  description?: string
  badge?: ReactNode
  action?: ReactNode
  children: ReactNode
  className?: string
  isEmpty?: boolean
  emptyMessage?: string
}

export function ChartCard({
  title,
  description,
  badge,
  action,
  children,
  className,
  isEmpty = false,
  emptyMessage = 'No data available yet.',
}: ChartCardProps) {
  return (
    <section
      className={cn(
        'overflow-hidden rounded-xl border border-[#262630] bg-[#17171B] p-5',
        className,
      )}
    >
      <header className="mb-4 flex flex-wrap items-start justify-between gap-3 border-b border-[#262630] pb-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-sm font-bold tracking-tight text-[#F4F4F5]">
              {title}
            </h2>
            {badge}
          </div>
          {description ? (
            <p className="mt-0.5 text-xs text-[#71717A]">{description}</p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </header>

      {isEmpty ? (
        <div className="flex h-64 items-center justify-center rounded border border-dashed border-[#262630] bg-[#141418] px-4 text-center text-xs text-[#71717A]">
          {emptyMessage}
        </div>
      ) : (
        children
      )}
    </section>
  )
}

export function ChartSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-skeleton rounded-xl border border-[#262630] bg-[#17171B] p-5',
        className,
      )}
    >
      <div className="mb-4 space-y-2">
        <div className="h-4 w-40 rounded bg-[#262630]" />
        <div className="h-3 w-56 rounded bg-[#202027]" />
      </div>
      <div className="h-64 rounded bg-[#141418]" />
    </div>
  )
}
