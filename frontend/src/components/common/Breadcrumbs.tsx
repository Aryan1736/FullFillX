import { ChevronRight, Home } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

import { getBreadcrumbs } from '../../routes/breadcrumbs'
import { paths } from '../../routes/paths'
import { cn } from '../../utils/cn'

type BreadcrumbsProps = {
  className?: string
}

export function Breadcrumbs({ className }: BreadcrumbsProps) {
  const { pathname } = useLocation()
  const items = getBreadcrumbs(pathname)

  if (items.length <= 1 && pathname === paths.dashboard) {
    return null
  }

  return (
    <nav aria-label="Breadcrumb" className={cn('text-sm', className)}>
      <ol className="flex flex-wrap items-center gap-1.5 text-slate-500">
        <li>
          <Link
            to={paths.dashboard}
            className="inline-flex items-center gap-1 rounded-md px-1 py-0.5 transition-colors hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            aria-label="Dashboard home"
          >
            <Home className="size-3.5" aria-hidden="true" />
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              <ChevronRight className="size-3.5 text-slate-400" aria-hidden="true" />
              {item.path && !isLast ? (
                <Link
                  to={item.path}
                  className="rounded-md px-1 py-0.5 font-medium transition-colors hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="font-medium text-slate-900" aria-current="page">
                  {item.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
