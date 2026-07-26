import { AlertCircle, Inbox, RefreshCw } from 'lucide-react'

type InventoryErrorStateProps = {
  message?: string
  onRetry?: () => void
}

export function InventoryErrorState({
  message = 'Unable to load inventory. Please try again.',
  onRetry,
}: InventoryErrorStateProps) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
      <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-red-100 text-red-600">
        <AlertCircle className="size-6" aria-hidden="true" />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-red-900">Something went wrong</h2>
      <p className="mt-2 text-sm text-red-700">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
        >
          <RefreshCw className="size-4" aria-hidden="true" />
          Retry
        </button>
      ) : null}
    </div>
  )
}

type InventoryEmptyStateProps = {
  hasFilters?: boolean
}

export function InventoryEmptyState({ hasFilters = false }: InventoryEmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
      <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
        <Inbox className="size-6" aria-hidden="true" />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-slate-900">
        {hasFilters ? 'No inventory records match your filters' : 'No inventory records yet'}
      </h2>
      <p className="mt-2 text-sm text-slate-500">
        {hasFilters
          ? 'Try adjusting the search or filters to find inventory records.'
          : 'Inventory records will appear here once products are stocked in warehouses.'}
      </p>
    </div>
  )
}

export function InventoryTableSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
        <div className="h-4 w-full max-w-xl rounded bg-slate-200" />
      </div>
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="flex gap-4 border-b border-slate-100 px-4 py-4 last:border-b-0">
          {Array.from({ length: 6 }).map((__, cellIndex) => (
            <div key={cellIndex} className="h-4 flex-1 rounded bg-slate-200" />
          ))}
        </div>
      ))}
    </div>
  )
}
