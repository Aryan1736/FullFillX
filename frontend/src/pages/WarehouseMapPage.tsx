import { useMemo, useState } from 'react'
import { RefreshCw } from 'lucide-react'

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
    <div className="relative space-y-8 sm:space-y-10 pb-12">
      {/* Subtle depth glow behind header */}
      <div
        className="pointer-events-none absolute -top-16 left-1/2 -z-10 h-80 w-full max-w-4xl -translate-x-1/2 rounded-full bg-radial from-[#C4622D]/5 via-transparent to-transparent blur-2xl"
        aria-hidden="true"
      />

      {/* 1. PAGE HEADER */}
      <header className="animate-section-1 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between border-b border-[#202027] pb-8">
        <div className="max-w-2xl space-y-2">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[#71717A]">
              FULFILLMENT NETWORK
            </span>
            <span className="text-[#262630]" aria-hidden="true">|</span>
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold text-[#3FA66B]">
              <span className="size-1.5 rounded-full bg-[#3FA66B]" aria-hidden="true" />
              GEOGRAPHIC TOPOLOGY
            </span>
            <span className="rounded border border-[#262630] bg-[#17171B] px-2 py-0.5 font-mono text-[10px] text-[#A1A1AA]">
              {locations.length} FACILITIES
            </span>
          </div>

          <h1 className="font-display text-3xl font-bold tracking-tight text-[#F4F4F5] sm:text-4xl lg:text-5xl">
            Warehouse Map
          </h1>

          <p className="text-sm leading-relaxed text-[#A1A1AA] sm:text-base">
            Geographic facility nodes, capacity utilization levels, and cross-warehouse fulfillment links.
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => void refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-2 rounded border border-[#262630] bg-[#17171B] px-3.5 py-2 font-mono text-xs font-medium text-[#A1A1AA] transition-colors hover:border-[#71717A] hover:text-[#F4F4F5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4622D] disabled:opacity-50"
            title="Refresh map nodes telemetry"
          >
            <RefreshCw className={`size-3.5 text-[#71717A] ${isFetching ? 'animate-spin' : ''}`} />
            <span>{isFetching ? 'Syncing...' : 'Sync Map'}</span>
          </button>
          <WarehouseViewTabs active="map" />
        </div>
      </header>

      {isLoading ? <WarehouseMapSkeleton /> : null}

      {!isLoading && isError ? <WarehouseMapErrorState onRetry={() => void refetch()} /> : null}

      {!isLoading && !isError && locations.length === 0 ? <WarehouseMapEmptyState /> : null}

      {!isLoading && !isError && locations.length > 0 ? (
        <div className="space-y-6">
          {/* Operational summary bar */}
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between rounded-xl border border-[#262630] bg-[#17171B] p-3.5 shadow-lg">
            <WarehouseMapLegend />
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="text-[#71717A]">
                Network Status: <span className="font-semibold text-[#3FA66B]">Connected</span>
              </span>
              <span className="text-[#262630]">|</span>
              <span className="text-[#A1A1AA]">
                {locations.length} Facilities Active
                {isFetching ? ' · Syncing...' : ''}
              </span>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
            <section className="overflow-hidden rounded-xl border border-[#262630] bg-[#17171B] p-1.5 shadow-xl">
              <div className="h-[min(70vh,580px)] min-h-[360px] overflow-hidden rounded-lg">
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
        </div>
      ) : null}
    </div>
  )
}
