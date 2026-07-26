import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { PageHeader } from '../components/common/PageHeader'
import { WarehouseCard } from '../components/warehouses/WarehouseCard'
import { WarehouseDetailsDrawer } from '../components/warehouses/WarehouseDetailsDrawer'
import { WarehouseTable } from '../components/warehouses/WarehouseTable'
import {
  WarehouseEmptyState,
  WarehouseErrorState,
  WarehouseTableSkeleton,
} from '../components/warehouses/WarehouseStates'
import { useDisclosure } from '../hooks/useDisclosure'
import { useWarehouseCities, useWarehouses } from '../hooks/useWarehouses'
import { toggleSort } from '../services/warehouseService'
import type { Warehouse, WarehouseSort, WarehouseSortField } from '../types/warehouse'

const PAGE_SIZE = 10

type ActiveFilter = 'all' | 'active' | 'inactive'

export function WarehousesPage() {
  const drawer = useDisclosure()
  const [page, setPage] = useState(0)
  const [nameSearch, setNameSearch] = useState('')
  const [debouncedName, setDebouncedName] = useState('')
  const [cityFilter, setCityFilter] = useState('')
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>('all')
  const [sort, setSort] = useState<WarehouseSort>({ field: 'name', direction: 'asc' })
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null)

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedName(nameSearch.trim()), 300)
    return () => window.clearTimeout(timer)
  }, [nameSearch])

  useEffect(() => {
    setPage(0)
  }, [debouncedName, cityFilter, activeFilter, sort.field, sort.direction])

  const queryParams = useMemo(
    () => ({
      page,
      size: PAGE_SIZE,
      name: debouncedName || undefined,
      city: cityFilter || undefined,
      active:
        activeFilter === 'all' ? undefined : activeFilter === 'active',
      sort,
    }),
    [page, debouncedName, cityFilter, activeFilter, sort],
  )

  const { data, isLoading, isError, refetch, isFetching } = useWarehouses(queryParams)
  const { data: cities = [] } = useWarehouseCities()

  const hasFilters = Boolean(debouncedName || cityFilter || activeFilter !== 'all')

  const handleSortChange = (field: WarehouseSortField) => {
    setSort((current) => toggleSort(current, field))
  }

  const handleViewDetails = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse)
    drawer.open()
  }

  const handleCloseDrawer = () => {
    drawer.close()
    setSelectedWarehouse(null)
  }

  const warehouses = data?.content ?? []
  const totalPages = data?.totalPages ?? 0
  const totalElements = data?.totalElements ?? 0
  const pageStart = totalElements === 0 ? 0 : page * PAGE_SIZE + 1
  const pageEnd = Math.min((page + 1) * PAGE_SIZE, totalElements)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Warehouses"
        description="Manage warehouse locations, capacity, and regional coverage."
      />

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Search by name</span>
            <span className="relative block">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />
              <input
                type="search"
                value={nameSearch}
                onChange={(event) => setNameSearch(event.target.value)}
                placeholder="Search warehouses..."
                className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-3 text-sm text-slate-900 outline-none transition-colors focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              />
            </span>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Filter by city</span>
            <select
              value={cityFilter}
              onChange={(event) => setCityFilter(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-colors focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            >
              <option value="">All cities</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Active status</span>
            <select
              value={activeFilter}
              onChange={(event) => setActiveFilter(event.target.value as ActiveFilter)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-colors focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>
        </div>
      </section>

      {isLoading ? <WarehouseTableSkeleton /> : null}

      {!isLoading && isError ? (
        <WarehouseErrorState onRetry={() => void refetch()} />
      ) : null}

      {!isLoading && !isError && warehouses.length === 0 ? (
        <WarehouseEmptyState hasFilters={hasFilters} />
      ) : null}

      {!isLoading && !isError && warehouses.length > 0 ? (
        <>
          <WarehouseTable
            warehouses={warehouses}
            sort={sort}
            onSortChange={handleSortChange}
            onViewDetails={handleViewDetails}
          />

          <div className="grid gap-4 md:hidden">
            {warehouses.map((warehouse) => (
              <WarehouseCard
                key={warehouse.id}
                warehouse={warehouse}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>

          <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600">
              Showing {pageStart}-{pageEnd} of {totalElements} warehouses
              {isFetching ? ' · Updating...' : ''}
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(current - 1, 0))}
                disabled={data?.first ?? page === 0}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronLeft className="size-4" aria-hidden="true" />
                Previous
              </button>
              <span className="px-2 text-sm text-slate-600">
                Page {totalPages === 0 ? 0 : page + 1} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((current) => current + 1)}
                disabled={data?.last ?? page >= totalPages - 1}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
                <ChevronRight className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </>
      ) : null}

      <WarehouseDetailsDrawer
        warehouseId={selectedWarehouse?.id ?? null}
        preview={selectedWarehouse}
        isOpen={drawer.isOpen}
        onClose={handleCloseDrawer}
      />
    </div>
  )
}
