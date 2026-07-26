import { AlertCircle, Loader2, MapPin, X } from 'lucide-react'
import { useRef } from 'react'

import { useWarehouse } from '../../hooks/useWarehouses'
import { useDrawerA11y } from '../../hooks/useDrawerA11y'
import type { Warehouse } from '../../types/warehouse'
import {
  calculateUtilization,
  formatCompactNumber,
  formatCoordinate,
  formatDateTime,
  formatUtilization,
  getStatusLabel,
  getUtilizationTone,
} from '../../services/warehouseService'
import { cn } from '../../utils/cn'
import { DetailRow } from '../common/DetailRow'

type WarehouseDetailsDrawerProps = {
  warehouseId: string | null
  preview?: Warehouse | null
  isOpen: boolean
  onClose: () => void
}

export function WarehouseDetailsDrawer({
  warehouseId,
  preview,
  isOpen,
  onClose,
}: WarehouseDetailsDrawerProps) {
  const { data: warehouse, isLoading, isError } = useWarehouse(isOpen ? warehouseId : null)
  const details = warehouse ?? preview

  const drawerRef = useRef<HTMLElement>(null)
  useDrawerA11y({ isOpen, onClose, containerRef: drawerRef })

  if (!isOpen) {
    return null
  }

  const utilization = details ? calculateUtilization(details) : 0
  const utilizationTone = getUtilizationTone(utilization)

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Close warehouse details"
        className="absolute inset-0 bg-slate-900/40"
        onClick={onClose}
      />

      <aside
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="warehouse-details-title"
        className="relative flex h-full w-full max-w-md flex-col bg-white shadow-xl"
      >
        <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
          <div className="min-w-0 pr-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Warehouse Details
            </p>
            <h2 id="warehouse-details-title" className="mt-1 truncate text-lg font-semibold text-slate-900">
              {details?.name ?? 'Loading warehouse'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close drawer"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {isLoading && !details ? (
            <div className="flex h-40 items-center justify-center text-slate-500">
              <Loader2 className="size-6 animate-spin" aria-hidden="true" />
            </div>
          ) : null}

          {isError && !details ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <div className="flex items-center gap-2 font-medium text-red-900">
                <AlertCircle className="size-4" aria-hidden="true" />
                Unable to load warehouse details
              </div>
            </div>
          ) : null}

          {details ? (
            <div className="space-y-6">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <MapPin className="size-4" aria-hidden="true" />
                  {details.city}
                </div>
                <p className="mt-2 text-sm text-slate-500">
                  {formatCoordinate(details.latitude)}, {formatCoordinate(details.longitude)}
                </p>
              </div>

              <dl>
                <DetailRow label="City" value={details.city} />
                <DetailRow label="Capacity" value={formatCompactNumber(details.capacity)} />
                <DetailRow label="Current Load" value={formatCompactNumber(details.currentLoad)} />
                <DetailRow label="Utilization" value={formatUtilization(utilization)} />
                <DetailRow label="Status" value={getStatusLabel(details.active)} />
                <DetailRow label="Created" value={formatDateTime(details.createdAt)} />
                <DetailRow label="Updated" value={formatDateTime(details.updatedAt)} />
              </dl>

              <div>
                <p className="text-sm font-medium text-slate-700">Capacity usage</p>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all',
                      utilizationTone === 'high' && 'bg-red-500',
                      utilizationTone === 'medium' && 'bg-amber-500',
                      utilizationTone === 'low' && 'bg-emerald-500',
                    )}
                    style={{ width: `${Math.min(utilization, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </aside>
    </div>
  )
}
