import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Cpu, RefreshCw, Search, X } from 'lucide-react'

import { Pagination } from '../components/common/Pagination'
import { AllocationDetailsDrawer } from '../components/allocations/AllocationDetailsDrawer'
import { AllocationDistribution } from '../components/allocations/AllocationDistribution'
import { AllocationOverview } from '../components/allocations/AllocationOverview'
import {
  AllocationEmptyState,
  AllocationErrorState,
  AllocationTableSkeleton,
} from '../components/allocations/AllocationStates'
import { AllocationTable } from '../components/allocations/AllocationTable'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { useDisclosure } from '../hooks/useDisclosure'
import { useAllocations, useCustomerOrdersForFilter } from '../hooks/useAllocations'
import { useWarehouses } from '../hooks/useWarehouses'
import { paths } from '../routes/paths'
import { formatShortId, toggleAllocationSort } from '../services/allocationService'
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

  // Reset pagination on filter or sort adjustment
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
  const allocations = useMemo(() => data?.content ?? [], [data?.content])
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

  const handleResetFilters = () => {
    setSearch('')
    setWarehouseFilter('')
    setOrderFilter('')
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
              ALLOCATION HISTORY
            </span>
            <span className="text-[#262630]" aria-hidden="true">|</span>
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold text-[#3FA66B]">
              <span className="size-1.5 rounded-full bg-[#3FA66B]" aria-hidden="true" />
              COMMITTED AUDIT
            </span>
          </div>

          <h1 className="font-display text-3xl font-bold tracking-tight text-[#F4F4F5] sm:text-4xl lg:text-5xl">
            Allocations
          </h1>

          <p className="text-sm leading-relaxed text-[#A1A1AA] sm:text-base">
            Review committed warehouse assignments and fulfillment decisions.
          </p>
        </div>

        {/* Right Header Actions */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => void refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-2 rounded border border-[#262630] bg-[#17171B] px-3.5 py-2 font-mono text-xs font-medium text-[#A1A1AA] transition-colors hover:border-[#71717A] hover:text-[#F4F4F5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4622D] disabled:opacity-50"
            title="Refresh latest committed allocation records"
          >
            <RefreshCw className={`size-3.5 text-[#71717A] ${isFetching ? 'animate-spin' : ''}`} />
            <span>{isFetching ? 'Syncing...' : 'Sync Allocations'}</span>
          </button>

          <Link
            to={paths.optimization}
            className="inline-flex items-center gap-2 rounded border border-[#C4622D] bg-[#C4622D] px-4 py-2 font-mono text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#9E4A20] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4622D]"
          >
            <Cpu className="size-3.5" />
            <span>Open Optimization</span>
            <ArrowRight className="size-3" />
          </Link>
        </div>
      </header>

      {/* 2. ALLOCATION OVERVIEW STRIP */}
      <div className="animate-section-2">
        <AllocationOverview
          allocations={allocations}
          totalElements={totalElements}
          isLoading={isLoading}
        />
      </div>

      {/* 3. ALLOCATION DISTRIBUTION (FACILITY SHARE) */}
      {allocations.length > 0 && (
        <div className="animate-section-3">
          <AllocationDistribution
            allocations={allocations}
            selectedWarehouseId={warehouseFilter}
            onSelectWarehouse={setWarehouseFilter}
          />
        </div>
      )}

      {/* 4. OPERATIONAL FILTER & SEARCH BAR */}
      <section
        aria-label="Allocation Filters"
        className="animate-section-4 rounded-xl border border-[#262630] bg-[#17171B] p-4 sm:p-5 shadow-xl"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_auto]">
          {/* Search Allocations */}
          <div>
            <label htmlFor="allocations-search" className="mb-1.5 block font-mono text-[10px] font-semibold uppercase tracking-wider text-[#71717A]">
              Search Decisions
            </label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#71717A]"
                aria-hidden="true"
              />
              <input
                id="allocations-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by Order ID, strategy, or warehouse..."
                className="w-full rounded-lg border border-[#262630] bg-[#141417] py-2 pl-9 pr-3 text-xs text-[#F4F4F5] outline-none transition-all placeholder:text-[#71717A] focus:border-[#C4622D] focus:ring-1 focus:ring-[#C4622D]"
              />
            </div>
          </div>

          {/* Filter by Hub */}
          <div>
            <label htmlFor="hub-filter" className="mb-1.5 block font-mono text-[10px] font-semibold uppercase tracking-wider text-[#71717A]">
              Filter by Hub
            </label>
            <select
              id="hub-filter"
              value={warehouseFilter}
              onChange={(event) => setWarehouseFilter(event.target.value)}
              className="w-full rounded-lg border border-[#262630] bg-[#141417] px-3 py-2 text-xs text-[#F4F4F5] outline-none transition-all focus:border-[#C4622D] focus:ring-1 focus:ring-[#C4622D]"
            >
              <option value="">All Fulfillment Hubs</option>
              {(warehousePage?.content ?? []).map((warehouse) => (
                <option key={warehouse.id} value={warehouse.id}>
                  {warehouse.name} ({warehouse.city})
                </option>
              ))}
            </select>
          </div>

          {/* Filter by Order */}
          <div>
            <label htmlFor="order-filter" className="mb-1.5 block font-mono text-[10px] font-semibold uppercase tracking-wider text-[#71717A]">
              Filter by Order
            </label>
            <select
              id="order-filter"
              value={orderFilter}
              onChange={(event) => setOrderFilter(event.target.value)}
              className="w-full rounded-lg border border-[#262630] bg-[#141417] px-3 py-2 text-xs text-[#F4F4F5] outline-none transition-all focus:border-[#C4622D] focus:ring-1 focus:ring-[#C4622D]"
            >
              <option value="">All Customer Orders</option>
              {(orderPage?.content ?? []).map((order) => (
                <option key={order.id} value={order.id}>
                  ORD-{formatShortId(order.id)} · {order.status}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters */}
          <div className="flex items-end">
            {hasFilters ? (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 rounded border border-[#262630] bg-[#1C1C21] px-3 py-2 font-mono text-xs font-semibold text-[#C4622D] transition-colors hover:border-[#71717A] hover:text-[#9E4A20] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C4622D]"
                title="Clear all active filters"
              >
                <X className="size-3.5" />
                <span>Reset</span>
              </button>
            ) : (
              <span className="hidden lg:inline-block font-mono text-[10px] text-[#71717A] py-2.5">
                No active filter
              </span>
            )}
          </div>
        </div>
      </section>

      {/* 5. ALLOCATION WORKSPACE & PAGINATION */}
      <div className="animate-section-5 space-y-6">
        {isLoading ? <AllocationTableSkeleton /> : null}

        {!isLoading && isError ? (
          <AllocationErrorState onRetry={() => void refetch()} />
        ) : null}

        {!isLoading && !isError && allocations.length === 0 ? (
          <AllocationEmptyState
            hasFilters={hasFilters}
            onResetFilters={handleResetFilters}
          />
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
              variant="dark"
            />
          </>
        ) : null}
      </div>

      {/* 6. ALLOCATION DETAILS AUDIT DRAWER */}
      <AllocationDetailsDrawer
        allocationId={selectedAllocation?.id ?? null}
        preview={selectedAllocation}
        isOpen={drawer.isOpen}
        onClose={handleCloseDrawer}
      />
    </div>
  )
}

