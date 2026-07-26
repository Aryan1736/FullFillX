import { AlertCircle, Clock3, IndianRupee, Loader2, Package, Split, Target, Warehouse, X } from 'lucide-react'
import { useRef } from 'react'

import { useAllocation, useCustomerOrder } from '../../hooks/useAllocations'
import { useDrawerA11y } from '../../hooks/useDrawerA11y'
import {
  formatAllocationCurrency,
  formatAllocationDate,
  formatAllocationEta,
  formatAllocationScore,
  formatShortId,
  getTotalProductQuantity,
  isSplitShipment,
} from '../../services/allocationService'
import type { Allocation } from '../../types/allocation'
import { DetailRow } from '../common/DetailRow'
import { KpiCard } from '../dashboard/KpiCard'
import { ReasoningTimeline } from '../optimization/ReasoningTimeline'
import { ScoreBreakdownCards } from '../optimization/ScoreBreakdownCards'
import { AllocatedWarehouseTable, WarehouseScoreBreakdown } from './AllocatedWarehouseTable'

type AllocationDetailsDrawerProps = {
  allocationId: string | null
  preview?: Allocation | null
  isOpen: boolean
  onClose: () => void
}

export function AllocationDetailsDrawer({
  allocationId,
  preview,
  isOpen,
  onClose,
}: AllocationDetailsDrawerProps) {
  const { data: allocation, isLoading, isError } = useAllocation(isOpen ? allocationId : null)
  const details = allocation ?? preview
  const { data: order, isLoading: isOrderLoading } = useCustomerOrder(
    isOpen && details ? details.orderId : null,
  )

  const drawerRef = useRef<HTMLElement>(null)
  useDrawerA11y({ isOpen, onClose, containerRef: drawerRef })

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Close allocation details"
        className="absolute inset-0 bg-slate-900/40"
        onClick={onClose}
      />

      <aside
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="allocation-details-title"
        className="relative flex h-full w-full max-w-2xl flex-col bg-white shadow-xl"
      >
        <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
          <div className="min-w-0 pr-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Allocation Details
            </p>
            <h2 id="allocation-details-title" className="mt-1 truncate text-lg font-semibold text-slate-900">
              {details ? formatShortId(details.id) : 'Loading allocation'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close drawer"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {isLoading && !details ? (
            <div className="flex h-40 items-center justify-center text-slate-500">
              <Loader2 className="size-6 animate-spin" aria-hidden="true" />
            </div>
          ) : null}

          {isError && !details ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <div className="flex items-center gap-2 font-medium text-red-900">
                <AlertCircle className="size-4" aria-hidden="true" />
                Unable to load allocation details
              </div>
            </div>
          ) : null}

          {details ? (
            <div className="space-y-6">
              <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="text-base font-semibold text-slate-900">Order Details</h3>
                {isOrderLoading ? (
                  <p className="mt-3 text-sm text-slate-500">Loading order…</p>
                ) : (
                  <dl className="mt-3">
                    <DetailRow label="Order ID" value={details.orderId} />
                    <DetailRow
                      label="Status"
                      value={order?.status ?? '—'}
                    />
                    <DetailRow
                      label="Total Items"
                      value={order ? String(order.totalItems) : '—'}
                    />
                    <DetailRow label="Created" value={formatAllocationDate(details.createdAt)} />
                  </dl>
                )}
              </section>

              <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="grid gap-4 sm:grid-cols-2">
                  <KpiCard
                    title="Optimization Score"
                    value={formatAllocationScore(details.score)}
                    icon={Target}
                    description={details.strategyName || 'Unknown strategy'}
                  />
                  <KpiCard
                    title="Shipping Cost"
                    value={formatAllocationCurrency(details.shippingCost)}
                    icon={IndianRupee}
                  />
                  <KpiCard
                    title="ETA"
                    value={formatAllocationEta(details.eta)}
                    icon={Clock3}
                  />
                  <KpiCard
                    title="Split Shipment"
                    value={isSplitShipment(details) ? 'Yes' : 'No'}
                    icon={Split}
                    description={`${details.warehouses.length} warehouse(s) selected`}
                  />
                </div>
              </section>

              <AllocatedWarehouseTable warehouses={details.warehouses} />

              <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center gap-2">
                  <Package className="size-4 text-slate-500" aria-hidden="true" />
                  <h3 className="text-base font-semibold text-slate-900">Products Allocated</h3>
                </div>
                {details.products.length === 0 ? (
                  <p className="text-sm text-slate-500">No products allocated.</p>
                ) : (
                  <ul className="divide-y divide-slate-100">
                    {details.products.map((entry) => (
                      <li
                        key={entry.product.id}
                        className="flex items-center justify-between py-3 text-sm"
                      >
                        <span className="font-medium text-slate-900">{entry.product.name}</span>
                        <span className="text-slate-600">
                          {entry.quantity} × {entry.product.category}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                <p className="mt-3 text-xs text-slate-500">
                  Total quantity: {getTotalProductQuantity(details)}
                </p>
              </section>

              {details.scoreBreakdown ? (
                <ScoreBreakdownCards scoreBreakdown={details.scoreBreakdown} />
              ) : null}

              <WarehouseScoreBreakdown warehouses={details.warehouses} />

              <ReasoningTimeline reasoning={details.reasoning} />

              <section className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Warehouse className="size-4" aria-hidden="true" />
                  Strategy: {details.strategyName || '—'}
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  Last updated {formatAllocationDate(details.updatedAt)}
                </p>
              </section>
            </div>
          ) : null}
        </div>
      </aside>
    </div>
  )
}
