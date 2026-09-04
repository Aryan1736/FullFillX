import { ArrowDown, ArrowUp, ArrowUpDown, ArrowRight, MapPin, Pencil, Trash2 } from 'lucide-react'

import {
  calculateUtilization,
  formatCompactNumber,
  formatUtilization,
  getUtilizationSemantic,
} from '../../services/warehouseService'
import type { Warehouse, WarehouseSort, WarehouseSortField } from '../../types/warehouse'
import { handleRowKeyDown } from '../../utils/keyboard'
import { cn } from '../../utils/cn'

type WarehouseTableProps = {
  warehouses: Warehouse[]
  sort: WarehouseSort
  onSortChange: (field: WarehouseSortField) => void
  onViewDetails: (warehouse: Warehouse) => void
  onEdit: (warehouse: Warehouse) => void
  onDelete: (warehouse: Warehouse) => void
}

export function WarehouseUtilizationBar({ value }: { value: number }) {
  const clamped = Math.min(Math.max(value, 0), 100)
  const semantic = getUtilizationSemantic(value)

  return (
    <div className="h-1 w-full overflow-hidden rounded-full bg-[#262630]">
      <div
        className="h-full rounded-full transition-all duration-300"
        style={{
          width: `${clamped}%`,
          backgroundColor: semantic.color,
        }}
        role="progressbar"
        aria-valuenow={Math.round(clamped)}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  )
}

