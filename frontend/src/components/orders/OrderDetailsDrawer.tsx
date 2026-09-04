import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Cpu, IndianRupee, MapPin, Package, Truck, X } from 'lucide-react'

import { useDrawerA11y } from '../../hooks/useDrawerA11y'
import { useAllocations } from '../../hooks/useAllocations'
import { formatOrderDate, formatShortOrderId } from '../../services/orderService'
import type { CustomerOrder } from '../../types/order'
import type { Customer } from '../../types/customer'
import type { Product } from '../../types/product'
import { paths } from '../../routes/paths'
import { OrderStatusBadge } from './OrderStatusBadge'

type OrderDetailsDrawerProps = {
  order: CustomerOrder | null
  isOpen: boolean
  onClose: () => void
  customers?: Customer[]
  products?: Product[]
}

export function OrderDetailsDrawer({
  order,
  isOpen,
  onClose,
  customers = [],
  products = [],
}: OrderDetailsDrawerProps) {
  const drawerRef = useRef<HTMLElement>(null)
  useDrawerA11y({ isOpen, onClose, containerRef: drawerRef })

  // Query allocation for this specific order if available
  const { data: allocationData, isLoading: isAllocationLoading } = useAllocations(
    order?.id
      ? { page: 0, size: 1, orderId: order.id }
      : { page: 0, size: 0 },
  )

  if (!isOpen || !order) {
    return null
  }

  const customer = customers.find((c) => c.id === order.customerId)
  const isPending = order.status === 'PENDING'
  const allocation = allocationData?.content?.[0]
  const shortId = formatShortOrderId(order.id)
  const shortCustId = formatShortOrderId(order.customerId)

  // Map products by ID for line items display
  const productMap = new Map(products.map((p) => [p.id, p]))

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close order details"
        className="absolute inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <aside
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-drawer-title"
        className="relative z-10 flex h-full w-full max-w-lg flex-col border-l border-[#262630] bg-[#17171B] text-[#F4F4F5] shadow-2xl"
      >
        {/* Header */}
        <header className="flex items-start justify-between border-b border-[#202027] p-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#71717A]">
                ORDER SPECIFICATION
              </span>
              <span className="text-[#262630]" aria-hidden="true">|</span>
              <OrderStatusBadge status={order.status} />
            </div>

            <h2
              id="order-drawer-title"
              className="font-display text-xl font-bold tracking-tight text-[#F4F4F5]"
            >
              Order #ORD-{shortId}
            </h2>

            <p className="font-mono text-xs text-[#71717A]">
              UUID: <span className="text-[#A1A1AA]">{order.id}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close drawer"
            className="rounded border border-[#262630] bg-[#1C1C21] p-1.5 text-[#A1A1AA] transition-colors hover:border-[#71717A] hover:text-[#F4F4F5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4622D]"
          >
            <X className="size-4" />
          </button>
        </header>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 divide-y divide-[#202027]">
          {/* 1. CUSTOMER & TIMELINE SECTION */}
          <section className="space-y-3">
            <h3 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#71717A]">
              Customer Account
            </h3>

            <div className="rounded-lg border border-[#262630] bg-[#1C1C21] p-4 text-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[#71717A]">Customer Name</span>
                <span className="font-medium text-[#F4F4F5]">
                  {customer?.name || `Customer Account ${shortCustId}`}
                </span>
              </div>

              {customer?.city && (
                <div className="flex items-center justify-between">
                  <span className="text-[#71717A]">Destination Hub</span>
                  <span className="inline-flex items-center gap-1 text-[#F4F4F5]">
                    <MapPin className="size-3 text-[#71717A]" />
                    {customer.city}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-[#71717A]">Customer ID</span>
                <span className="font-mono text-[11px] text-[#A1A1AA]">{order.customerId}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#71717A]">Order Placed</span>
                <span className="font-mono text-[#A1A1AA]">{formatOrderDate(order.createdAt)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#71717A]">Last Updated</span>
                <span className="font-mono text-[#A1A1AA]">{formatOrderDate(order.updatedAt)}</span>
              </div>
            </div>
          </section>

          {/* 2. ORDER LINE ITEMS */}
          <section className="pt-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#71717A]">
                Line Items
              </h3>
              <span className="font-mono text-xs text-[#A1A1AA]">
                {order.totalItems} total {order.totalItems === 1 ? 'unit' : 'units'}
              </span>
            </div>

            <div className="overflow-hidden rounded-lg border border-[#262630] bg-[#1C1C21]">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#202027] bg-[#141417]">
                    <th className="py-2.5 pl-3.5 pr-2 font-mono text-[10px] uppercase text-[#71717A]">
                      Product Item
                    </th>
                    <th className="py-2.5 px-2 text-right font-mono text-[10px] uppercase text-[#71717A]">
                      Qty
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#202027]">
                  {order.orderItems && order.orderItems.length > 0 ? (
                    order.orderItems.map((item, idx) => {
                      const product = productMap.get(item.productId)
                      return (
                        <tr key={item.productId || idx} className="hover:bg-[#202027]/40">
                          <td className="py-2.5 pl-3.5 pr-2">
                            <p className="font-medium text-[#F4F4F5]">
                              {product?.name || `Product ${formatShortOrderId(item.productId)}`}
                            </p>
                            <p className="font-mono text-[10px] text-[#71717A]">
                              SKU: {formatShortOrderId(item.productId)}
                              {product?.category ? ` · ${product.category}` : ''}
                            </p>
                          </td>
                          <td className="py-2.5 px-2 text-right font-mono text-sm font-semibold text-[#F4F4F5]">
                            {item.quantity}
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan={2} className="py-3 px-3.5 text-center text-[#71717A]">
                        {order.totalItems} aggregated line item units
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* 3. ALLOCATION & SHIPPING INFORMATION */}
          <section className="pt-6 space-y-3">
            <h3 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#71717A]">
              Fulfillment Allocation Telemetry
            </h3>

            {isAllocationLoading ? (
              <div className="rounded-lg border border-[#262630] bg-[#1C1C21] p-4 font-mono text-xs text-[#71717A] animate-pulse">
                Querying allocation record...
              </div>
            ) : allocation ? (
              <div className="rounded-lg border border-[#262630] bg-[#1C1C21] p-4 text-xs space-y-3">
                <div className="flex items-center justify-between border-b border-[#202027] pb-2">
                  <span className="text-[#71717A]">Allocation Strategy</span>
                  <span className="font-mono font-medium text-[#F4F4F5]">
                    {allocation.strategyName || 'Multi-Criteria Heuristic'}
                  </span>
                </div>

                {allocation.warehouses && allocation.warehouses.length > 0 && (
                  <div>
                    <span className="font-mono text-[10px] uppercase text-[#71717A]">
                      Assigned Facility
                    </span>
                    {allocation.warehouses.map((wh, idx) => (
                      <div key={idx} className="mt-1 flex items-center justify-between">
                        <span className="font-medium text-[#F4F4F5]">
                          {wh.warehouse?.name ?? 'Assigned Warehouse'}
                        </span>
                        <span className="font-mono text-[#A1A1AA]">
                          {wh.warehouse?.city ?? ''}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-2 border-t border-[#202027] grid grid-cols-2 gap-3">
                  <div>
                    <span className="font-mono text-[10px] uppercase text-[#71717A]">
                      Shipping Cost
                    </span>
                    <p className="mt-0.5 font-mono text-base font-bold text-[#F4F4F5] flex items-center">
                      <IndianRupee className="size-3.5" />
                      {allocation.shippingCost.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div>
                    <span className="font-mono text-[10px] uppercase text-[#71717A]">
                      Estimated Delivery
                    </span>
                    <p className="mt-0.5 font-mono text-base font-bold text-[#F4F4F5] flex items-center gap-1">
                      <Truck className="size-3.5 text-[#71717A]" />
                      {allocation.eta} hrs
                    </p>
                  </div>
                </div>
              </div>
            ) : isPending ? (
              <div className="rounded-lg border border-[#C4622D]/30 bg-[#C4622D]/5 p-4 text-xs space-y-3">
                <div className="flex items-start gap-2.5">
                  <Package className="size-4 text-[#C4622D] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#F4F4F5]">Awaiting Warehouse Allocation</p>
                    <p className="mt-1 text-[#A1A1AA]">
                      This order is queued for allocation. Run optimization heuristics to match proximity, stock levels, and freight rates across candidate facilities.
                    </p>
                  </div>
                </div>

                <Link
                  to={paths.optimization}
                  className="inline-flex items-center gap-2 rounded border border-[#C4622D] bg-[#C4622D] px-3.5 py-1.5 font-mono text-xs font-semibold text-white transition-colors hover:bg-[#9E4A20] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4622D]"
                >
                  <Cpu className="size-3.5" />
                  <span>Launch Optimization</span>
                  <ArrowRight className="size-3" />
                </Link>
              </div>
            ) : (
              <div className="rounded-lg border border-[#262630] bg-[#1C1C21] p-4 text-xs text-[#71717A]">
                No separate allocation record found for this order.
              </div>
            )}
          </section>
        </div>

        {/* Footer */}
        <footer className="border-t border-[#202027] p-4 flex items-center justify-between">
          <span className="font-mono text-[11px] text-[#71717A]">
            FulfillX Order Dispatch Console
          </span>

          <button
            type="button"
            onClick={onClose}
            className="rounded border border-[#262630] bg-[#1C1C21] px-4 py-2 font-mono text-xs font-medium text-[#F4F4F5] transition-colors hover:border-[#71717A] hover:bg-[#262630] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4622D]"
          >
            Close Details
          </button>
        </footer>
      </aside>
    </div>
  )
}
