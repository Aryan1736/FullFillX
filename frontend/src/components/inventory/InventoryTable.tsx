import { ArrowDown, ArrowUp, ArrowUpDown, ArrowRight } from 'lucide-react'

import { formatQuantity, getStockRatio, getStockStatus } from '../../services/inventoryService'
import type { InventoryItem, InventorySort, InventorySortField } from '../../types/inventory'
import { LowStockBadge } from './LowStockBadge'

type InventoryTableProps = {
  items: InventoryItem[]
  sort: InventorySort
  onSortChange: (field: InventorySortField) => void
  onSelect: (item: InventoryItem) => void
}

type HeaderProps = {
  label: string
  field: InventorySortField
  currentSort: InventorySort
  onSortChange: (field: InventorySortField) => void
  align?: 'left' | 'right'
}

function SortHeader({ label, field, currentSort, onSortChange, align = 'left' }: HeaderProps) {
  const isActive = currentSort.field === field
  const Icon = !isActive ? ArrowUpDown : currentSort.direction === 'asc' ? ArrowUp : ArrowDown

  return (
    <th
      scope="col"
      className={`px-5 py-3 text-[11px] font-mono font-semibold uppercase tracking-wider ${
        align === 'right' ? 'text-right' : 'text-left'
      }`}
    >
      <button
        type="button"
        onClick={() => onSortChange(field)}
        className={`group inline-flex items-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C4622D] rounded ${
          isActive ? 'text-[#F4F4F5]' : 'text-[#71717A] hover:text-[#A1A1AA]'
        }`}
      >
        <span>{label}</span>
        <Icon
          className={`size-3 transition-colors ${
            isActive ? 'text-[#C4622D]' : 'text-[#71717A] group-hover:text-[#A1A1AA]'
          }`}
          aria-hidden="true"
        />
      </button>
    </th>
  )
}

export function InventoryTable({
  items,
  sort,
  onSortChange,
  onSelect,
}: InventoryTableProps) {
  return (
    <div>
      {/* 1. Desktop High-Density Table */}
      <div className="hidden md:block overflow-hidden rounded-xl border border-[#262630] bg-[#17171B] shadow-2xs">
        <table className="min-w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#202027] bg-[#141417]">
              <SortHeader
                label="Product / SKU"
                field="productName"
                currentSort={sort}
                onSortChange={onSortChange}
              />
              <SortHeader
                label="Warehouse"
                field="warehouseName"
                currentSort={sort}
                onSortChange={onSortChange}
              />
              <SortHeader
                label="Available Units"
                field="availableQuantity"
                currentSort={sort}
                onSortChange={onSortChange}
                align="right"
              />
              <th
                scope="col"
                className="px-5 py-3 text-left font-mono text-[11px] font-semibold uppercase tracking-wider text-[#71717A]"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-5 py-3 text-right font-mono text-[11px] font-semibold uppercase tracking-wider text-[#71717A]"
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#202027]">
            {items.map((item) => {
              const status = getStockStatus(item)
              const ratio = getStockRatio(item)

              return (
                <tr
                  key={item.id}
                  onClick={() => onSelect(item)}
                  className="group cursor-pointer transition-colors duration-200 hover:bg-[#1C1C21]"
                >
                  {/* Product / SKU */}
                  <td className="px-5 py-3.5">
                    <div className="space-y-0.5">
                      <p className="font-display text-sm font-semibold tracking-tight text-[#F4F4F5] group-hover:text-white transition-colors">
                        {item.productName}
                      </p>
                      <p className="font-mono text-xs text-[#71717A]">
                        {item.sku}
                      </p>
                    </div>
                  </td>

                  {/* Warehouse */}
                  <td className="px-5 py-3.5">
                    <p className="text-xs text-[#A1A1AA]">
                      {item.warehouseName}
                    </p>
                  </td>

                  {/* Available Units with subtle integrated capacity bar */}
                  <td className="px-5 py-3.5 text-right">
                    <div className="inline-flex flex-col items-end space-y-1">
                      <div className="flex items-baseline gap-1.5 font-mono">
                        <span className="text-sm font-semibold text-[#F4F4F5]">
                          {formatQuantity(item.availableQuantity)}
                        </span>
                        <span className="text-[11px] text-[#71717A]">units</span>
                      </div>
                      {/* Subtle thin stock ratio bar */}
                      <div className="w-20 h-1 rounded-full bg-[#202027] overflow-hidden">
                        <div
                          className={`h-full ${
                            status === 'OUT_OF_STOCK'
                              ? 'bg-[#C95555]'
                              : status === 'LOW_STOCK'
                              ? 'bg-[#D08A35]'
                              : 'bg-[#3FA66B]'
                          }`}
                          style={{ width: `${ratio}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <LowStockBadge status={status} />
                  </td>

                  {/* Action */}
                  <td className="px-5 py-3.5 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation()
                        onSelect(item)
                      }}
                      className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-[#A1A1AA] transition-colors hover:text-[#F4F4F5] group-hover:text-[#C4622D] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C4622D] rounded px-1.5 py-0.5"
                    >
                      <span>View</span>
                      <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* 2. Mobile Responsive Compact Operational Cards */}
      <div className="md:hidden space-y-3">
        {items.map((item) => {
          const status = getStockStatus(item)
          const ratio = getStockRatio(item)

          return (
            <div
              key={item.id}
              onClick={() => onSelect(item)}
              className="rounded-lg border border-[#262630] bg-[#17171B] p-4 space-y-3 transition-colors active:bg-[#1C1C21]"
            >
              {/* Product & Status */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-display text-sm font-semibold text-[#F4F4F5]">
                    {item.productName}
                  </h3>
                  <p className="font-mono text-xs text-[#71717A]">
                    {item.sku}
                  </p>
                </div>
                <LowStockBadge status={status} />
              </div>

              {/* Warehouse Location */}
              <p className="text-xs text-[#A1A1AA]">
                {item.warehouseName}
              </p>

              {/* Available Units & Action */}
              <div className="flex items-center justify-between border-t border-[#202027] pt-2.5">
                <div className="space-y-1">
                  <span className="font-mono text-[10px] uppercase text-[#71717A]">
                    Available Stock
                  </span>
                  <div className="flex items-baseline gap-1 font-mono">
                    <span className="text-base font-bold text-[#F4F4F5]">
                      {formatQuantity(item.availableQuantity)}
                    </span>
                    <span className="text-xs text-[#71717A]">units</span>
                  </div>
                  <div className="w-24 h-1 rounded-full bg-[#202027] overflow-hidden">
                    <div
                      className={`h-full ${
                        status === 'OUT_OF_STOCK'
                          ? 'bg-[#C95555]'
                          : status === 'LOW_STOCK'
                          ? 'bg-[#D08A35]'
                          : 'bg-[#3FA66B]'
                      }`}
                      style={{ width: `${ratio}%` }}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    onSelect(item)
                  }}
                  className="inline-flex items-center gap-1 rounded border border-[#262630] bg-[#1C1C21] px-3 py-1.5 font-mono text-xs font-semibold text-[#F4F4F5] transition-colors hover:border-[#71717A] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C4622D]"
                >
                  <span>View</span>
                  <ArrowRight className="size-3" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
