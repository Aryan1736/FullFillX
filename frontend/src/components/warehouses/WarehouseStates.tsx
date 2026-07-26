import { Inbox, Warehouse } from 'lucide-react'

import { EmptyState } from '../common/EmptyState'
import { ErrorState } from '../common/ErrorState'
import { TableSkeleton } from '../common/Skeleton'

export function WarehouseErrorState({
  message = 'Unable to load warehouses. Please try again.',
  onRetry,
}: {
  message?: string
  onRetry?: () => void
}) {
  return <ErrorState title="Warehouses unavailable" message={message} onRetry={onRetry} />
}

type WarehouseEmptyStateProps = {
  hasFilters?: boolean
}

export function WarehouseEmptyState({ hasFilters = false }: WarehouseEmptyStateProps) {
  return (
    <EmptyState
      icon={hasFilters ? Inbox : Warehouse}
      title={hasFilters ? 'No warehouses match your filters' : 'No warehouses yet'}
      description={
        hasFilters
          ? 'Try adjusting the search or filters to find warehouses in your network.'
          : 'Add warehouses to start managing capacity and regional coverage.'
      }
    />
  )
}

export function WarehouseTableSkeleton() {
  return <TableSkeleton rows={6} columns={6} showMobileCards />
}
