import {
  AlertCircle,
  Clock,
  History,
  IndianRupee,
  Loader2,
  MapPin,
  Split,
  Target,
  Warehouse,
} from 'lucide-react'

import {
  formatAllocationCurrency,
  formatAllocationDate,
  formatAllocationScore,
  formatShortId,
  isSplitShipment,
} from '../../../services/allocationService'
import type { Allocation } from '../../../types/allocation'
import type { WarehouseMapLocation } from '../../../types/warehouseMap'
import { ProgressBar } from '../../common/ProgressBar'

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
      className="group w-full rounded-lg border border-[#262630] bg-[#1C1C21] p-3.5 text-left transition-all duration-200 hover:border-[#C4622D]/60 hover:bg-[#202027] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C4622D]"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold text-[#F4F4F5] group-hover:text-[#C4622D] transition-colors">
              ORD-{formatShortId(allocation.orderId)}
            </span>
            {split ? (
              <span className="inline-flex items-center gap-1 rounded border border-[#262630] bg-[#17171B] px-1.5 py-0.2 font-mono text-[10px] font-semibold text-[#A1A1AA]">
                <Split className="size-2.5 text-[#C4622D]" />
                Split Hub
              </span>
            ) : null}
          </div>
          <p className="mt-1 flex items-center gap-1 font-mono text-[11px] text-[#71717A]">
            <Clock className="size-3 text-[#71717A]" />
            {formatAllocationDate(allocation.createdAt)}
          </p>
        </div>

        <div className="text-right">
          <span className="inline-flex items-center rounded border border-[#262630] bg-[#17171B] px-2 py-0.5 font-mono text-xs font-semibold text-[#3FA66B]">
            Score: {formatAllocationScore(allocation.score)}
          </span>
        </div>
      </div>

      <div className="mt-2.5 flex items-center justify-between border-t border-[#202027] pt-2 text-xs">
        <span className="font-mono text-[11px] text-[#71717A]">Shipping Freight</span>
        <span className="flex items-center gap-0.5 font-mono font-semibold text-[#F4F4F5]">
          <IndianRupee className="size-3 text-[#71717A]" />
          {formatAllocationCurrency(allocation.shippingCost).replace('₹', '')}
        </span>
      </div>
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
      <div className="flex h-full min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-[#262630] bg-[#17171B] p-6 text-center shadow-xl">
        <div className="flex size-12 items-center justify-center rounded-xl border border-[#262630] bg-[#1C1C21] text-[#C4622D]">
          <Warehouse className="size-6" aria-hidden="true" />
        </div>
        <p className="mt-3 font-display text-sm font-bold text-[#F4F4F5]">Select a Warehouse Node</p>
        <p className="mt-1 max-w-xs text-xs text-[#A1A1AA] leading-relaxed">
          Click any geographical marker to inspect live capacity, regional coordinates, and linked order fulfillment dispatches.
        </p>
      </div>
    )
  }

  return (
    <div className="flex h-full min-h-[300px] flex-col rounded-xl border border-[#262630] bg-[#17171B] shadow-xl">
      <div className="border-b border-[#202027] bg-[#141417] p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-[#C4622D]">
              Selected Facility Node
            </span>
            <h2 className="mt-0.5 font-display text-base font-bold text-[#F4F4F5]">{selectedLocation.name}</h2>
            <p className="flex items-center gap-1 mt-1 font-mono text-xs text-[#A1A1AA]">
              <MapPin className="size-3 text-[#71717A]" />
              {selectedLocation.city} Hub (Lat {selectedLocation.latitude.toFixed(2)}, Lon {selectedLocation.longitude.toFixed(2)})
            </p>
          </div>
          <span className="font-mono text-xs font-bold text-[#F4F4F5] bg-[#1C1C21] px-2.5 py-1 rounded border border-[#262630]">
            {selectedLocation.utilization.toFixed(1)}% Load
          </span>
        </div>

        <div className="mt-3">
          <ProgressBar value={selectedLocation.utilization} size="sm" />
        </div>

        {relatedWarehouseCount > 0 ? (
          <p className="mt-2.5 inline-flex items-center gap-1.5 rounded border border-[#262630] bg-[#1C1C21] px-2 py-0.5 font-mono text-[11px] text-[#A1A1AA]">
            <Split className="size-3 text-[#C4622D]" />
            {relatedWarehouseCount} partner warehouse{relatedWarehouseCount === 1 ? '' : 's'} linked in multi-hub split orders
          </p>
        ) : null}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isLoading ? (
          <div className="flex h-40 items-center justify-center text-[#71717A]">
            <Loader2 className="size-6 animate-spin text-[#C4622D]" aria-hidden="true" />
          </div>
        ) : null}

        {isError ? (
          <div className="rounded-lg border border-[#C95555]/30 bg-[#C95555]/10 p-4 text-xs text-[#C95555]">
            <div className="flex items-center gap-2 font-semibold">
              <AlertCircle className="size-4" aria-hidden="true" />
              Unable to load linked allocations
            </div>
          </div>
        ) : null}

        {!isLoading && !isError && allocations.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center text-center">
            <History className="size-6 text-[#71717A]" aria-hidden="true" />
            <p className="mt-2 font-mono text-xs text-[#71717A]">
              No recent fulfillment allocations for this hub.
            </p>
          </div>
        ) : null}

        {!isLoading && !isError && allocations.length > 0 ? (
          <>
            <div className="flex items-center justify-between text-[11px] font-mono font-semibold uppercase tracking-wider text-[#71717A]">
              <span className="flex items-center gap-1.5">
                <Target className="size-3.5 text-[#71717A]" />
                Allocated Shipments
              </span>
              <span className="font-mono text-[#A1A1AA]">{allocations.length} records</span>
            </div>
            <div className="space-y-2.5">
              {allocations.map((allocation) => (
                <AllocationListItem
                  key={allocation.id}
                  allocation={allocation}
                  onSelect={onSelectAllocation}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}

export function WarehouseMapLegend() {
  return (
    <div className="flex flex-wrap items-center gap-2.5 rounded-lg border border-[#262630] bg-[#17171B] px-3 py-1.5 text-xs text-[#A1A1AA] shadow-xs">
      <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#71717A] mr-1">
        Legend:
      </span>
      <span className="inline-flex items-center gap-1.5 font-mono text-[11px]">
        <span className="size-2 rounded-full bg-[#3FA66B]" aria-hidden="true" />
        Low (&lt;65%)
      </span>
      <span className="inline-flex items-center gap-1.5 font-mono text-[11px]">
        <span className="size-2 rounded-full bg-[#D08A35]" aria-hidden="true" />
        Medium (65-85%)
      </span>
      <span className="inline-flex items-center gap-1.5 font-mono text-[11px]">
        <span className="size-2 rounded-full bg-[#C95555]" aria-hidden="true" />
        High (&gt;85%)
      </span>
      <span className="inline-flex items-center gap-1.5 font-mono text-[11px]">
        <span className="size-2 rounded-full bg-[#C4622D] ring-2 ring-[#C4622D]/30" aria-hidden="true" />
        Active Marker
      </span>
      <span className="inline-flex items-center gap-1.5 font-mono text-[11px]">
        <span className="size-2 rounded-full bg-[#71717A] ring-2 ring-[#71717A]/30" aria-hidden="true" />
        Split Partner
      </span>
    </div>
  )
}
