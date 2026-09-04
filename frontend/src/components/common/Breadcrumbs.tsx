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
    <nav aria-label="Breadcrumb" className={cn('text-xs font-mono', className)}>
      <ol className="flex flex-wrap items-center gap-1.5 text-[#71717A]">
        <li>
          <Link
            to={paths.dashboard}
            className="inline-flex items-center gap-1 rounded px-1 py-0.5 transition-colors hover:text-[#F4F4F5] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C4622D]"
            aria-label="Dashboard home"
          >
            <Home className="size-3.5" aria-hidden="true" />
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              <ChevronRight className="size-3 text-[#262630]" aria-hidden="true" />
              {item.path && !isLast ? (
                <Link
                  to={item.path}
                  className="rounded px-1 py-0.5 text-[#A1A1AA] transition-colors hover:text-[#F4F4F5] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C4622D]"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="font-semibold text-[#F4F4F5]" aria-current="page">
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
