import { Search } from 'lucide-react'

import type { Warehouse } from '../../types/warehouse'

type LowStockFilter = 'all' | 'lowStock'

type InventoryFiltersProps = {
  search: string
  warehouseId: string
  lowStockFilter: LowStockFilter
  warehouses: Warehouse[]
  onSearchChange: (value: string) => void
  onWarehouseChange: (value: string) => void
  onLowStockFilterChange: (value: LowStockFilter) => void
}

export function InventoryFilters({
  search,
  warehouseId,
  lowStockFilter,
  warehouses,
  onSearchChange,
  onWarehouseChange,
  onLowStockFilterChange,
}: InventoryFiltersProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)]">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">Search</span>
          <span className="relative block">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search product, SKU, or warehouse..."
              className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-3 text-sm text-slate-900 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </span>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">Warehouse</span>
          <select
            value={warehouseId}
            onChange={(event) => onWarehouseChange(event.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="">All warehouses</option>
            {warehouses.map((warehouse) => (
              <option key={warehouse.id} value={warehouse.id}>
                {warehouse.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">Stock level</span>
          <select
            value={lowStockFilter}
            onChange={(event) => onLowStockFilterChange(event.target.value as LowStockFilter)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="all">All stock levels</option>
            <option value="lowStock">Low stock only</option>
          </select>
        </label>
      </div>
    </section>
  )
}

export type { LowStockFilter }
