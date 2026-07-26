import { Inbox } from 'lucide-react'

import { EmptyState } from '../common/EmptyState'
import { ErrorState } from '../common/ErrorState'
import { CardGridSkeleton, ChartGridSkeleton } from '../common/Skeleton'

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
    <div className="space-y-6">
      <CardGridSkeleton count={7} />
      <ChartGridSkeleton count={4} />
    </div>
  )
}