export function WarehouseStatusBadge({ active }: { active: boolean }) {
  if (active) {
    return (
      <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold text-[#3FA66B]">
        <span className="size-1.5 rounded-full bg-[#3FA66B]" aria-hidden="true" />
        ACTIVE
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-medium text-[#71717A]">
      <span className="size-1.5 rounded-full bg-[#71717A]" aria-hidden="true" />
      INACTIVE
    </span>
  )
}

function SortButton({
  label,
  field,
  sort,
  onSortChange,
  align = 'left',
}: {
  label: string
  field: WarehouseSortField
  sort: WarehouseSort
  onSortChange: (field: WarehouseSortField) => void
  align?: 'left' | 'right'
}) {
  const isActive = sort.field === field
  const Icon = !isActive ? ArrowUpDown : sort.direction === 'asc' ? ArrowUp : ArrowDown

  return (
    <button
      type="button"
      onClick={() => onSortChange(field)}
      className={cn(
        'inline-flex items-center gap-1 font-mono text-[11px] font-semibold uppercase tracking-wider transition-colors hover:text-[#F4F4F5] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C4622D] rounded px-1 py-0.5',
        isActive ? 'text-[#C4622D]' : 'text-[#71717A]',
        align === 'right' && 'flex-row-reverse',
      )}
      aria-label={`Sort by ${label}, ${isActive ? sort.direction : 'not sorted'}`}
    >
      <span>{label}</span>
      <Icon className={cn('size-3', isActive ? 'text-[#C4622D]' : 'text-[#71717A]')} aria-hidden="true" />
    </button>
  )
}

export function WarehouseTable({
  warehouses,
  sort,
  onSortChange,
  onViewDetails,
  onEdit,
  onDelete,
}: WarehouseTableProps) {
  return (
    <div className="hidden overflow-hidden rounded-xl border border-[#262630] bg-[#17171B] shadow-xl md:block">
      {/* Table Section Header */}
      <div className="border-b border-[#202027] bg-[#141417] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#71717A]">
            FACILITY ROSTER
          </span>
          <span className="text-[#262630]" aria-hidden="true">|</span>
          <h2 className="font-display text-base font-bold tracking-tight text-[#F4F4F5]">
            WAREHOUSE NETWORK
          </h2>
        </div>
        <span className="font-mono text-xs text-[#71717A]">
          {warehouses.length} {warehouses.length === 1 ? 'node' : 'nodes'} listed
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#202027] bg-[#141417]/80">
              <th scope="col" className="py-3 pl-6 pr-4">
                <SortButton label="Warehouse" field="name" sort={sort} onSortChange={onSortChange} />
              </th>
              <th scope="col" className="px-4 py-3">
                <SortButton label="Location" field="city" sort={sort} onSortChange={onSortChange} />
              </th>
              <th scope="col" className="px-4 py-3">
                <SortButton label="Status" field="active" sort={sort} onSortChange={onSortChange} />
              </th>
              <th scope="col" className="px-4 py-3 text-right">
                <SortButton label="Load" field="currentLoad" sort={sort} onSortChange={onSortChange} align="right" />
              </th>
              <th scope="col" className="px-4 py-3 text-right">
                <SortButton label="Capacity" field="capacity" sort={sort} onSortChange={onSortChange} align="right" />
              </th>
              <th scope="col" className="w-56 px-4 py-3">
                <SortButton label="Utilization" field="utilization" sort={sort} onSortChange={onSortChange} />
              </th>
              <th
                scope="col"
                className="w-28 py-3 pl-4 pr-6 text-right font-mono text-[11px] font-semibold uppercase tracking-wider text-[#71717A]"
              >
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#202027]">
            {warehouses.map((warehouse) => {
              const utilization = calculateUtilization(warehouse)
              const semantic = getUtilizationSemantic(utilization)

              return (
                <tr
                  key={warehouse.id}
                  tabIndex={0}
                  role="button"
                  aria-label={`View details for ${warehouse.name}`}
                  onClick={() => onViewDetails(warehouse)}
                  onKeyDown={(event) => handleRowKeyDown(event, () => onViewDetails(warehouse))}
                  className="group cursor-pointer transition-colors duration-250 ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-[#1C1C21] focus-visible:bg-[#1C1C21] focus-visible:outline-none"
                >
                  {/* Warehouse Name & ID */}
                  <td className="whitespace-nowrap py-4 pl-6 pr-4">
                    <div>
                      <span className="font-display font-medium text-[#F4F4F5] group-hover:text-[#C4622D] transition-colors">
                        {warehouse.name}
                      </span>
                      <p className="font-mono text-[10px] text-[#71717A]">
                        ID: {warehouse.id.slice(0, 8)}
                      </p>
                    </div>
                  </td>

                  {/* Location / City */}
                  <td className="whitespace-nowrap px-4 py-4">
                    <span className="inline-flex items-center gap-1.5 text-xs text-[#A1A1AA]">
                      <MapPin className="size-3.5 text-[#71717A]" aria-hidden="true" />
                      {warehouse.city}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="whitespace-nowrap px-4 py-4">
                    <WarehouseStatusBadge active={warehouse.active} />
                  </td>

                  {/* Current Load */}
                  <td className="whitespace-nowrap px-4 py-4 text-right">
                    <span className="font-mono text-sm font-semibold text-[#F4F4F5]">
                      {formatCompactNumber(warehouse.currentLoad)}
                    </span>{' '}
                    <span className="font-mono text-[11px] text-[#71717A]">units</span>
                  </td>

                  {/* Capacity */}
                  <td className="whitespace-nowrap px-4 py-4 text-right">
                    <span className="font-mono text-sm font-medium text-[#A1A1AA]">
                      {formatCompactNumber(warehouse.capacity)}
                    </span>{' '}
                    <span className="font-mono text-[11px] text-[#71717A]">units</span>
                  </td>

                  {/* Utilization Percentage, Badge & Bar */}
                  <td className="whitespace-nowrap px-4 py-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span
                          className="font-mono font-bold"
                          style={{ color: semantic.color }}
                        >
                          {formatUtilization(utilization)}
                        </span>

                        <span
                          className="inline-flex items-center rounded px-1.5 py-0.2 font-mono text-[9px] font-bold uppercase tracking-wider"
                          style={{
                            color: semantic.color,
                            backgroundColor: semantic.bg,
                            border: `1px solid ${semantic.border}`,
                          }}
                        >
                          {semantic.label}
                        </span>
                      </div>

                      <WarehouseUtilizationBar value={utilization} />
                    </div>
                  </td>

                  {/* Actions: View, Edit, Delete */}
                  <td className="whitespace-nowrap py-4 pl-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* View Action Link */}
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation()
                          onViewDetails(warehouse)
                        }}
                        className="inline-flex items-center gap-0.5 rounded px-2 py-1 font-mono text-xs font-semibold text-[#C4622D] transition-colors hover:text-[#9E4A20] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C4622D]"
                        title="View details"
                        aria-label={`View details for ${warehouse.name}`}
                      >
                        <span>View</span>
                        <ArrowRight className="size-3 transition-transform duration-250 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-x-0.5" />
                      </button>

                      {/* Edit Button */}
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation()
                          onEdit(warehouse)
                        }}
                        className="rounded p-1.5 text-[#71717A] transition-colors hover:bg-[#262630] hover:text-[#F4F4F5] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C4622D]"
                        title="Edit warehouse"
                        aria-label={`Edit ${warehouse.name}`}
                      >
                        <Pencil className="size-3.5" aria-hidden="true" />
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation()
                          onDelete(warehouse)
                        }}
                        className="rounded p-1.5 text-[#71717A] transition-colors hover:bg-[#C95555]/15 hover:text-[#C95555] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C95555]"
                        title="Delete warehouse"
                        aria-label={`Delete ${warehouse.name}`}
                      >
                        <Trash2 className="size-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
