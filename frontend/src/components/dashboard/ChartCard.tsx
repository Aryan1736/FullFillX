import type { ReactNode } from 'react'

import { cn } from '../../utils/cn'

type ChartCardProps = {
  title: string
  description?: string
  children: ReactNode
  className?: string
  isEmpty?: boolean
  emptyMessage?: string
}

export function ChartCard({
  title,
  description,
  children,
  className,
  isEmpty = false,
  emptyMessage = 'No data available yet.',
}: ChartCardProps) {
  return (
    <section
      className={cn(
        'rounded-xl border border-slate-200 bg-white p-5 shadow-sm',
        className,
      )}
    >
      <header className="mb-4">
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
        {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
      </header>

      {isEmpty ? (
        <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 text-center text-sm text-slate-500">
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
    <div className={cn('animate-pulse rounded-xl border border-slate-200 bg-white p-5 shadow-sm', className)}>
      <div className="mb-4 space-y-2">
        <div className="h-5 w-40 rounded bg-slate-200" />
        <div className="h-4 w-56 rounded bg-slate-200" />
      </div>
      <div className="h-64 rounded-lg bg-slate-100" />
    </div>
  )
}
