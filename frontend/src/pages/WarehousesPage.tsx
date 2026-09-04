import axios from 'axios'
import { ArrowRight, ArrowUpDown, Map, Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { useConfirmDialog } from '../components/common/ConfirmDialogProvider'
import { useToast } from '../components/common/ToastProvider'
import { AddWarehouseModal } from '../components/warehouses/AddWarehouseModal'
import { CapacityPressureSection } from '../components/warehouses/CapacityPressureSection'
import { EditWarehouseModal } from '../components/warehouses/EditWarehouseModal'
import { WarehouseCard } from '../components/warehouses/WarehouseCard'
import { WarehouseDetailsDrawer } from '../components/warehouses/WarehouseDetailsDrawer'
import { WarehouseTable } from '../components/warehouses/WarehouseTable'
import {
  WarehouseEmptyState,
  WarehouseErrorState,
  WarehouseTableSkeleton,
} from '../components/warehouses/WarehouseStates'
import { useDisclosure } from '../hooks/useDisclosure'
import { useWarehouses, useDeleteWarehouse } from '../hooks/useWarehouses'
import { paths } from '../routes/paths'
import { getErrorMessage } from '../services/optimizationService'
import {
  calculateUtilization,
  formatCompactNumber,
  formatUtilization,
  getUtilizationSemantic,
  toggleSort,
} from '../services/warehouseService'
import type { Warehouse, WarehouseSort, WarehouseSortField } from '../types/warehouse'
import { cn } from '../utils/cn'

type ActiveFilter = 'all' | 'active' | 'inactive'

export function WarehousesPage() {
  const drawer = useDisclosure()
  const addModal = useDisclosure()
  const editModal = useDisclosure()
  const { confirm } = useConfirmDialog()
  const { showToast } = useToast()
  const deleteMutation = useDeleteWarehouse()

  const [activeFilter, setActiveFilter] = useState<ActiveFilter>('all')
  // Default sorting: Utilization descending
  const [sort, setSort] = useState<WarehouseSort>({ field: 'utilization', direction: 'desc' })
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null)
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null)

  // Fetch fulfillment network warehouses
  const { data, isLoading, isError, refetch } = useWarehouses({
    page: 0,
    size: 100,
  })

  const allWarehouses = useMemo(() => data?.content ?? [], [data?.content])

  // Derive real values from active warehouse records
  const totalFacilities = data?.totalElements ?? allWarehouses.length
  const activeCount = useMemo(
    () => allWarehouses.filter((w) => w.active).length,
    [allWarehouses],
  )
  const inactiveCount = useMemo(
    () => allWarehouses.filter((w) => !w.active).length,
    [allWarehouses],
  )
  const totalCapacity = useMemo(
    () => allWarehouses.reduce((acc, w) => acc + (w.capacity || 0), 0),
    [allWarehouses],
  )
  const totalLoad = useMemo(
    () => allWarehouses.reduce((acc, w) => acc + (w.currentLoad || 0), 0),
    [allWarehouses],
  )
  const networkUtilization = totalCapacity > 0 ? (totalLoad / totalCapacity) * 100 : 0
  const networkUtilizationSemantic = getUtilizationSemantic(networkUtilization)

  // Filter and Sort data
  const displayedWarehouses = useMemo(() => {
    let list = allWarehouses

    if (activeFilter === 'active') {
      list = list.filter((w) => w.active)
    } else if (activeFilter === 'inactive') {
      list = list.filter((w) => !w.active)
    }

    return [...list].sort((a, b) => {
      let diff = 0
      if (sort.field === 'utilization') {
        diff = calculateUtilization(a) - calculateUtilization(b)
      } else if (sort.field === 'name') {
        diff = a.name.localeCompare(b.name)
      } else if (sort.field === 'capacity') {
        diff = a.capacity - b.capacity
      } else if (sort.field === 'currentLoad') {
        diff = a.currentLoad - b.currentLoad
      } else if (sort.field === 'city') {
        diff = a.city.localeCompare(b.city)
      } else if (sort.field === 'active') {
        diff = a.active === b.active ? 0 : a.active ? 1 : -1
      }
      return sort.direction === 'asc' ? diff : -diff
    })
  }, [allWarehouses, activeFilter, sort.field, sort.direction])

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

  const handleEdit = (warehouse: Warehouse) => {
    setEditingWarehouse(warehouse)
    editModal.open()
  }

  const handleCloseEditModal = () => {
    editModal.close()
    setEditingWarehouse(null)
  }

  const handleDelete = async (warehouse: Warehouse) => {
    const confirmed = await confirm({
      title: 'Delete Fulfillment Facility',
      message: `Are you sure you want to delete "${warehouse.name}" (${warehouse.city})? This action will permanently remove the facility from active routing.`,
      confirmLabel: 'Delete Hub',
      cancelLabel: 'Cancel',
      variant: 'danger',
    })

    if (!confirmed) {
      return
    }

    deleteMutation.mutate(warehouse.id, {
      onSuccess: () => {
        showToast(`Warehouse "${warehouse.name}" was successfully deleted.`, {
          variant: 'success',
        })
        if (selectedWarehouse?.id === warehouse.id) {
          handleCloseDrawer()
        }
      },
      onError: (error) => {
        if (axios.isAxiosError(error) && error.response?.status === 409) {
          showToast(
            'Warehouse cannot be removed. This facility is still referenced by active fulfillment records.',
            { variant: 'error' },
          )
        } else {
          const message = getErrorMessage(error)
          showToast(message, { variant: 'error' })
        }
      },
    })
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
              PHYSICAL TOPOLOGY
            </span>
          </div>

          <h1 className="font-display text-3xl font-bold tracking-tight text-[#F4F4F5] sm:text-4xl lg:text-5xl">
            Warehouses
          </h1>

          <p className="text-sm leading-relaxed text-[#A1A1AA] sm:text-base">
            Manage facilities, capacity, and operational availability across the network.
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            to={paths.warehouseMap}
            className="inline-flex items-center gap-2 rounded border border-[#262630] bg-[#17171B] px-3.5 py-2 font-mono text-xs font-semibold text-[#A1A1AA] transition-colors hover:border-[#71717A] hover:text-[#F4F4F5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4622D]"
          >
            <Map className="size-3.5 text-[#71717A]" aria-hidden="true" />
            <span>View Network Map</span>
            <ArrowRight className="size-3 text-[#71717A]" aria-hidden="true" />
          </Link>

          <button
            type="button"
            onClick={addModal.open}
            className="inline-flex items-center gap-2 rounded border border-[#C4622D] bg-[#C4622D] px-4 py-2 font-mono text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#9E4A20] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4622D]"
          >
            <Plus className="size-3.5" />
            <span>+ Add Warehouse</span>
          </button>
        </div>
      </header>

      {/* 2. NETWORK OVERVIEW STRIP */}
      <section
        aria-label="Network Overview"
        className="animate-section-2 rounded-xl border border-[#262630] bg-[#17171B] p-5 sm:p-6 shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-[#202027] pb-3.5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#71717A]">
              TELEMETRY AGGREGATE
            </span>
            <span className="text-[#262630]" aria-hidden="true">|</span>
            <h2 className="font-display text-xs font-bold tracking-wider text-[#F4F4F5] uppercase">
              NETWORK OVERVIEW
            </h2>
          </div>
          <span className="font-mono text-[11px] text-[#71717A]">
            STATUS: <span className={inactiveCount === 0 ? 'text-[#3FA66B]' : 'text-[#D08A35]'}>{inactiveCount === 0 ? 'OPTIMAL' : `${inactiveCount} OFFLINE`}</span>
          </span>
        </div>

        {/* Tier 1: Facilities Count Breakdown */}
        <div className="mt-4 grid grid-cols-3 divide-x divide-[#202027] border-b border-[#202027] pb-4">
          <div className="pr-4 sm:pr-6">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#71717A]">
              FACILITIES
            </span>
            <p className="mt-1 font-display text-2xl font-bold text-[#F4F4F5] sm:text-3xl">
              {totalFacilities}
            </p>
            <p className="mt-0.5 font-mono text-[10px] text-[#71717A]">Total facilities registered</p>
          </div>

          <div className="px-4 sm:px-6">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#71717A]">
              ACTIVE
            </span>
            <p className="mt-1 font-display text-2xl font-bold text-[#3FA66B] sm:text-3xl">
              {activeCount}
            </p>
            <p className="mt-0.5 font-mono text-[10px] text-[#71717A]">Routing online</p>
          </div>

          <div className="pl-4 sm:pl-6">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#71717A]">
              INACTIVE
            </span>
            <p className="mt-1 font-display text-2xl font-bold text-[#71717A] sm:text-3xl">
              {inactiveCount}
            </p>
            <p className="mt-0.5 font-mono text-[10px] text-[#71717A]">Offline or maintenance</p>
          </div>
        </div>

        {/* Tier 2: Network Capacity, Load, Utilization */}
        <div className="mt-4 grid grid-cols-3 divide-x divide-[#202027]">
          <div className="pr-4 sm:pr-6">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#71717A]">
              CAPACITY
            </span>
            <p className="mt-1 font-mono text-xl font-bold text-[#F4F4F5] sm:text-2xl lg:text-3xl">
              {formatCompactNumber(totalCapacity)}
            </p>
            <p className="mt-0.5 font-mono text-[10px] text-[#71717A]">Network capacity units</p>
          </div>

          <div className="px-4 sm:px-6">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#71717A]">
              CURRENT LOAD
            </span>
            <p className="mt-1 font-mono text-xl font-bold text-[#F4F4F5] sm:text-2xl lg:text-3xl">
              {formatCompactNumber(totalLoad)}
            </p>
            <p className="mt-0.5 font-mono text-[10px] text-[#71717A]">Current load units</p>
          </div>

          <div className="pl-4 sm:pl-6">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#71717A]">
              UTILIZATION
            </span>
            <p
              className="mt-1 font-mono text-xl font-bold sm:text-2xl lg:text-3xl"
              style={{ color: networkUtilizationSemantic.color }}
            >
              {formatUtilization(networkUtilization)}
            </p>
            <p className="mt-0.5 font-mono text-[10px] text-[#71717A]">Network-wide saturation</p>
          </div>
        </div>
      </section>

      {/* 3. CAPACITY PRESSURE SECTION */}
      {!isLoading && !isError && allWarehouses.length > 0 && (
        <div className="animate-section-3">
          <CapacityPressureSection
            warehouses={allWarehouses}
            onSelectWarehouse={handleViewDetails}
          />
        </div>
      )}

      {/* 4. STATUS FILTER & SORT CONTROLS */}
      <section
        aria-label="Warehouse Controls"
        className="animate-section-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#202027] pb-3"
      >
        {/* Left: Developer-tool tab filters with terracotta underline */}
        <div
          role="tablist"
          aria-label="Filter warehouses by operational status"
          className="inline-flex items-center gap-6"
        >
          {(
            [
              { key: 'all', label: 'ALL', count: totalFacilities },
              { key: 'active', label: 'ACTIVE', count: activeCount },
              { key: 'inactive', label: 'INACTIVE', count: inactiveCount },
            ] as const
          ).map((tab) => {
            const isSelected = activeFilter === tab.key
            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setActiveFilter(tab.key)}
                className={cn(
                  'relative pb-2.5 font-mono text-xs font-semibold tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C4622D]',
                  isSelected
                    ? 'text-[#F4F4F5] border-b-2 border-[#C4622D]'
                    : 'text-[#71717A] hover:text-[#A1A1AA] border-b-2 border-transparent',
                )}
              >
                <span>{tab.label}</span>{' '}
                <span className="font-mono text-[10px] text-[#71717A]">({tab.count})</span>
              </button>
            )
          })}
        </div>

        {/* Right: Sort Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <label htmlFor="warehouse-sort-select" className="font-mono text-[11px] text-[#71717A]">
            SORT:
          </label>
          <select
            id="warehouse-sort-select"
            value={sort.field}
            onChange={(event) => {
              const field = event.target.value as WarehouseSortField
              setSort({
                field,
                direction: field === 'utilization' ? 'desc' : 'asc',
              })
            }}
            className="h-8 rounded border border-[#262630] bg-[#141417] px-2.5 font-mono text-xs text-[#F4F4F5] transition-colors focus:border-[#C4622D] focus:outline-none focus:ring-1 focus:ring-[#C4622D]"
          >
            <option value="utilization">Utilization</option>
            <option value="currentLoad">Current Load</option>
            <option value="capacity">Capacity</option>
            <option value="name">Name</option>
          </select>

          <button
            type="button"
            onClick={() =>
              setSort((current) => ({
                ...current,
                direction: current.direction === 'asc' ? 'desc' : 'asc',
              }))
            }
            className="inline-flex h-8 items-center gap-1.5 rounded border border-[#262630] bg-[#141417] px-2.5 font-mono text-xs font-semibold text-[#A1A1AA] transition-colors hover:border-[#71717A] hover:text-[#F4F4F5] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C4622D]"
            title={`Sort order: ${sort.direction === 'asc' ? 'Ascending' : 'Descending'}. Click to toggle.`}
            aria-label={`Current sort direction is ${sort.direction}. Click to toggle`}
          >
            <ArrowUpDown className="size-3 text-[#71717A]" aria-hidden="true" />
            <span className="text-[10px] uppercase">{sort.direction}</span>
          </button>
        </div>
      </section>

      {/* 5. LOADING, ERROR, EMPTY, AND MAIN WAREHOUSE VIEW */}
      <div className="animate-section-4 space-y-6">
        {isLoading ? <WarehouseTableSkeleton /> : null}

        {!isLoading && isError ? (
          <WarehouseErrorState onRetry={() => void refetch()} />
        ) : null}

        {!isLoading && !isError && displayedWarehouses.length === 0 ? (
          <WarehouseEmptyState
            hasFilters={activeFilter !== 'all'}
            activeFilter={activeFilter}
            onResetFilter={() => setActiveFilter('all')}
            onAddWarehouse={addModal.open}
          />
        ) : null}

        {!isLoading && !isError && displayedWarehouses.length > 0 ? (
          <>
            {/* Desktop / Tablet Table View */}
            <WarehouseTable
              warehouses={displayedWarehouses}
              sort={sort}
              onSortChange={handleSortChange}
              onViewDetails={handleViewDetails}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />

            {/* Mobile Structured Cards View */}
            <div className="grid gap-3 md:hidden">
              {displayedWarehouses.map((warehouse) => (
                <WarehouseCard
                  key={warehouse.id}
                  warehouse={warehouse}
                  onViewDetails={handleViewDetails}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>

      {/* 6. WAREHOUSE PROFILE DETAILS AUDIT DRAWER */}
      <WarehouseDetailsDrawer
        warehouseId={selectedWarehouse?.id ?? null}
        preview={selectedWarehouse}
        isOpen={drawer.isOpen}
        onClose={handleCloseDrawer}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* 7. MODALS FOR CREATE & EDIT */}
      <AddWarehouseModal
        isOpen={addModal.isOpen}
        onClose={addModal.close}
      />

      <EditWarehouseModal
        warehouse={editingWarehouse}
        isOpen={editModal.isOpen}
        onClose={handleCloseEditModal}
      />
    </div>
  )
}
