import { AlertTriangle, PackageSearch, RefreshCw } from 'lucide-react'

export function InventoryErrorState({
  onRetry,
}: {
  message?: string
  onRetry?: () => void
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center rounded-xl border border-[#262630] bg-[#17171B] p-12 text-center"
    >
      <div className="flex size-12 items-center justify-center rounded-lg border border-[#C95555]/30 bg-[#C95555]/10 text-[#C95555]">
        <AlertTriangle className="size-6" aria-hidden="true" />
      </div>
      <h3 className="mt-4 font-display text-lg font-bold text-[#F4F4F5]">
        Inventory unavailable
      </h3>
      <p className="mt-1.5 max-w-md text-sm text-[#A1A1AA]">
        FulfillX couldn't load the latest inventory data.
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex items-center gap-2 rounded border border-[#262630] bg-[#1C1C21] px-4 py-2 text-xs font-semibold text-[#F4F4F5] transition-colors hover:border-[#71717A] hover:bg-[#262630] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4622D]"
        >
          <RefreshCw className="size-3.5" />
          <span>Retry</span>
        </button>
      )}
    </div>
  )
}

type InventoryEmptyStateProps = {
  hasFilters?: boolean
  onClearFilters?: () => void
}

export function InventoryEmptyState({
  hasFilters = false,
  onClearFilters,
}: InventoryEmptyStateProps) {
  return (
    <div
      role="status"
      className="flex flex-col items-center justify-center rounded-xl border border-[#262630] bg-[#17171B] p-12 text-center"
    >
      <div className="flex size-12 items-center justify-center rounded-lg border border-[#262630] bg-[#1C1C21] text-[#71717A]">
        <PackageSearch className="size-6" aria-hidden="true" />
      </div>
      <h3 className="mt-4 font-display text-lg font-bold text-[#F4F4F5]">
        {hasFilters ? 'No inventory matches this filter' : 'No inventory recorded'}
      </h3>
      <p className="mt-1.5 max-w-md text-sm text-[#A1A1AA]">
        {hasFilters
          ? 'Try adjusting or clearing your search term, warehouse selection, or stock health filter.'
          : 'Inventory will appear here once stock is assigned to fulfillment locations.'}
      </p>
      {hasFilters && onClearFilters && (
        <button
          type="button"
          onClick={onClearFilters}
          className="mt-5 inline-flex items-center gap-1.5 rounded border border-[#C4622D] bg-[#C4622D] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#9E4A20] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4622D]"
        >
          Show All
        </button>
      )}
    </div>
  )
}

export function InventoryTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-[#262630] bg-[#17171B] shadow-2xs">
      <div className="border-b border-[#202027] px-5 py-3.5 flex items-center justify-between">
        <div className="h-4 w-32 animate-pulse rounded bg-[#262630]" />
        <div className="h-4 w-20 animate-pulse rounded bg-[#202027]" />
      </div>
      <div className="divide-y divide-[#202027]">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex items-center justify-between px-5 py-4 gap-4">
            <div className="space-y-2 flex-1">
              <div className="h-4 w-44 animate-pulse rounded bg-[#262630]" />
              <div className="h-3 w-28 animate-pulse rounded bg-[#202027]" />
            </div>
            <div className="hidden sm:block h-4 w-36 animate-pulse rounded bg-[#202027]" />
            <div className="h-4 w-20 animate-pulse rounded bg-[#262630]" />
            <div className="h-4 w-24 animate-pulse rounded bg-[#202027]" />
            <div className="h-4 w-12 animate-pulse rounded bg-[#202027]" />
          </div>
        ))}
      </div>
    </div>
  )
}
