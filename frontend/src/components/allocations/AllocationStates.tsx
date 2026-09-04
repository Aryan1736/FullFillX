import { AlertTriangle, History, Inbox, RefreshCw, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { paths } from '../../routes/paths'

export function AllocationErrorState({
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
        Allocations unavailable
      </h3>

      <p className="mt-1.5 max-w-md text-sm text-[#A1A1AA]">
        FulfillX couldn't load allocation history.
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

type AllocationEmptyStateProps = {
  hasFilters?: boolean
  onResetFilters?: () => void
}

export function AllocationEmptyState({
  hasFilters = false,
  onResetFilters,
}: AllocationEmptyStateProps) {
  return (
    <div
      role="status"
      className="flex flex-col items-center justify-center rounded-xl border border-[#262630] bg-[#17171B] p-12 text-center shadow-xl"
    >
      <div className="flex size-12 items-center justify-center rounded-lg border border-[#262630] bg-[#1C1C21] text-[#71717A]">
        {hasFilters ? (
          <Inbox className="size-6" aria-hidden="true" />
        ) : (
          <History className="size-6" aria-hidden="true" />
        )}
      </div>

      <h3 className="mt-4 font-display text-lg font-bold text-[#F4F4F5]">
        {hasFilters ? 'No allocations match this filter' : 'No allocations yet'}
      </h3>

      <p className="mt-1.5 max-w-md text-sm text-[#A1A1AA]">
        {hasFilters
          ? 'Try adjusting your search query, hub selection, or order filter.'
          : 'Committed warehouse assignments will appear here after FulfillX executes an optimization decision.'}
      </p>

      {hasFilters && onResetFilters ? (
        <button
          type="button"
          onClick={onResetFilters}
          className="mt-5 inline-flex items-center gap-2 rounded border border-[#C4622D] bg-[#C4622D] px-4 py-2 font-mono text-xs font-semibold text-white transition-colors hover:bg-[#9E4A20] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4622D]"
        >
          <span>Show All</span>
        </button>
      ) : !hasFilters ? (
        <Link
          to={paths.optimization}
          className="mt-5 inline-flex items-center gap-2 rounded border border-[#C4622D] bg-[#C4622D] px-4 py-2 font-mono text-xs font-semibold text-white transition-colors hover:bg-[#9E4A20] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4622D]"
        >
          <span>Open Optimization</span>
          <ArrowRight className="size-3.5" />
        </Link>
      ) : null}
    </div>
  )
}

export function AllocationTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-[#262630] bg-[#17171B] shadow-xl">
      {/* Table Header Skeleton */}
      <div className="border-b border-[#202027] bg-[#141417] px-5 py-3.5 flex items-center justify-between">
        <div className="h-3 w-20 animate-pulse rounded bg-[#262630]" />
        <div className="hidden sm:block h-3 w-16 animate-pulse rounded bg-[#202027]" />
        <div className="h-3 w-32 animate-pulse rounded bg-[#262630]" />
        <div className="hidden md:block h-3 w-12 animate-pulse rounded bg-[#202027]" />
        <div className="hidden lg:block h-3 w-16 animate-pulse rounded bg-[#202027]" />
        <div className="h-3 w-20 animate-pulse rounded bg-[#262630]" />
        <div className="hidden sm:block h-3 w-24 animate-pulse rounded bg-[#202027]" />
        <div className="h-3 w-12 animate-pulse rounded bg-[#262630]" />
      </div>

      {/* Table Rows Skeleton */}
      <div className="divide-y divide-[#202027]">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex items-center justify-between px-5 py-4 gap-4">
            <div className="w-24">
              <div className="h-4 w-20 animate-pulse rounded bg-[#262630]" />
            </div>

            <div className="hidden sm:block w-20">
              <div className="h-3.5 w-16 animate-pulse rounded bg-[#202027]" />
            </div>

            <div className="flex-1 space-y-1.5">
              <div className="h-3.5 w-44 animate-pulse rounded bg-[#262630]" />
            </div>

            <div className="hidden md:block w-16">
              <div className="h-3.5 w-10 animate-pulse rounded bg-[#202027]" />
            </div>

            <div className="hidden lg:block w-20 text-right">
              <div className="h-3.5 w-14 ml-auto animate-pulse rounded bg-[#202027]" />
            </div>

            <div className="w-24">
              <div className="h-4 w-20 animate-pulse rounded bg-[#262630]" />
            </div>

            <div className="hidden sm:block w-24">
              <div className="h-3 w-20 animate-pulse rounded bg-[#202027]" />
            </div>

            <div className="w-12 flex justify-end">
              <div className="h-3 w-8 animate-pulse rounded bg-[#202027]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

