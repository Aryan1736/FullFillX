import { Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { PageHeader } from '../components/common/PageHeader'
import { Pagination } from '../components/common/Pagination'
import { WarehouseViewTabs } from '../components/warehouses/WarehouseViewTabs'
import { WarehouseCard } from '../components/warehouses/WarehouseCard'
import { WarehouseDetailsDrawer } from '../components/warehouses/WarehouseDetailsDrawer'
import { WarehouseTable } from '../components/warehouses/WarehouseTable'
import {
  WarehouseEmptyState,
  WarehouseErrorState,
  WarehouseTableSkeleton,
} from '../components/warehouses/WarehouseStates'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
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
  const debouncedName = useDebouncedValue(nameSearch.trim(), 300)
  const [cityFilter, setCityFilter] = useState('')
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>('all')
  const [sort, setSort] = useState<WarehouseSort>({ field: 'name', direction: 'asc' })
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null)

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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Warehouses"
        description="Manage warehouse locations, capacity, and regional coverage."
        actions={<WarehouseViewTabs active="list" />}
      />

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
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
                className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-3 text-sm text-slate-900 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </span>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Filter by city</span>
            <select
              value={cityFilter}
              onChange={(event) => setCityFilter(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
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
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
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

          <Pagination
            page={page}
            pageSize={PAGE_SIZE}
            totalElements={totalElements}
            totalPages={totalPages}
            isFirst={data?.first ?? page === 0}
            isLast={data?.last ?? page >= totalPages - 1}
            isFetching={isFetching}
            onPageChange={setPage}
            itemLabel="warehouses"
          />
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
