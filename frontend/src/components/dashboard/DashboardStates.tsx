import { Inbox } from 'lucide-react'

import { EmptyState } from '../common/EmptyState'
import { ErrorState } from '../common/ErrorState'

export function DashboardErrorState({
  message = 'Unable to load dashboard data. Please try again.',
  onRetry,
}: {
  message?: string
  onRetry?: () => void
}) {
  return <ErrorState title="Dashboard unavailable" message={message} onRetry={onRetry} />
}

export function DashboardEmptyState() {
  return (
    <EmptyState
      icon={Inbox}
      title="No dashboard data yet"
      description="Once warehouses, products, and orders are created, performance metrics will appear here."
    />
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-skeleton">
      {/* Workflow skeleton */}
      <div className="rounded-xl border border-[#262630] bg-[#17171B] p-6 space-y-4">
        <div className="h-4 w-48 rounded bg-[#262630]" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 rounded-lg border border-[#262630] bg-[#141418]" />
          ))}
        </div>
      </div>

      {/* KPI unified surface skeleton */}
      <div className="rounded-xl border border-[#262630] bg-[#17171B]">
        <div className="h-10 border-b border-[#262630] px-5 py-3">
          <div className="h-3 w-36 rounded bg-[#262630]" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#262630]">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-6 space-y-3">
              <div className="h-3 w-24 rounded bg-[#262630]" />
              <div className="h-8 w-28 rounded bg-[#202027]" />
            </div>
          ))}
        </div>
      </div>

      {/* Charts 2x2 grid skeleton */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-72 rounded-xl border border-[#262630] bg-[#17171B] p-5 space-y-3">
            <div className="h-4 w-40 rounded bg-[#262630]" />
            <div className="h-full rounded bg-[#141418]" />
          </div>
        ))}
      </div>
    </div>
  )
}
