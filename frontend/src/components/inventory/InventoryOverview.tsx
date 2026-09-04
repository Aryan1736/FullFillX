import type { InventoryStatus } from '../../types/dashboard'
import { formatQuantity } from '../../services/inventoryService'

type InventoryOverviewProps = {
  status?: InventoryStatus | null
  totalSkus: number
  isLoading?: boolean
}

export function InventoryOverview({
  status,
  totalSkus,
  isLoading = false,
}: InventoryOverviewProps) {
  const skusCount = status?.inventoryRecordCount ?? totalSkus
  const totalUnits = status?.totalQuantity ?? 0
  const lowStockCount = status?.lowStockCount ?? 0
  const outOfStockCount = status?.outOfStockCount ?? 0

  return (
    <section
      aria-label="Inventory Operational Overview"
      className="rounded-xl border border-[#262630] bg-[#17171B] shadow-2xs overflow-hidden"
    >
      <div className="flex items-center justify-between border-b border-[#202027] px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-[#C4622D]" aria-hidden="true" />
          <h2 className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[#71717A]">
            Inventory Overview
          </h2>
        </div>
        <span className="font-mono text-[10px] text-[#71717A]">
          Network Telemetry
        </span>
      </div>

      <div className="grid grid-cols-2 divide-y divide-[#202027] sm:grid-cols-4 sm:divide-y-0 sm:divide-x">
        {/* 1. TOTAL SKUs */}
        <div className="p-5">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#71717A]">
            Total SKUs
          </span>
          <p className="mt-2 font-display text-2xl font-bold tracking-tight text-[#F4F4F5] sm:text-3xl">
            {isLoading ? (
              <span className="inline-block h-8 w-16 animate-pulse rounded bg-[#262630]" />
            ) : (
              formatQuantity(skusCount)
            )}
          </p>
          <p className="mt-1 text-xs text-[#71717A]">Active catalog entries</p>
        </div>

        {/* 2. TOTAL UNITS */}
        <div className="p-5">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#71717A]">
            Total Units
          </span>
          <p className="mt-2 font-display text-2xl font-bold tracking-tight text-[#F4F4F5] sm:text-3xl">
            {isLoading ? (
              <span className="inline-block h-8 w-24 animate-pulse rounded bg-[#262630]" />
            ) : (
              formatQuantity(totalUnits)
            )}
          </p>
          <p className="mt-1 text-xs text-[#71717A]">Aggregated network stock</p>
        </div>

        {/* 3. LOW STOCK */}
        <div className="p-5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#71717A]">
              Low Stock
            </span>
            {lowStockCount > 0 && !isLoading && (
              <span className="inline-flex size-2 rounded-full bg-[#D08A35]" aria-hidden="true" />
            )}
          </div>
          <p className="mt-2 font-display text-2xl font-bold tracking-tight text-[#D08A35] sm:text-3xl">
            {isLoading ? (
              <span className="inline-block h-8 w-14 animate-pulse rounded bg-[#262630]" />
            ) : (
              formatQuantity(lowStockCount)
            )}
          </p>
          <p className="mt-1 text-xs text-[#71717A]">Approaching depletion threshold</p>
        </div>

        {/* 4. OUT OF STOCK */}
        <div className="p-5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#71717A]">
              Out of Stock
            </span>
            {outOfStockCount > 0 && !isLoading && (
              <span className="inline-flex size-2 rounded-full bg-[#C95555]" aria-hidden="true" />
            )}
          </div>
          <p className="mt-2 font-display text-2xl font-bold tracking-tight text-[#C95555] sm:text-3xl">
            {isLoading ? (
              <span className="inline-block h-8 w-14 animate-pulse rounded bg-[#262630]" />
            ) : (
              formatQuantity(outOfStockCount)
            )}
          </p>
          <p className="mt-1 text-xs text-[#71717A]">Zero available fulfillment units</p>
        </div>
      </div>
    </section>
  )
}
