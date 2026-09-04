import { formatAllocationCurrency } from '../../services/allocationService'
import type { Allocation } from '../../types/allocation'

type AllocationOverviewProps = {
  allocations: Allocation[]
  totalElements?: number
  isLoading?: boolean
}

export function AllocationOverview({
  allocations,
  totalElements = 0,
  isLoading = false,
}: AllocationOverviewProps) {
  const totalAllocations = totalElements || allocations.length
  const totalUnits = allocations.reduce((sum, a) => {
    return sum + a.products.reduce((pSum, p) => pSum + p.quantity, 0)
  }, 0)
  const totalFreight = allocations.reduce((sum, a) => sum + (Number(a.shippingCost) || 0), 0)
  const avgEta = allocations.length > 0
    ? (allocations.reduce((sum, a) => sum + (Number(a.eta) || 0), 0) / allocations.length).toFixed(1)
    : '0'
  const splitShipmentCount = allocations.filter((a) => a.warehouses.length > 1).length

  return (
    <section
      aria-label="Allocation Overview"
      className="rounded-xl border border-[#262630] bg-[#17171B] p-5 lg:p-6 shadow-xl"
    >
      <div className="flex items-center justify-between pb-4 border-b border-[#202027]">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#71717A]">
            OPERATIONAL AUDIT
          </span>
          <span className="text-[#262630]" aria-hidden="true">|</span>
          <span className="font-mono text-[11px] font-medium text-[#A1A1AA]">
            ALLOCATION OVERVIEW
          </span>
        </div>

        <div className="flex items-center gap-1.5 rounded-full border border-[#3FA66B]/30 bg-[#3FA66B]/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-[#3FA66B]">
          <span className="size-1.5 rounded-full bg-[#3FA66B]" aria-hidden="true" />
          <span>NETWORK DECISIONS COMMITTED</span>
        </div>
      </div>

      {/* Unified Metrics Strip with Subtle Vertical Dividers */}
      <div className="grid grid-cols-2 gap-y-6 pt-5 sm:grid-cols-3 lg:grid-cols-6 lg:divide-x lg:divide-[#202027]">
        {/* TOTAL ALLOCATIONS */}
        <div className="px-2 sm:px-4">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-wider text-[#71717A]">
            Total Allocations
          </p>
          <p className="mt-2 font-display text-2xl font-bold tracking-tight text-[#F4F4F5] sm:text-3xl">
            {isLoading ? <span className="animate-pulse text-[#71717A]">--</span> : totalAllocations}
          </p>
          <p className="mt-1 font-mono text-[10px] text-[#71717A]">Committed records</p>
        </div>

        {/* ACTIVE / COMMITTED */}
        <div className="px-2 sm:px-4">
          <div className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-[#3FA66B]" aria-hidden="true" />
            <p className="font-sans text-[11px] font-semibold uppercase tracking-wider text-[#3FA66B]">
              Committed
            </p>
          </div>
          <p className="mt-2 font-display text-2xl font-bold tracking-tight text-[#3FA66B] sm:text-3xl">
            {isLoading ? <span className="animate-pulse text-[#71717A]">--</span> : totalAllocations}
          </p>
          <p className="mt-1 font-mono text-[10px] text-[#A1A1AA]">100% locked</p>
        </div>

        {/* TOTAL UNITS */}
        <div className="px-2 sm:px-4">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-wider text-[#71717A]">
            Total Units
          </p>
          <p className="mt-2 font-display text-2xl font-bold tracking-tight text-[#F4F4F5] sm:text-3xl">
            {isLoading ? <span className="animate-pulse text-[#71717A]">--</span> : totalUnits}
          </p>
          <p className="mt-1 font-mono text-[10px] text-[#71717A]">Committed stock</p>
        </div>

        {/* TOTAL FREIGHT */}
        <div className="px-2 sm:px-4">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-wider text-[#71717A]">
            Total Freight
          </p>
          <p className="mt-2 font-display text-2xl font-bold tracking-tight text-[#F4F4F5] sm:text-3xl">
            {isLoading ? (
              <span className="animate-pulse text-[#71717A]">--</span>
            ) : (
              formatAllocationCurrency(totalFreight)
            )}
          </p>
          <p className="mt-1 font-mono text-[10px] text-[#71717A]">Landed logistics</p>
        </div>

        {/* AVG TRANSIT ETA */}
        <div className="px-2 sm:px-4">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-wider text-[#71717A]">
            Avg Transit ETA
          </p>
          <p className="mt-2 font-display text-2xl font-bold tracking-tight text-[#F4F4F5] sm:text-3xl">
            {isLoading ? <span className="animate-pulse text-[#71717A]">--</span> : `${avgEta}h`}
          </p>
          <p className="mt-1 font-mono text-[10px] text-[#71717A]">Door dispatch</p>
        </div>

        {/* SPLIT SHIPMENTS */}
        <div className="px-2 sm:px-4">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-wider text-[#71717A]">
            Multi-Hub Splits
          </p>
          <p className="mt-2 font-display text-2xl font-bold tracking-tight text-[#F4F4F5] sm:text-3xl">
            {isLoading ? <span className="animate-pulse text-[#71717A]">--</span> : splitShipmentCount}
          </p>
          <p className="mt-1 font-mono text-[10px] text-[#71717A]">Multi-facility legs</p>
        </div>
      </div>
    </section>
  )
}
