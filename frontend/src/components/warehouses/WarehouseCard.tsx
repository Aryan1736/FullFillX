import { ArrowRight, MapPin, Pencil, Trash2 } from 'lucide-react'

import type { Warehouse } from '../../types/warehouse'
import {
  calculateUtilization,
  formatCompactNumber,
  formatUtilization,
  getUtilizationSemantic,
} from '../../services/warehouseService'
import { handleRowKeyDown } from '../../utils/keyboard'
import {
  WarehouseStatusBadge,
  WarehouseUtilizationBar,
} from './WarehouseTable'

type WarehouseCardProps = {
  warehouse: Warehouse
  onViewDetails: (warehouse: Warehouse) => void
  onEdit: (warehouse: Warehouse) => void
  onDelete: (warehouse: Warehouse) => void
}

export function WarehouseCard({
  warehouse,
  onViewDetails,
  onEdit,
  onDelete,
}: WarehouseCardProps) {
  const utilization = calculateUtilization(warehouse)
  const semantic = getUtilizationSemantic(utilization)

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onViewDetails(warehouse)}
      onKeyDown={(event) => handleRowKeyDown(event, () => onViewDetails(warehouse))}
      aria-label={`View details for ${warehouse.name}`}
      className="group w-full cursor-pointer rounded-xl border border-[#262630] bg-[#17171B] p-4 text-left shadow-lg transition-colors hover:border-[#383844] hover:bg-[#1C1C21] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4622D]"
    >
      {/* 1. Header: Warehouse Name, City & Status */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-display text-base font-semibold text-[#F4F4F5] group-hover:text-[#C4622D] transition-colors">
            {warehouse.name}
          </h3>
          <p className="mt-0.5 flex items-center gap-1 font-mono text-xs text-[#A1A1AA]">
            <MapPin className="size-3 text-[#71717A]" aria-hidden="true" />
            <span>{warehouse.city}</span>
            <span className="text-[#262630]" aria-hidden="true">·</span>
            <span className="text-[#71717A]">ID: {warehouse.id.slice(0, 8)}</span>
          </p>
        </div>

        <WarehouseStatusBadge active={warehouse.active} />
      </div>

      {/* 2. Load & Capacity Metrics */}
      <div className="mt-3.5 grid grid-cols-2 gap-2 border-t border-[#202027] pt-3 text-xs">
        <div>
          <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#71717A]">
            Current Load
          </span>
          <p className="mt-0.5 font-mono text-sm font-semibold text-[#F4F4F5]">
            {formatCompactNumber(warehouse.currentLoad)}{' '}
            <span className="text-[11px] font-normal text-[#71717A]">units</span>
          </p>
        </div>

        <div>
          <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#71717A]">
            Capacity
          </span>
          <p className="mt-0.5 font-mono text-sm font-medium text-[#A1A1AA]">
            {formatCompactNumber(warehouse.capacity)}{' '}
            <span className="text-[11px] font-normal text-[#71717A]">units</span>
          </p>
        </div>
      </div>

      {/* 3. Utilization Indicator */}
      <div className="mt-3 space-y-1.5 border-t border-[#202027] pt-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-mono text-[10px] uppercase text-[#71717A]">Utilization</span>
          <div className="flex items-center gap-2">
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
            <span
              className="font-mono text-xs font-bold"
              style={{ color: semantic.color }}
            >
              {formatUtilization(utilization)}
            </span>
          </div>
        </div>

        <WarehouseUtilizationBar value={utilization} />
      </div>

      {/* 4. Action Buttons */}
      <div className="mt-4 flex items-center justify-between border-t border-[#202027] pt-3">
        <span className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-[#C4622D]">
          <span>View Hub</span>
          <ArrowRight className="size-3" />
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              onEdit(warehouse)
            }}
            className="inline-flex items-center gap-1 rounded border border-[#262630] bg-[#141417] px-2.5 py-1.5 font-mono text-xs font-medium text-[#A1A1AA] transition-colors hover:border-[#71717A] hover:text-[#F4F4F5] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C4622D]"
            aria-label={`Edit ${warehouse.name}`}
          >
            <Pencil className="size-3 text-[#71717A]" aria-hidden="true" />
            <span>Edit</span>
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              onDelete(warehouse)
            }}
            className="inline-flex items-center gap-1 rounded border border-[#262630] bg-[#141417] px-2.5 py-1.5 font-mono text-xs font-medium text-[#C95555] transition-colors hover:border-[#C95555] hover:bg-[#C95555]/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C95555]"
            aria-label={`Delete ${warehouse.name}`}
          >
            <Trash2 className="size-3 text-[#C95555]" aria-hidden="true" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  )
}
