import type { LucideIcon } from 'lucide-react'

import { cn } from '../../utils/cn'

type KpiCardProps = {
  title: string
  value: string
  icon: LucideIcon
  description?: string
  className?: string
}

export function KpiCard({ title, value, icon: Icon, description, className }: KpiCardProps) {
  return (
    <article
      className={cn(
        'group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200',
        'hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 truncate text-2xl font-semibold tracking-tight text-slate-900">{value}</p>
          {description ? <p className="mt-1 text-xs leading-relaxed text-slate-500">{description}</p> : null}
        </div>
        <div className="rounded-lg bg-slate-100 p-2.5 text-slate-600 transition-colors group-hover:bg-indigo-50">
          <Icon className="size-5" aria-hidden="true" />
        </div>
      </div>
    </article>
  )
}

export function KpiCardSkeleton() {
  return (
    <div className="animate-skeleton rounded-xl border border-slate-200 bg-white p-5 shadow-sm" aria-hidden="true">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-3">
          <div className="h-4 w-24 rounded-md bg-slate-200" />
          <div className="h-8 w-20 rounded-md bg-slate-200" />
        </div>
        <div className="size-10 rounded-lg bg-slate-200" />
      </div>
    </div>
  )
}
