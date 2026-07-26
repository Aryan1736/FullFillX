import { Link } from 'react-router-dom'
import { List, Map } from 'lucide-react'

import { paths } from '../../routes/paths'
import { cn } from '../../utils/cn'

type WarehouseViewTabsProps = {
  active: 'list' | 'map'
}

export function WarehouseViewTabs({ active }: WarehouseViewTabsProps) {
  return (
    <nav
      aria-label="Warehouse views"
      className="inline-flex rounded-lg border border-slate-200 bg-white p-1 shadow-sm transition-shadow hover:shadow-md"
    >
      <Link
        to={paths.warehouses}
        aria-current={active === 'list' ? 'page' : undefined}
        className={cn(
          'inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2',
          active === 'list'
            ? 'bg-slate-900 text-white shadow-sm'
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
        )}
      >
        <List className="size-4" aria-hidden="true" />
        List
      </Link>
      <Link
        to={paths.warehouseMap}
        aria-current={active === 'map' ? 'page' : undefined}
        className={cn(
          'inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2',
          active === 'map'
            ? 'bg-slate-900 text-white shadow-sm'
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
        )}
      >
        <Map className="size-4" aria-hidden="true" />
        Map
      </Link>
    </nav>
  )
}
