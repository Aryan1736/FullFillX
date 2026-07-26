import { useMemo, useState } from 'react'

import { PageHeader } from '../components/common/PageHeader'
import {
  WarehouseAllocationsPanel,
  WarehouseMapLegend,
} from '../components/warehouses/map/WarehouseAllocationsPanel'
import { WarehouseMapView } from '../components/warehouses/map/WarehouseMapView'
import {
  WarehouseMapEmptyState,
  WarehouseMapErrorState,
  WarehouseMapSkeleton,
} from '../components/warehouses/map/WarehouseMapStates'
import { WarehouseViewTabs } from '../components/warehouses/WarehouseViewTabs'
import { useWarehouseAllocations, useWarehouseMapData } from '../hooks/useWarehouseMap'
import { getRelatedWarehouseIds } from '../services/warehouseMapService'

export function WarehouseMapPage() {
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string | null>(null)
  const { data, isLoading, isError, refetch, isFetching } = useWarehouseMapData()
  const { data: allocationsPage, isLoading: isAllocationsLoading, isError: isAllocationsError } =
    useWarehouseAllocations(selectedWarehouseId)

  const locations = useMemo(() => data?.locations ?? [], [data?.locations])

  const selectedLocation = useMemo(
    () => locations.find((location) => location.id === selectedWarehouseId) ?? null,
    [locations, selectedWarehouseId],
  )

  const relatedWarehouseIds = useMemo(
    () => getRelatedWarehouseIds(allocationsPage, selectedWarehouseId ?? ''),
    [allocationsPage, selectedWarehouseId],
  )

  const handleSelectWarehouse = (warehouseId: string) => {
    setSelectedWarehouseId((current) => (current === warehouseId ? null : warehouseId))
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Warehouse Map"
        description="Explore warehouse locations, utilization, and related allocations across the network."
        actions={<WarehouseViewTabs active="map" />}
      />

      {isLoading ? <WarehouseMapSkeleton /> : null}

      {!isLoading && isError ? <WarehouseMapErrorState onRetry={() => void refetch()} /> : null}

      {!isLoading && !isError && locations.length === 0 ? <WarehouseMapEmptyState /> : null}

      {!isLoading && !isError && locations.length > 0 ? (
        <>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <WarehouseMapLegend />
            <p className="text-sm text-slate-500">
              {locations.length} warehouse{locations.length === 1 ? '' : 's'} on map
              {isFetching ? ' · Updating...' : ''}
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
              <div className="h-[min(70vh,560px)] min-h-[320px]">
                <WarehouseMapView
                  locations={locations}
                  selectedWarehouseId={selectedWarehouseId}
                  relatedWarehouseIds={relatedWarehouseIds}
                  onSelectWarehouse={handleSelectWarehouse}
                />
              </div>
            </section>

            <WarehouseAllocationsPanel
              selectedLocation={selectedLocation}
              allocations={allocationsPage?.content ?? []}
              isLoading={Boolean(selectedWarehouseId) && isAllocationsLoading}
              isError={isAllocationsError}
              relatedWarehouseCount={relatedWarehouseIds.size}
            />
          </div>
        </>
      ) : null}
    </div>
  )
}
