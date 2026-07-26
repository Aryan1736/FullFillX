import { Package } from 'lucide-react'

import { EmptyState } from '../common/EmptyState'
import { ErrorState } from '../common/ErrorState'
import { TableSkeleton } from '../common/Skeleton'

export function InventoryErrorState({
  message = 'Unable to load inventory. Please try again.',
  onRetry,
}: {
  message?: string
  onRetry?: () => void
}) {
  return <ErrorState title="Inventory unavailable" message={message} onRetry={onRetry} />
}

type InventoryEmptyStateProps = {
  hasFilters?: boolean
}

export function InventoryEmptyState({ hasFilters = false }: InventoryEmptyStateProps) {
  return (
    <EmptyState
      icon={Package}
      title={hasFilters ? 'No inventory records match your filters' : 'No inventory records yet'}
      description={
        hasFilters
          ? 'Try adjusting the search or filters to find stock across warehouses.'
          : 'Inventory records will appear once products are stocked in warehouses.'
      }
    />
  )
}

export function InventoryTableSkeleton() {
  return <TableSkeleton rows={8} columns={6} />
}
