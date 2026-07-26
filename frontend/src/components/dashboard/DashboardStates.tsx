import { AlertCircle, Inbox, RefreshCw } from 'lucide-react'

type DashboardErrorStateProps = {
  message?: string
  onRetry?: () => void
}

export function DashboardErrorState({
  message = 'Unable to load dashboard data. Please try again.',
  onRetry,
}: DashboardErrorStateProps) {
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

export function DashboardEmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
      <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
        <Inbox className="size-6" aria-hidden="true" />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-slate-900">No dashboard data yet</h2>
      <p className="mt-2 text-sm text-slate-500">
        Once warehouses, products, and orders are created, metrics will appear here.
      </p>
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 7 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-3">
                <div className="h-4 w-24 rounded bg-slate-200" />
                <div className="h-8 w-20 rounded bg-slate-200" />
              </div>
              <div className="size-10 rounded-lg bg-slate-200" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="mb-4 space-y-2">
              <div className="h-5 w-40 rounded bg-slate-200" />
              <div className="h-4 w-56 rounded bg-slate-200" />
            </div>
            <div className="h-72 rounded-lg bg-slate-100" />
          </div>
        ))}
      </div>
    </div>
  )
}
