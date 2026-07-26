import { AlertCircle, History, Loader2, Package, Split, Target } from 'lucide-react'

import {
  formatAllocationCurrency,
  formatAllocationDate,
  formatAllocationScore,
  formatShortId,
  isSplitShipment,
} from '../../../services/allocationService'
import type { Allocation } from '../../../types/allocation'
import type { WarehouseMapLocation } from '../../../types/warehouseMap'
import { cn } from '../../../utils/cn'

type WarehouseAllocationsPanelProps = {
  selectedLocation: WarehouseMapLocation | null
  allocations: Allocation[]
  isLoading: boolean
  isError: boolean
  relatedWarehouseCount: number
  onSelectAllocation?: (allocation: Allocation) => void
}

function AllocationListItem({
  allocation,
  onSelect,
}: {
  allocation: Allocation
  onSelect?: (allocation: Allocation) => void
}) {
  const split = isSplitShipment(allocation)

  return (
    <button
      type="button"
      onClick={() => onSelect?.(allocation)}
      className="w-full rounded-lg border border-slate-200 bg-white p-3 text-left transition-colors hover:border-slate-300 hover:bg-slate-50"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-slate-900">
            Order {formatShortId(allocation.orderId)}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">{formatAllocationDate(allocation.createdAt)}</p>
        </div>
        {split ? (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700">
            <Split className="size-3" aria-hidden="true" />
            Split
          </span>
        ) : null}
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div>
          <dt className="text-slate-500">Score</dt>
          <dd className="font-medium text-slate-900">{formatAllocationScore(allocation.score)}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Shipping</dt>
          <dd className="font-medium text-slate-900">
            {formatAllocationCurrency(allocation.shippingCost)}
          </dd>
        </div>
      </dl>
    </button>
  )
}

export function WarehouseAllocationsPanel({
  selectedLocation,
  allocations,
  isLoading,
  isError,
  relatedWarehouseCount,
  onSelectAllocation,
}: WarehouseAllocationsPanelProps) {
  if (!selectedLocation) {
    return (
      <div className="flex h-full min-h-[240px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
        <Package className="size-8 text-slate-400" aria-hidden="true" />
        <p className="mt-3 text-sm font-medium text-slate-700">Select a warehouse</p>
        <p className="mt-1 text-sm text-slate-500">
          Click a marker to view related allocations and highlight partner warehouses.
        </p>
      </div>
    )
  }

  return (
    <div className="flex h-full min-h-[240px] flex-col rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-4 py-3">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Selected warehouse</p>
        <h2 className="mt-1 text-base font-semibold text-slate-900">{selectedLocation.name}</h2>
        <p className="mt-1 text-sm text-slate-500">{selectedLocation.city}</p>
        {relatedWarehouseCount > 0 ? (
          <p className="mt-2 text-xs text-violet-700">
            {relatedWarehouseCount} related warehouse{relatedWarehouseCount === 1 ? '' : 's'} highlighted on map
          </p>
        ) : null}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex h-32 items-center justify-center text-slate-500">
            <Loader2 className="size-6 animate-spin" aria-hidden="true" />
          </div>
        ) : null}

        {isError ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <div className="flex items-center gap-2 font-medium text-red-900">
              <AlertCircle className="size-4" aria-hidden="true" />
              Unable to load allocations
            </div>
          </div>
        ) : null}

        {!isLoading && !isError && allocations.length === 0 ? (
          <div className="flex h-32 flex-col items-center justify-center text-center">
            <History className="size-6 text-slate-400" aria-hidden="true" />
            <p className="mt-2 text-sm text-slate-600">No allocations for this warehouse yet.</p>
          </div>
        ) : null}

        {!isLoading && !isError && allocations.length > 0 ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
              <Target className="size-3.5" aria-hidden="true" />
              Related allocations ({allocations.length})
            </div>
            {allocations.map((allocation) => (
              <AllocationListItem
                key={allocation.id}
                allocation={allocation}
                onSelect={onSelectAllocation}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export function WarehouseMapLegend() {
  return (
    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
      <span className="inline-flex items-center gap-1.5">
        <span className="size-3 rounded-full bg-emerald-500" aria-hidden="true" />
        Low utilization
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="size-3 rounded-full bg-amber-500" aria-hidden="true" />
        Medium
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="size-3 rounded-full bg-red-500" aria-hidden="true" />
        High
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="size-3 rounded-full bg-blue-600 ring-2 ring-blue-200" aria-hidden="true" />
        Selected
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className={cn('size-3 rounded-full bg-violet-500 ring-2 ring-violet-200')} aria-hidden="true" />
        Related allocation
      </span>
    </div>
  )
}
