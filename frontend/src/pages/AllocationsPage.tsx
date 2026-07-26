import { Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { PageHeader } from '../components/common/PageHeader'
import { Pagination } from '../components/common/Pagination'
import { AllocationDetailsDrawer } from '../components/allocations/AllocationDetailsDrawer'
import { AllocationTable } from '../components/allocations/AllocationTable'
import {
  AllocationEmptyState,
  AllocationErrorState,
  AllocationTableSkeleton,
} from '../components/allocations/AllocationStates'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { useDisclosure } from '../hooks/useDisclosure'
import { useAllocations, useCustomerOrdersForFilter } from '../hooks/useAllocations'
import { useWarehouses } from '../hooks/useWarehouses'
import { toggleAllocationSort } from '../services/allocationService'
import type { Allocation, AllocationSort, AllocationSortField } from '../types/allocation'

const PAGE_SIZE = 10

export function AllocationsPage() {
  const drawer = useDisclosure()
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search.trim(), 300)
  const [warehouseFilter, setWarehouseFilter] = useState('')
  const [orderFilter, setOrderFilter] = useState('')
  const [sort, setSort] = useState<AllocationSort>({ field: 'createdAt', direction: 'desc' })
  const [selectedAllocation, setSelectedAllocation] = useState<Allocation | null>(null)

  useEffect(() => {
    setPage(0)
  }, [debouncedSearch, warehouseFilter, orderFilter, sort.field, sort.direction])

  const queryParams = useMemo(
    () => ({
      page,
      size: PAGE_SIZE,
      search: debouncedSearch || undefined,
      warehouseId: warehouseFilter || undefined,
      orderId: orderFilter || undefined,
      sort,
    }),
    [page, debouncedSearch, warehouseFilter, orderFilter, sort],
  )

  const { data, isLoading, isError, refetch, isFetching } = useAllocations(queryParams)
  const { data: warehousePage } = useWarehouses({
    page: 0,
    size: 100,
    sort: { field: 'name', direction: 'asc' },
  })
  const { data: orderPage } = useCustomerOrdersForFilter()

  const hasFilters = Boolean(debouncedSearch || warehouseFilter || orderFilter)
  const allocations = data?.content ?? []
  const totalPages = data?.totalPages ?? 0
  const totalElements = data?.totalElements ?? 0

  const handleSortChange = (field: AllocationSortField) => {
    setSort((current) => toggleAllocationSort(current, field))
  }

  const handleViewDetails = (allocation: Allocation) => {
    setSelectedAllocation(allocation)
    drawer.open()
  }

  const handleCloseDrawer = () => {
    drawer.close()
    setSelectedAllocation(null)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Allocation History"
        description="Review past fulfillment allocations, scoring breakdowns, and optimization reasoning."
      />

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Search</span>
            <span className="relative block">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by ID, strategy, or warehouse..."
                className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-3 text-sm text-slate-900 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </span>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Filter by warehouse</span>
            <select
              value={warehouseFilter}
              onChange={(event) => setWarehouseFilter(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="">All warehouses</option>
              {(warehousePage?.content ?? []).map((warehouse) => (
                <option key={warehouse.id} value={warehouse.id}>
                  {warehouse.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Filter by order</span>
            <select
              value={orderFilter}
              onChange={(event) => setOrderFilter(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="">All orders</option>
              {(orderPage?.content ?? []).map((order) => (
                <option key={order.id} value={order.id}>
                  {order.id.slice(0, 8)}… · {order.status}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      {isLoading ? <AllocationTableSkeleton /> : null}

      {!isLoading && isError ? (
        <AllocationErrorState onRetry={() => void refetch()} />
      ) : null}

      {!isLoading && !isError && allocations.length === 0 ? (
        <AllocationEmptyState hasFilters={hasFilters} />
      ) : null}

      {!isLoading && !isError && allocations.length > 0 ? (
        <>
          <AllocationTable
            allocations={allocations}
            sort={sort}
            onSortChange={handleSortChange}
            onViewDetails={handleViewDetails}
          />

          <Pagination
            page={page}
            pageSize={PAGE_SIZE}
            totalElements={totalElements}
            totalPages={totalPages}
            isFirst={data?.first ?? page === 0}
            isLast={data?.last ?? page >= totalPages - 1}
            isFetching={isFetching}
            onPageChange={setPage}
            itemLabel="allocations"
          />
        </>
      ) : null}

      <AllocationDetailsDrawer
        allocationId={selectedAllocation?.id ?? null}
        preview={selectedAllocation}
        isOpen={drawer.isOpen}
        onClose={handleCloseDrawer}
      />
    </div>
  )
}
