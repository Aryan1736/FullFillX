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
      className="inline-flex rounded-lg border border-[#262630] bg-[#17171B] p-1 shadow-sm"
    >
      <Link
        to={paths.warehouses}
        aria-current={active === 'list' ? 'page' : undefined}
        className={cn(
          'inline-flex items-center gap-2 rounded-md px-3 py-1.5 font-mono text-xs font-medium transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4622D]',
          active === 'list'
            ? 'border border-[#262630] bg-[#1C1C21] font-semibold text-[#F4F4F5] shadow-xs'
            : 'text-[#A1A1AA] hover:bg-[#1C1C21] hover:text-[#F4F4F5]',
        )}
      >
        <List className="size-3.5" aria-hidden="true" />
        <span>List</span>
      </Link>
      <Link
        to={paths.warehouseMap}
        aria-current={active === 'map' ? 'page' : undefined}
        className={cn(
          'inline-flex items-center gap-2 rounded-md px-3 py-1.5 font-mono text-xs font-medium transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4622D]',
          active === 'map'
            ? 'border border-[#262630] bg-[#1C1C21] font-semibold text-[#F4F4F5] shadow-xs'
            : 'text-[#A1A1AA] hover:bg-[#1C1C21] hover:text-[#F4F4F5]',
        )}
      >
        <Map className="size-3.5" aria-hidden="true" />
        <span>Map</span>
      </Link>
    </nav>
  )
}
