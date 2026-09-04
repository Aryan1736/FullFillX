import { Clock, Layers, MapPin, Package } from 'lucide-react'

import type { CustomerOrder } from '../../types/order'
import type { Customer } from '../../types/customer'
import type { Product } from '../../types/product'

type OptimizationInputContextProps = {
  pendingOrdersCount: number
  totalUnitsToFulfill: number
  candidateWarehousesCount: number
  strategyName: string
  pendingOrders: CustomerOrder[]
  selectedOrder: CustomerOrder | null
  onSelectOrder: (order: CustomerOrder) => void
  customerMap: Record<string, Customer>
  productMap: Record<string, Product>
  isLoadingOrders?: boolean
}

export function OptimizationInputContext({
  pendingOrdersCount,
  totalUnitsToFulfill,
  candidateWarehousesCount,
  strategyName,
  pendingOrders,
  selectedOrder,
  onSelectOrder,
  customerMap,
  productMap,
  isLoadingOrders = false,
}: OptimizationInputContextProps) {
  const selectedCustomer = selectedOrder ? customerMap[selectedOrder.customerId] : null

  return (
    <div className="space-y-4">
      {/* 1. Unified Demand Metric Surface */}
      <div className="rounded-xl border border-[#262630] bg-[#17171B] p-4 shadow-sm sm:p-5">
        <div className="flex items-center justify-between border-b border-[#202027] pb-3">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#71717A]">
            OPTIMIZATION INPUT CONTEXT
          </span>
          <span className="font-mono text-[10px] text-[#A1A1AA]">
            Solver Evaluation Scope
          </span>
        </div>

        <div className="grid grid-cols-2 divide-y divide-[#202027] sm:grid-cols-4 sm:divide-x sm:divide-y-0 pt-3">
          {/* Metric 1: Pending Orders */}
          <div className="py-2 sm:py-0 sm:px-4 first:pl-0">
            <span className="text-[11px] font-medium text-[#71717A]">Pending Orders</span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-mono text-2xl font-bold text-[#F4F4F5]">
                {isLoadingOrders ? '—' : pendingOrdersCount}
              </span>
              <span className="font-mono text-[10px] text-[#71717A]">queued</span>
            </div>
          </div>

          {/* Metric 2: Units to Fulfill */}
          <div className="py-2 sm:py-0 sm:px-4">
            <span className="text-[11px] font-medium text-[#71717A]">Units to Fulfill</span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-mono text-2xl font-bold text-[#F4F4F5]">
                {isLoadingOrders ? '—' : totalUnitsToFulfill.toLocaleString()}
              </span>
              <span className="font-mono text-[10px] text-[#71717A]">items</span>
            </div>
          </div>

          {/* Metric 3: Candidate Warehouses */}
          <div className="py-2 sm:py-0 sm:px-4">
            <span className="text-[11px] font-medium text-[#71717A]">Candidate Warehouses</span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-mono text-2xl font-bold text-[#F4F4F5]">
                {candidateWarehousesCount}
              </span>
              <span className="font-mono text-[10px] text-[#71717A]">active hubs</span>
            </div>
          </div>

          {/* Metric 4: Strategy */}
          <div className="py-2 sm:py-0 sm:px-4 last:pr-0">
            <span className="text-[11px] font-medium text-[#71717A]">Routing Strategy</span>
            <div className="mt-1">
              <span className="inline-flex items-center rounded border border-[#262630] bg-[#1C1C21] px-2 py-1 font-mono text-xs font-semibold text-[#F4F4F5]">
                {strategyName.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Pending Orders Demand Queue Selector */}
      {pendingOrders.length > 0 ? (
        <div className="rounded-xl border border-[#262630] bg-[#17171B] p-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#202027] pb-3">
            <div className="flex items-center gap-2">
              <Layers className="size-4 text-[#C4622D]" />
              <h3 className="font-display text-sm font-bold text-[#F4F4F5]">
                Pending Demand Queue
              </h3>
            </div>
            <span className="font-mono text-[10px] text-[#71717A]">
              Select order to evaluate
            </span>
          </div>

          <div className="mt-3 space-y-2 max-h-72 overflow-y-auto pr-1">
            {pendingOrders.map((order) => {
              const isSelected = selectedOrder?.id === order.id
              const customer = customerMap[order.customerId]
              const totalUnits = order.orderItems.reduce((acc, item) => acc + item.quantity, 0)

              return (
                <button
                  key={order.id}
                  type="button"
                  onClick={() => onSelectOrder(order)}
                  className={`w-full text-left rounded-lg border p-3 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4622D] ${
                    isSelected
                      ? 'border-[#C4622D] bg-[#1C1C21] shadow-xs'
                      : 'border-[#262630] bg-[#17171B] hover:border-[#71717A] hover:bg-[#1C1C21]/60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`size-2 rounded-full shrink-0 ${
                          isSelected ? 'bg-[#C4622D]' : 'bg-[#71717A]'
                        }`}
                        aria-hidden="true"
                      />
                      <span className="font-mono text-xs font-bold text-[#F4F4F5]">
                        #{order.id.slice(0, 8)}
                      </span>
                      <span className="text-[#262630]" aria-hidden="true">|</span>
                      <span className="truncate text-xs font-medium text-[#A1A1AA]">
                        {customer?.name ?? 'Customer Order'}
                      </span>
                    </div>

                    <span className="font-mono text-xs font-bold text-[#F4F4F5] shrink-0">
                      {totalUnits} {totalUnits === 1 ? 'unit' : 'units'}
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-[#71717A]">
                    {customer?.city ? (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="size-3 text-[#A1A1AA]" />
                        <span>{customer.city}</span>
                      </span>
                    ) : null}
                    <span className="inline-flex items-center gap-1 font-mono">
                      <Package className="size-3 text-[#A1A1AA]" />
                      <span>{order.orderItems.length} SKU lines</span>
                    </span>
                    <span className="inline-flex items-center gap-1 font-mono">
                      <Clock className="size-3 text-[#A1A1AA]" />
                      <span>{order.createdAt ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}</span>
                    </span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Selected Order Manifest Details */}
          {selectedOrder && selectedCustomer ? (
            <div className="mt-4 rounded-lg border border-[#202027] bg-[#1C1C21] p-3.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">
                  ACTIVE DEMAND MANIFEST
                </span>
                <span className="font-mono text-[11px] text-[#C4622D]">
                  Destination: {selectedCustomer.city}
                </span>
              </div>

              <div className="mt-2.5 space-y-1.5 border-t border-[#262630] pt-2.5">
                {selectedOrder.orderItems.map((item) => {
                  const product = productMap[item.productId]
                  return (
                    <div
                      key={item.productId}
                      className="flex items-center justify-between text-xs font-mono"
                    >
                      <span className="text-[#A1A1AA] truncate pr-2">
                        {product?.name ?? item.productId.slice(0, 12)}
                      </span>
                      <span className="text-[#F4F4F5] font-bold shrink-0">
                        {item.quantity} × {product?.weight ?? '—'} kg
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
