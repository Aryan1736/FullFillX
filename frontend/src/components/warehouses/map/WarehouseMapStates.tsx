import { MapPin } from 'lucide-react'

import { EmptyState } from '../../common/EmptyState'
import { ErrorState } from '../../common/ErrorState'
import { MapSkeleton } from '../../common/Skeleton'

type WarehouseMapErrorStateProps = {
  onRetry: () => void
}

export function WarehouseMapErrorState({ onRetry }: WarehouseMapErrorStateProps) {
  return (
    <ErrorState
      title="Unable to load warehouse map"
      message="Check your connection and try again."
      onRetry={onRetry}
    />
  )
}

export function WarehouseMapEmptyState() {
  return (
    <EmptyState
      icon={MapPin}
      title="No mappable warehouses"
      description="Warehouses need valid latitude and longitude coordinates to appear on the map."
    />
  )
}

export function WarehouseMapSkeleton() {
  return <MapSkeleton />
}
