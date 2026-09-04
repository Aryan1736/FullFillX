import { Search, SlidersHorizontal, X } from 'lucide-react'

import type { Warehouse } from '../../types/warehouse'
import { cn } from '../../utils/cn'

export type InventoryStatusTab = 'ALL' | 'HEALTHY' | 'LOW_STOCK' | 'OUT_OF_STOCK'

type InventoryFiltersProps = {
  search: string
  warehouseId: string
  statusFilter: InventoryStatusTab
  warehouses: Warehouse[]
  counts?: {
    all: number
    healthy: number
    lowStock: number
    outOfStock: number
  }
  onSearchChange: (value: string) => void
  onWarehouseChange: (value: string) => void
  onStatusFilterChange: (value: InventoryStatusTab) => void
  onResetFilters?: () => void
}

export function InventoryFilters({
  search,
  warehouseId,
  statusFilter,
  warehouses,
  counts,
  onSearchChange,
  onWarehouseChange,
  onStatusFilterChange,
  onResetFilters,
}: InventoryFiltersProps) {
  const tabs: { key: InventoryStatusTab; label: string; count?: number }[] = [
    { key: 'ALL', label: 'All', count: counts?.all },
    { key: 'HEALTHY', label: 'Healthy', count: counts?.healthy },
    { key: 'LOW_STOCK', label: 'Low Stock', count: counts?.lowStock },
    { key: 'OUT_OF_STOCK', label: 'Out of Stock', count: counts?.outOfStock },
  ]

  const hasActiveFilters = Boolean(search || warehouseId || statusFilter !== 'ALL')

  return (
    <div className="space-y-4">
      {/* 1. Developer-Tool Style Status Tabs (Linear/GitHub aesthetic) */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[#202027] pb-px">
        <nav
          role="tablist"
          aria-label="Filter inventory by stock status"
          className="flex flex-wrap items-center gap-1 -mb-px"
        >
          {tabs.map((tab) => {
            const isActive = statusFilter === tab.key
            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onStatusFilterChange(tab.key)}
                className={cn(
                  'group relative inline-flex items-center gap-2 border-b-2 px-3.5 py-2.5 text-xs font-semibold tracking-wide transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4622D]',
                  isActive
                    ? 'border-[#C4622D] text-[#F4F4F5]'
                    : 'border-transparent text-[#71717A] hover:border-[#262630] hover:text-[#A1A1AA]',
                )}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={cn(
                      'rounded px-1.5 py-0.2 font-mono text-[10px] transition-colors',
                      isActive
                        ? 'border border-[#262630] bg-[#1C1C21] text-[#F4F4F5]'
                        : 'text-[#71717A] group-hover:text-[#A1A1AA]',
                    )}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {hasActiveFilters && onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#71717A] transition-colors hover:text-[#F4F4F5] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C4622D] self-start sm:self-auto py-1"
          >
            <X className="size-3.5" />
            <span>Clear filters</span>
          </button>
        )}
      </div>

      {/* 2. Secondary Filter Inputs Toolbar (Search & Warehouse) */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_280px]">
        {/* Search */}
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#71717A]"
            aria-hidden="true"
          />
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search SKU or product name..."
            className="h-9 w-full rounded-md border border-[#262630] bg-[#17171B] pl-9 pr-3 text-xs text-[#F4F4F5] placeholder-[#71717A] outline-none transition-colors hover:border-[#383844] focus:border-[#C4622D] focus:ring-1 focus:ring-[#C4622D]"
          />
        </div>

        {/* Warehouse Selector */}
        <div className="relative flex items-center">
          <label htmlFor="inventory-warehouse-select" className="sr-only">
            Filter by Warehouse
          </label>
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]">
            <SlidersHorizontal className="size-3.5" aria-hidden="true" />
          </div>
          <select
            id="inventory-warehouse-select"
            value={warehouseId}
            onChange={(event) => onWarehouseChange(event.target.value)}
            className="h-9 w-full appearance-none rounded-md border border-[#262630] bg-[#17171B] pl-8 pr-8 text-xs font-medium text-[#F4F4F5] outline-none transition-colors hover:border-[#383844] focus:border-[#C4622D] focus:ring-1 focus:ring-[#C4622D]"
          >
            <option value="" className="bg-[#17171B] text-[#F4F4F5]">
              All Fulfillment Warehouses
            </option>
            {warehouses.map((warehouse) => (
              <option key={warehouse.id} value={warehouse.id} className="bg-[#17171B] text-[#F4F4F5]">
                {warehouse.name} ({warehouse.city})
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#71717A] text-[10px]">
            ▼
          </span>
        </div>
      </div>
    </div>
  )
}
