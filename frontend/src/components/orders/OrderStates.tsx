import { ShoppingCart } from 'lucide-react'

import { EmptyState } from '../common/EmptyState'
import { ErrorState } from '../common/ErrorState'
import { TableSkeleton } from '../common/Skeleton'

export function OrderErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorState
      title="Unable to load orders"
      message="We could not retrieve customer orders. Check your connection and try again."
      onRetry={onRetry}
    />
  )
}

export function OrderEmptyState() {
  return (
    <EmptyState
      icon={ShoppingCart}
      title="No orders yet"
      description="Customer orders will appear here once they are placed and synced from the fulfillment pipeline."
    />
  )
}

export function OrderTableSkeleton() {
  return <TableSkeleton rows={8} columns={5} showMobileCards />
}
