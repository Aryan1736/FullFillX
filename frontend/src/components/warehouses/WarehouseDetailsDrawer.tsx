import {
  AlertCircle,
  ArrowRight,
  Compass,
  Loader2,
  MapPin,
  Pencil,
  Trash2,
  X,
} from 'lucide-react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'

import { useWarehouse } from '../../hooks/useWarehouses'
import { useDrawerA11y } from '../../hooks/useDrawerA11y'
import { paths } from '../../routes/paths'
import type { Warehouse } from '../../types/warehouse'
import {
  calculateUtilization,
  formatCompactNumber,
  formatCoordinate,
  formatDateTime,
  formatUtilization,
  getUtilizationSemantic,
} from '../../services/warehouseService'
import {
  WarehouseStatusBadge,
  WarehouseUtilizationBar,
} from './WarehouseTable'

type WarehouseDetailsDrawerProps = {
  warehouseId: string | null
  preview?: Warehouse | null
  isOpen: boolean
  onClose: () => void
  onEdit?: (warehouse: Warehouse) => void
  onDelete?: (warehouse: Warehouse) => void
}

export function WarehouseDetailsDrawer({
  warehouseId,
  preview,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: WarehouseDetailsDrawerProps) {
  const { data: warehouse, isLoading, isError } = useWarehouse(isOpen ? warehouseId : null)
  const details = warehouse ?? preview

  const drawerRef = useRef<HTMLElement>(null)
  useDrawerA11y({ isOpen, onClose, containerRef: drawerRef })

  if (!isOpen) {
    return null
  }

  const utilization = details ? calculateUtilization(details) : 0
  const semantic = getUtilizationSemantic(utilization)

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close warehouse details"
        className="absolute inset-0 bg-[#0E0E10]/80 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Surface */}
      <aside
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="warehouse-details-title"
        className="relative flex h-full w-full max-w-md flex-col border-l border-[#262630] bg-[#17171B] shadow-2xl text-[#F4F4F5]"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#202027] bg-[#141417] px-6 py-4">
          <div className="min-w-0 pr-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#71717A]">
                WAREHOUSE PROFILE
              </span>
              <span className="text-[#262630]" aria-hidden="true">|</span>
              <span className="font-mono text-[10px] text-[#A1A1AA]">
                ID: {details?.id.slice(0, 8) ?? '...'}
              </span>
            </div>
            <h2 id="warehouse-details-title" className="mt-1 truncate font-display text-lg font-bold text-[#F4F4F5]">
              {details?.name ?? 'Loading facility...'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-[#71717A] transition-colors hover:bg-[#202027] hover:text-[#F4F4F5] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C4622D]"
            aria-label="Close drawer"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {isLoading && !details ? (
            <div className="flex h-48 flex-col items-center justify-center gap-2 text-[#71717A]">
              <Loader2 className="size-6 animate-spin text-[#C4622D]" aria-hidden="true" />
              <span className="font-mono text-xs">Loading facility telemetry...</span>
            </div>
          ) : null}

          {isError && !details ? (
            <div className="rounded-xl border border-[#C95555]/30 bg-[#C95555]/10 p-4 text-xs text-[#C95555]">
              <div className="flex items-center gap-2 font-semibold">
                <AlertCircle className="size-4" aria-hidden="true" />
                Unable to load warehouse details
              </div>
              <p className="mt-1 text-[#A1A1AA]">Please verify connectivity and retry.</p>
            </div>
          ) : null}

          {details ? (
            <div className="space-y-6">
              {/* Status & Identity Bar */}
              <div className="flex items-center justify-between border-b border-[#202027] pb-4">
                <WarehouseStatusBadge active={details.active} />
                <span className="font-mono text-xs text-[#71717A]">
                  Full ID: <span className="text-[#A1A1AA]">{details.id}</span>
                </span>
              </div>

              {/* LOCATION SECTION */}
              <section aria-label="Facility Location" className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#71717A]">
                    LOCATION
                  </h3>
                  <Link
                    to={paths.warehouseMap}
                    className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-[#C4622D] hover:text-[#9E4A20] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C4622D]"
                  >
                    <span>Open in Network Map</span>
                    <ArrowRight className="size-3" />
                  </Link>
                </div>

                <div className="rounded-lg border border-[#262630] bg-[#141417] p-3.5 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4 text-[#C4622D]" aria-hidden="true" />
                    <span className="font-display text-sm font-semibold text-[#F4F4F5]">
                      {details.city} Regional Hub
                    </span>
                  </div>

                  <div className="flex items-center gap-4 font-mono text-xs text-[#71717A] border-t border-[#202027] pt-2">
                    <span className="flex items-center gap-1">
                      <Compass className="size-3 text-[#71717A]" />
                      Lat: <span className="text-[#A1A1AA]">{formatCoordinate(details.latitude)}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      Lon: <span className="text-[#A1A1AA]">{formatCoordinate(details.longitude)}</span>
                    </span>
                  </div>
                </div>
              </section>

              {/* CAPACITY SECTION */}
              <section aria-label="Facility Capacity" className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#71717A]">
                    CAPACITY
                  </h3>
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

                <div className="rounded-lg border border-[#262630] bg-[#141417] p-4 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono text-xs text-[#71717A]">Utilization</span>
                    <span
                      className="font-mono text-lg font-bold"
                      style={{ color: semantic.color }}
                    >
                      {formatUtilization(utilization)}
                    </span>
                  </div>

                  <WarehouseUtilizationBar value={utilization} />

                  <div className="grid grid-cols-2 gap-3 border-t border-[#202027] pt-3 text-xs">
                    <div>
                      <span className="font-mono text-[10px] text-[#71717A] uppercase">Current Load</span>
                      <p className="mt-0.5 font-mono text-sm font-semibold text-[#F4F4F5]">
                        {formatCompactNumber(details.currentLoad)}{' '}
                        <span className="text-xs text-[#71717A] font-normal">units</span>
                      </p>
                    </div>
                    <div>
                      <span className="font-mono text-[10px] text-[#71717A] uppercase">Maximum Capacity</span>
                      <p className="mt-0.5 font-mono text-sm font-semibold text-[#A1A1AA]">
                        {formatCompactNumber(details.capacity)}{' '}
                        <span className="text-xs text-[#71717A] font-normal">units</span>
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* OPERATING STATE SECTION */}
              <section aria-label="Operating State" className="space-y-3">
                <h3 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#71717A]">
                  OPERATING STATE
                </h3>

                <div className="rounded-lg border border-[#262630] bg-[#141417] divide-y divide-[#202027] text-xs">
                  <div className="flex items-center justify-between p-3">
                    <span className="text-[#71717A]">Routing Status</span>
                    <span className="font-mono font-semibold text-[#F4F4F5]">
                      {details.active ? 'Accepting Allocations' : 'Offline / Maintenance'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3">
                    <span className="text-[#71717A]">Available Headroom</span>
                    <span className="font-mono font-semibold text-[#F4F4F5]">
                      {formatCompactNumber(Math.max(0, details.capacity - details.currentLoad))} units
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3">
                    <span className="text-[#71717A]">Registered</span>
                    <span className="font-mono text-[#A1A1AA]">
                      {formatDateTime(details.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3">
                    <span className="text-[#71717A]">Last Telemetry Sync</span>
                    <span className="font-mono text-[#A1A1AA]">
                      {formatDateTime(details.updatedAt)}
                    </span>
                  </div>
                </div>
              </section>
            </div>
          ) : null}
        </div>

        {/* Footer Actions */}
        {details && (onEdit || onDelete) ? (
          <div className="flex items-center gap-3 border-t border-[#202027] bg-[#141417] px-6 py-4">
            {onEdit ? (
              <button
                type="button"
                onClick={() => {
                  onClose()
                  onEdit(details)
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded border border-[#262630] bg-[#1C1C21] px-4 py-2 font-mono text-xs font-semibold text-[#F4F4F5] transition-colors hover:border-[#71717A] hover:bg-[#262630] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C4622D]"
              >
                <Pencil className="size-3.5 text-[#71717A]" />
                <span>Edit Hub</span>
              </button>
            ) : null}
            {onDelete ? (
              <button
                type="button"
                onClick={() => {
                  onClose()
                  onDelete(details)
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded border border-[#C95555]/30 bg-[#C95555]/10 px-4 py-2 font-mono text-xs font-semibold text-[#C95555] transition-colors hover:border-[#C95555] hover:bg-[#C95555]/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C95555]"
              >
                <Trash2 className="size-3.5" />
                <span>Delete Hub</span>
              </button>
            ) : null}
          </div>
        ) : null}
      </aside>
    </div>
  )
}
