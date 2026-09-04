import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Cpu, RefreshCw } from 'lucide-react'

import { Pagination } from '../components/common/Pagination'
import { OrderDetailsDrawer } from '../components/orders/OrderDetailsDrawer'
import { OrderFilters, type OrderStatusFilter } from '../components/orders/OrderFilters'
import { OrderLifecycle } from '../components/orders/OrderLifecycle'
import { OrderOverview } from '../components/orders/OrderOverview'
import {
  OrderEmptyState,
  OrderErrorState,
  OrderTableSkeleton,
} from '../components/orders/OrderStates'
import { OrderTable } from '../components/orders/OrderTable'
import { useCustomers } from '../hooks/useCustomers'
import { useOrders, useOrdersStatusBreakdown } from '../hooks/useOrders'
import { useProducts } from '../hooks/useProducts'
import { paths } from '../routes/paths'
import type { CustomerOrder } from '../types/order'

const PAGE_SIZE = 10

export function OrdersPage() {
  const [page, setPage] = useState(0)
  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>('ALL')
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(null)

  // Reset page when filter changes
  useEffect(() => {
    setPage(0)
  }, [statusFilter])

  // Query paginated orders with server-side status filtering
  const {
    data: ordersData,
    isLoading: isOrdersLoading,
    isError: isOrdersError,
    refetch: refetchOrders,
    isFetching: isOrdersFetching,
  } = useOrders({
    page,
    size: PAGE_SIZE,
    status: statusFilter === 'ALL' ? undefined : statusFilter,
  })

  // Query network-wide real order volume grouped by status
  const {
    data: statusData,
    isLoading: isStatusLoading,
    refetch: refetchStatus,
    isFetching: isStatusFetching,
  } = useOrdersStatusBreakdown()

  // Query customers to display real customer names
  const { data: customersPage } = useCustomers()
  const customers = useMemo(() => customersPage?.content ?? [], [customersPage?.content])

  // Customer ID to Name map
  const customerMap = useMemo(() => {
    return Object.fromEntries(customers.map((c) => [c.id, c.name]))
  }, [customers])

  // Query products to display real product names in drawer
  const { data: productsPage } = useProducts()
  const products = useMemo(() => productsPage?.content ?? [], [productsPage?.content])

  const orders = useMemo(() => ordersData?.content ?? [], [ordersData?.content])
  const isSyncing = isOrdersFetching || isStatusFetching

  const handleSyncAll = () => {
    void Promise.all([refetchOrders(), refetchStatus()])
  }

  const handleResetFilter = () => {
    setStatusFilter('ALL')
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
              ORDER MANAGEMENT
            </span>
            <span className="text-[#262630]" aria-hidden="true">|</span>
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold text-[#3FA66B]">
              <span className="size-1.5 rounded-full bg-[#3FA66B]" aria-hidden="true" />
              LIVE QUEUE
            </span>
          </div>

          <h1 className="font-display text-3xl font-bold tracking-tight text-[#F4F4F5] sm:text-4xl lg:text-5xl">
            Orders
          </h1>

          <p className="text-sm leading-relaxed text-[#A1A1AA] sm:text-base">
            Review customer demand and move orders toward optimized fulfillment.
          </p>
        </div>

        {/* Right Header Actions */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleSyncAll}
            disabled={isSyncing}
            className="inline-flex items-center gap-2 rounded border border-[#262630] bg-[#17171B] px-3.5 py-2 font-mono text-xs font-medium text-[#A1A1AA] transition-colors hover:border-[#71717A] hover:text-[#F4F4F5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4622D] disabled:opacity-50"
            title="Refresh latest customer orders queue"
          >
            <RefreshCw className={`size-3.5 text-[#71717A] ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Orders'}</span>
          </button>

          <Link
            to={paths.optimization}
            className="inline-flex items-center gap-2 rounded border border-[#C4622D] bg-[#C4622D] px-4 py-2 font-mono text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#9E4A20] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4622D]"
          >
            <Cpu className="size-3.5" />
            <span>Optimize Orders</span>
            <ArrowRight className="size-3" />
          </Link>
        </div>
      </header>

      {/* 2. ORDER OVERVIEW STRIP */}
      <div className="animate-section-2">
        <OrderOverview
          statusData={statusData}
          totalOrdersFromPage={ordersData?.totalElements}
          isLoading={isStatusLoading}
        />
      </div>

      {/* 3. FULFILLMENT LIFECYCLE PIPELINE */}
      <div className="animate-section-3">
        <OrderLifecycle
          statusData={statusData}
          activeStatusFilter={statusFilter}
          onSelectStatus={setStatusFilter}
          isLoading={isStatusLoading}
        />
      </div>

      {/* 4. QUEUE CONTROLS & STATUS FILTERS */}
      <div className="animate-section-4">
        <OrderFilters
          currentFilter={statusFilter}
          statusData={statusData}
          totalOrdersFromPage={ordersData?.totalElements}
          onFilterChange={setStatusFilter}
        />
      </div>

      {/* 5. ORDER WORKSPACE TABLE & PAGINATION */}
      <div className="animate-section-5 space-y-6">
        {isOrdersLoading ? <OrderTableSkeleton /> : null}

        {!isOrdersLoading && isOrdersError ? (
          <OrderErrorState onRetry={handleSyncAll} />
        ) : null}

        {!isOrdersLoading && !isOrdersError && orders.length === 0 ? (
          <OrderEmptyState
            currentFilter={statusFilter}
            onResetFilter={handleResetFilter}
          />
        ) : null}

        {!isOrdersLoading && !isOrdersError && orders.length > 0 ? (
          <>
            <OrderTable
              orders={orders}
              customerMap={customerMap}
              onSelectOrder={setSelectedOrder}
            />

            <Pagination
              page={page}
              pageSize={PAGE_SIZE}
              totalElements={ordersData?.totalElements ?? orders.length}
              totalPages={ordersData?.totalPages ?? 1}
              isFirst={ordersData?.first ?? page === 0}
              isLast={ordersData?.last ?? page >= (ordersData?.totalPages ?? 1) - 1}
              isFetching={isOrdersFetching}
              onPageChange={setPage}
              itemLabel="orders"
              variant="dark"
            />
          </>
        ) : null}
      </div>

      {/* 6. ORDER DETAILS INSPECTION DRAWER */}
      <OrderDetailsDrawer
        order={selectedOrder}
        isOpen={selectedOrder !== null}
        onClose={() => setSelectedOrder(null)}
        customers={customers}
        products={products}
      />
    </div>
  )
}
