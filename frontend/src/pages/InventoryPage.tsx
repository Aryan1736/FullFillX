import { useEffect, useMemo, useState } from 'react'
import { RefreshCw } from 'lucide-react'

import { Pagination } from '../components/common/Pagination'
import { InventoryDetailsDrawer } from '../components/inventory/InventoryDetailsDrawer'
import {
  InventoryFilters,
  type InventoryStatusTab,
} from '../components/inventory/InventoryFilters'
import { InventoryOverview } from '../components/inventory/InventoryOverview'
import {
  InventoryEmptyState,
  InventoryErrorState,
  InventoryTableSkeleton,
} from '../components/inventory/InventoryStates'
import { InventoryTable } from '../components/inventory/InventoryTable'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { useInventory, useInventoryStatus } from '../hooks/useInventory'
import { useWarehouses } from '../hooks/useWarehouses'
import { getStockStatus, toggleSort } from '../services/inventoryService'
import type { InventoryItem, InventorySort, InventorySortField, StockStatus } from '../types/inventory'

const PAGE_SIZE = 10

export function InventoryPage() {
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search.trim(), 300)
  const [warehouseId, setWarehouseId] = useState('')
  const [statusTab, setStatusTab] = useState<InventoryStatusTab>('ALL')
  const [sort, setSort] = useState<InventorySort | null>(null)
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)

  // Reset page on filter changes
  useEffect(() => {
    setPage(0)
  }, [debouncedSearch, warehouseId, statusTab, sort?.field, sort?.direction])

  // Build query params for inventory API
  const queryParams = useMemo(
    () => ({
      page,
      size: PAGE_SIZE,
      search: debouncedSearch || undefined,
      warehouseId: warehouseId || undefined,
      lowStock: statusTab === 'LOW_STOCK' ? true : undefined,
      sort: sort ?? undefined,
    }),
    [page, debouncedSearch, warehouseId, statusTab, sort],
  )

  // Fetch live inventory items
  const {
    data,
    isLoading,
    isError,
    refetch: refetchInventory,
    isFetching: isFetchingInventory,
  } = useInventory(queryParams)

  // Fetch network-wide inventory telemetry status
  const {
    data: statusData,
    isLoading: isStatusLoading,
    refetch: refetchStatus,
    isFetching: isFetchingStatus,
  } = useInventoryStatus()

  // Fetch fulfillment warehouses for selector
  const { data: warehousePage } = useWarehouses({
    page: 0,
    size: 100,
    sort: { field: 'name', direction: 'asc' },
  })

  const warehouses = warehousePage?.content ?? []
  const rawItems = useMemo(() => data?.content ?? [], [data?.content])
  const isSyncing = isFetchingInventory || isFetchingStatus

  const handleSyncAll = () => {
    void Promise.all([refetchInventory(), refetchStatus()])
  }

  // Filter items by status tab
  const filteredItems = useMemo(() => {
    if (statusTab === 'ALL') {
      return rawItems
    }
    return rawItems.filter((item) => getStockStatus(item) === statusTab)
  }, [rawItems, statusTab])

  // Apply attention-first triage order (OUT OF STOCK -> LOW STOCK -> HEALTHY, secondary: lowest available first)
  // when no explicit user column sort is active
  const displayedItems = useMemo(() => {
    if (sort !== null) {
      return filteredItems
    }

    const statusWeights: Record<StockStatus, number> = {
      OUT_OF_STOCK: 0,
      LOW_STOCK: 1,
      HEALTHY: 2,
    }

    return [...filteredItems].sort((a, b) => {
      const weightA = statusWeights[getStockStatus(a)]
      const weightB = statusWeights[getStockStatus(b)]
      if (weightA !== weightB) {
        return weightA - weightB
      }
      return a.availableQuantity - b.availableQuantity
    })
  }, [filteredItems, sort])

  // Calculate real status tab counts from network status telemetry
  const statusCounts = useMemo(() => {
    if (!statusData) {
      return undefined
    }
    const all = statusData.inventoryRecordCount ?? data?.totalElements ?? 0
    const lowStock = statusData.lowStockCount ?? 0
    const outOfStock = statusData.outOfStockCount ?? 0
    const healthy = Math.max(0, all - (lowStock + outOfStock))
    return { all, healthy, lowStock, outOfStock }
  }, [statusData, data?.totalElements])

  const hasFilters = Boolean(debouncedSearch || warehouseId || statusTab !== 'ALL')

  const handleSortChange = (field: InventorySortField) => {
    setSort((current) => toggleSort(current ?? { field: 'productName', direction: 'asc' }, field))
  }

  const handleClearFilters = () => {
    setSearch('')
    setWarehouseId('')
    setStatusTab('ALL')
    setSort(null)
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
              INVENTORY CONTROL
            </span>
            <span className="text-[#262630]" aria-hidden="true">|</span>
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold text-[#3FA66B]">
              <span className="size-1.5 rounded-full bg-[#3FA66B]" aria-hidden="true" />
              LIVE TELEMETRY
            </span>
          </div>

          <h1 className="font-display text-3xl font-bold tracking-tight text-[#F4F4F5] sm:text-4xl lg:text-5xl">
            Inventory
          </h1>

          <p className="text-sm leading-relaxed text-[#A1A1AA] sm:text-base">
            Monitor stock availability across the fulfillment network.
          </p>
        </div>

        {/* Header Action: Sync Telemetry */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleSyncAll}
            disabled={isSyncing}
            className="inline-flex items-center gap-2 rounded border border-[#262630] bg-[#17171B] px-3.5 py-2 font-mono text-xs font-medium text-[#A1A1AA] transition-colors hover:border-[#71717A] hover:text-[#F4F4F5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4622D] disabled:opacity-50"
            title="Refresh network inventory telemetry"
          >
            <RefreshCw className={`size-3.5 text-[#71717A] ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Telemetry'}</span>
          </button>
        </div>
      </header>

      {/* 2. INVENTORY OVERVIEW STRIP */}
      <div className="animate-section-2">
        <InventoryOverview
          status={statusData}
          totalSkus={data?.totalElements ?? 0}
          isLoading={isStatusLoading}
        />
      </div>

      {/* 3. FILTER BAR */}
      <div className="animate-section-3">
        <InventoryFilters
          search={search}
          warehouseId={warehouseId}
          statusFilter={statusTab}
          warehouses={warehouses}
          counts={statusCounts}
          onSearchChange={setSearch}
          onWarehouseChange={setWarehouseId}
          onStatusFilterChange={setStatusTab}
          onResetFilters={handleClearFilters}
        />
      </div>

      {/* 4. MAIN INVENTORY TABLE & PAGINATION */}
      <div className="animate-section-4 space-y-6">
        {isLoading ? <InventoryTableSkeleton /> : null}

        {!isLoading && isError ? (
          <InventoryErrorState onRetry={handleSyncAll} />
        ) : null}

        {!isLoading && !isError && displayedItems.length === 0 ? (
          <InventoryEmptyState
            hasFilters={hasFilters}
            onClearFilters={hasFilters ? handleClearFilters : undefined}
          />
        ) : null}

        {!isLoading && !isError && displayedItems.length > 0 ? (
          <>
            <InventoryTable
              items={displayedItems}
              sort={sort ?? { field: 'availableQuantity', direction: 'asc' }}
              onSortChange={handleSortChange}
              onSelect={setSelectedItem}
            />

            <Pagination
              page={page}
              pageSize={PAGE_SIZE}
              totalElements={data?.totalElements ?? displayedItems.length}
              totalPages={data?.totalPages ?? 1}
              isFirst={data?.first ?? page === 0}
              isLast={data?.last ?? page >= (data?.totalPages ?? 1) - 1}
              isFetching={isFetchingInventory}
              onPageChange={setPage}
              itemLabel="SKUs"
              variant="dark"
            />
          </>
        ) : null}
      </div>

      {/* 5. INVENTORY DETAILS DRAWER */}
      <InventoryDetailsDrawer
        item={selectedItem}
        isOpen={selectedItem !== null}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  )
}
