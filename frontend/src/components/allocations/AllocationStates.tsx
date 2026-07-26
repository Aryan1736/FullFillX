import { History, Inbox } from 'lucide-react'

import { EmptyState } from '../common/EmptyState'
import { ErrorState } from '../common/ErrorState'
import { TableSkeleton } from '../common/Skeleton'

export function AllocationErrorState({
  message = 'Unable to load allocations. Please try again.',
  onRetry,
}: {
  message?: string
  onRetry?: () => void
}) {
  return <ErrorState title="Allocations unavailable" message={message} onRetry={onRetry} />
}

type AllocationEmptyStateProps = {
  hasFilters?: boolean
}

export function AllocationEmptyState({ hasFilters = false }: AllocationEmptyStateProps) {
  return (
    <EmptyState
      icon={hasFilters ? Inbox : History}
      title={hasFilters ? 'No allocations match your filters' : 'No allocation history yet'}
      description={
        hasFilters
          ? 'Try adjusting the search or filters to find past fulfillment decisions.'
          : 'Run optimization to generate warehouse allocations. Results will appear here.'
      }
    />
  )
}

export function AllocationTableSkeleton() {
  return <TableSkeleton rows={8} columns={6} />
}
