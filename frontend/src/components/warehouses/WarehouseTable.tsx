import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'

import type { Warehouse, WarehouseSort, WarehouseSortField } from '../../types/warehouse'
import {
  calculateUtilization,
  formatCompactNumber,
  formatUtilization,
  getStatusLabel,
  getUtilizationTone,
} from '../../services/warehouseService'
import { cn } from '../../utils/cn'

type WarehouseTableProps = {
  warehouses: Warehouse[]
  sort: WarehouseSort
  onSortChange: (field: WarehouseSortField) => void
  onViewDetails: (warehouse: Warehouse) => void
}

type SortableHeaderProps = {
  label: string
  field: WarehouseSortField
  sort: WarehouseSort
  onSortChange: (field: WarehouseSortField) => void
  className?: string
}

function SortableHeader({ label, field, sort, onSortChange, className }: SortableHeaderProps) {
  const isActive = sort.field === field
  const Icon = !isActive ? ArrowUpDown : sort.direction === 'asc' ? ArrowUp : ArrowDown

  return (
    <th scope="col" className={className}>
      <button
        type="button"
        onClick={() => onSortChange(field)}
        className="inline-flex items-center gap-1.5 text-left font-medium text-slate-600 transition-colors hover:text-slate-900"
      >
        {label}
        <Icon className={cn('size-3.5', isActive ? 'text-slate-900' : 'text-slate-400')} aria-hidden="true" />
      </button>
    </th>
  )
}

function UtilizationCell({ value }: { value: number }) {
  const tone = getUtilizationTone(value)

  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
        tone === 'high' && 'bg-red-100 text-red-700',
        tone === 'medium' && 'bg-amber-100 text-amber-700',
        tone === 'low' && 'bg-emerald-100 text-emerald-700',
      )}
    >
      {formatUtilization(value)}
    </span>
  )
}

function StatusCell({ active }: { active: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
        active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600',
      )}
    >
      {getStatusLabel(active)}
    </span>
  )
}

export function WarehouseTable({
  warehouses,
  sort,
  onSortChange,
  onViewDetails,
}: WarehouseTableProps) {
  return (
    <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:block">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <SortableHeader
                label="Name"
                field="name"
                sort={sort}
                onSortChange={onSortChange}
                className="px-4 py-3 text-left text-xs uppercase tracking-wide"
              />
              <SortableHeader
                label="City"
                field="city"
                sort={sort}
                onSortChange={onSortChange}
                className="px-4 py-3 text-left text-xs uppercase tracking-wide"
              />
              <SortableHeader
                label="Capacity"
                field="capacity"
                sort={sort}
                onSortChange={onSortChange}
                className="px-4 py-3 text-left text-xs uppercase tracking-wide"
              />
              <SortableHeader
                label="Current Load"
                field="currentLoad"
                sort={sort}
                onSortChange={onSortChange}
                className="px-4 py-3 text-left text-xs uppercase tracking-wide"
              />
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600"
              >
                Utilization %
              </th>
              <SortableHeader
                label="Active Status"
                field="active"
                sort={sort}
                onSortChange={onSortChange}
                className="px-4 py-3 text-left text-xs uppercase tracking-wide"
              />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {warehouses.map((warehouse) => {
              const utilization = calculateUtilization(warehouse)

              return (
                <tr
                  key={warehouse.id}
                  className="cursor-pointer transition-colors hover:bg-slate-50"
                  onClick={() => onViewDetails(warehouse)}
                >
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">{warehouse.name}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{warehouse.city}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {formatCompactNumber(warehouse.capacity)}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {formatCompactNumber(warehouse.currentLoad)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <UtilizationCell value={utilization} />
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <StatusCell active={warehouse.active} />
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
