import { useEffect, useMemo, useState } from 'react'

import { PageHeader } from '../components/common/PageHeader'
import {
  InventoryFilters,
  type LowStockFilter,
} from '../components/inventory/InventoryFilters'
import { InventoryPagination } from '../components/inventory/InventoryPagination'
import { InventoryTable } from '../components/inventory/InventoryTable'
import {
  InventoryEmptyState,
  InventoryErrorState,
  InventoryTableSkeleton,
} from '../components/inventory/InventoryStates'
import { useInventory } from '../hooks/useInventory'
import { useWarehouses } from '../hooks/useWarehouses'
import { toggleSort } from '../services/inventoryService'
import type { InventorySort, InventorySortField } from '../types/inventory'

const PAGE_SIZE = 10

export function InventoryPage() {
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [warehouseId, setWarehouseId] = useState('')
  const [lowStockFilter, setLowStockFilter] = useState<LowStockFilter>('all')
  const [sort, setSort] = useState<InventorySort>({ field: 'productName', direction: 'asc' })

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 300)
    return () => window.clearTimeout(timer)
  }, [search])

  useEffect(() => {
    setPage(0)
  }, [debouncedSearch, warehouseId, lowStockFilter, sort.field, sort.direction])

  const queryParams = useMemo(
    () => ({
      page,
      size: PAGE_SIZE,
      search: debouncedSearch || undefined,
      warehouseId: warehouseId || undefined,
      lowStock: lowStockFilter === 'lowStock' ? true : undefined,
      sort,
    }),
    [page, debouncedSearch, warehouseId, lowStockFilter, sort],
  )

  const { data, isLoading, isError, refetch, isFetching } = useInventory(queryParams)
  const { data: warehousePage } = useWarehouses({
    page: 0,
    size: 100,
    sort: { field: 'name', direction: 'asc' },
  })

  const warehouses = warehousePage?.content ?? []
  const items = data?.content ?? []
  const hasFilters = Boolean(debouncedSearch || warehouseId || lowStockFilter === 'lowStock')

  const handleSortChange = (field: InventorySortField) => {
    setSort((current) => toggleSort(current, field))
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory"
        description="Track stock levels, reservations, and replenishment across warehouses."
      />

      <InventoryFilters
        search={search}
        warehouseId={warehouseId}
        lowStockFilter={lowStockFilter}
        warehouses={warehouses}
        onSearchChange={setSearch}
        onWarehouseChange={setWarehouseId}
        onLowStockFilterChange={setLowStockFilter}
      />

      {isLoading ? <InventoryTableSkeleton /> : null}

      {!isLoading && isError ? (
        <InventoryErrorState onRetry={() => void refetch()} />
      ) : null}

      {!isLoading && !isError && items.length === 0 ? (
        <InventoryEmptyState hasFilters={hasFilters} />
      ) : null}

      {!isLoading && !isError && items.length > 0 ? (
        <>
          <InventoryTable items={items} sort={sort} onSortChange={handleSortChange} />

          <InventoryPagination
            page={page}
            pageSize={PAGE_SIZE}
            totalElements={data?.totalElements ?? 0}
            totalPages={data?.totalPages ?? 0}
            isFirst={data?.first ?? page === 0}
            isLast={data?.last ?? page >= (data?.totalPages ?? 1) - 1}
            isFetching={isFetching}
            onPageChange={setPage}
          />
        </>
      ) : null}
    </div>
  )
}
