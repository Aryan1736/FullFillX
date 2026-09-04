import { AlertTriangle, Building2, Inbox, Plus, RefreshCw } from 'lucide-react'

export function WarehouseErrorState({
  onRetry,
}: {
  message?: string
  onRetry?: () => void
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center rounded-xl border border-[#262630] bg-[#17171B] p-12 text-center shadow-xl"
    >
      <div className="flex size-12 items-center justify-center rounded-lg border border-[#C95555]/30 bg-[#C95555]/10 text-[#C95555]">
        <AlertTriangle className="size-6" aria-hidden="true" />
      </div>

      <h3 className="mt-4 font-display text-lg font-bold text-[#F4F4F5]">
        Warehouse network unavailable
      </h3>

      <p className="mt-1.5 max-w-md text-sm text-[#A1A1AA]">
        FulfillX couldn't load the latest facility data.
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex items-center gap-2 rounded border border-[#262630] bg-[#1C1C21] px-4 py-2 font-mono text-xs font-semibold text-[#F4F4F5] transition-colors hover:border-[#71717A] hover:bg-[#262630] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4622D]"
        >
          <RefreshCw className="size-3.5 text-[#71717A]" />
          <span>Retry</span>
        </button>
      )}
    </div>
  )
}

type WarehouseEmptyStateProps = {
  hasFilters?: boolean
  activeFilter?: 'all' | 'active' | 'inactive'
  onResetFilter?: () => void
  onAddWarehouse?: () => void
}

export function WarehouseEmptyState({
  hasFilters = false,
  activeFilter = 'all',
  onResetFilter,
  onAddWarehouse,
}: WarehouseEmptyStateProps) {
  if (hasFilters) {
    const title = activeFilter === 'active' ? 'No active warehouses' : 'No inactive warehouses'
    const description =
      activeFilter === 'active'
        ? 'There are currently no active fulfillment locations in the network.'
        : 'All fulfillment facilities across the network are currently active and operational.'

    return (
      <div
        role="status"
        className="flex flex-col items-center justify-center rounded-xl border border-[#262630] bg-[#17171B] p-12 text-center shadow-xl"
      >
        <div className="flex size-12 items-center justify-center rounded-lg border border-[#262630] bg-[#1C1C21] text-[#71717A]">
          <Inbox className="size-6" aria-hidden="true" />
        </div>

        <h3 className="mt-4 font-display text-lg font-bold text-[#F4F4F5]">
          {title}
        </h3>

        <p className="mt-1.5 max-w-md text-sm text-[#A1A1AA]">
          {description}
        </p>

        {onResetFilter && (
          <button
            type="button"
            onClick={onResetFilter}
            className="mt-5 inline-flex items-center gap-2 rounded border border-[#C4622D] bg-[#C4622D] px-4 py-2 font-mono text-xs font-semibold text-white transition-colors hover:bg-[#9E4A20] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4622D]"
          >
            <span>Show All</span>
          </button>
        )}
      </div>
    )
  }

  return (
    <div
      role="status"
      className="flex flex-col items-center justify-center rounded-xl border border-[#262630] bg-[#17171B] p-12 text-center shadow-xl"
    >
      <div className="flex size-12 items-center justify-center rounded-lg border border-[#262630] bg-[#1C1C21] text-[#71717A]">
        <Building2 className="size-6" aria-hidden="true" />
      </div>

      <h3 className="mt-4 font-display text-lg font-bold uppercase tracking-wider text-[#F4F4F5]">
        NO FACILITIES
      </h3>

      <p className="mt-1.5 max-w-md text-sm text-[#A1A1AA]">
        Add your first fulfillment facility to begin building the network.
      </p>

      {onAddWarehouse && (
        <button
          type="button"
          onClick={onAddWarehouse}
          className="mt-5 inline-flex items-center gap-2 rounded border border-[#C4622D] bg-[#C4622D] px-4 py-2 font-mono text-xs font-semibold text-white transition-colors hover:bg-[#9E4A20] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4622D]"
        >
          <Plus className="size-4" />
          <span>+ Add Warehouse</span>
        </button>
      )}
    </div>
  )
}

export function WarehouseTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-[#262630] bg-[#17171B] shadow-xl">
      {/* Table Header Skeleton */}
      <div className="border-b border-[#202027] bg-[#141417] px-6 py-3.5 flex items-center justify-between">
        <div className="h-3 w-28 animate-pulse rounded bg-[#262630]" />
        <div className="hidden sm:block h-3 w-20 animate-pulse rounded bg-[#202027]" />
        <div className="hidden md:block h-3 w-16 animate-pulse rounded bg-[#202027]" />
        <div className="h-3 w-20 animate-pulse rounded bg-[#262630]" />
        <div className="hidden sm:block h-3 w-20 animate-pulse rounded bg-[#202027]" />
        <div className="h-3 w-28 animate-pulse rounded bg-[#262630]" />
        <div className="h-3 w-16 animate-pulse rounded bg-[#262630]" />
      </div>

      {/* Table Rows Skeleton */}
      <div className="divide-y divide-[#202027]">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex items-center justify-between px-6 py-4 gap-4">
            {/* Warehouse Name & ID */}
            <div className="w-48 space-y-1.5">
              <div className="h-4 w-36 animate-pulse rounded bg-[#262630]" />
              <div className="h-3 w-20 animate-pulse rounded bg-[#202027]" />
            </div>

            {/* City */}
            <div className="hidden sm:block w-28">
              <div className="h-3.5 w-24 animate-pulse rounded bg-[#202027]" />
            </div>

            {/* Status */}
            <div className="hidden md:block w-20">
              <div className="h-4 w-16 animate-pulse rounded bg-[#202027]" />
            </div>

            {/* Load */}
            <div className="w-24 text-right">
              <div className="h-4 w-20 ml-auto animate-pulse rounded bg-[#262630]" />
            </div>

            {/* Capacity */}
            <div className="hidden sm:block w-24 text-right">
              <div className="h-4 w-20 ml-auto animate-pulse rounded bg-[#202027]" />
            </div>

            {/* Utilization */}
            <div className="w-44 space-y-1.5">
              <div className="flex justify-between">
                <div className="h-3 w-12 animate-pulse rounded bg-[#262630]" />
                <div className="h-3 w-14 animate-pulse rounded bg-[#202027]" />
              </div>
              <div className="h-1.5 w-full animate-pulse rounded-full bg-[#202027]" />
            </div>

            {/* Actions */}
            <div className="w-20 flex justify-end gap-2">
              <div className="h-6 w-6 animate-pulse rounded bg-[#202027]" />
              <div className="h-6 w-6 animate-pulse rounded bg-[#202027]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
