import type { ReactNode } from 'react'

import { Breadcrumbs } from './Breadcrumbs'
import { cn } from '../../utils/cn'

type PageHeaderProps = {
  title: string
  description: string
  category?: string
  badge?: ReactNode
  actions?: ReactNode
  className?: string
}

export function PageHeader({
  title,
  description,
  category,
  badge,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <header className={cn('animate-section-1 mb-8 border-b border-[#202027] pb-8', className)}>
      <div className="mb-2.5 flex items-center gap-2">
        <Breadcrumbs />
      </div>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl space-y-2">
          {category ? (
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[#71717A]">
                {category}
              </span>
            </div>
          ) : null}
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-3xl font-bold tracking-tight text-[#F4F4F5] sm:text-4xl lg:text-5xl">
              {title}
            </h1>
            {badge}
          </div>
          <p className="text-sm leading-relaxed text-[#A1A1AA] sm:text-base">
            {description}
          </p>
        </div>
        {actions ? <div className="shrink-0 flex flex-wrap items-center gap-3">{actions}</div> : null}
      </div>
    </header>
  )
}
