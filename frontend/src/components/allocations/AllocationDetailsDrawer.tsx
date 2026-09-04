import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Cpu,
  Filter,
  IndianRupee,
  Info,
  Loader2,
  ShieldCheck,
  Split,
  Target,
  Warehouse,
  X,
  XCircle,
} from 'lucide-react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'

import { useAllocation, useCustomerOrder } from '../../hooks/useAllocations'
import { useDrawerA11y } from '../../hooks/useDrawerA11y'
import { paths } from '../../routes/paths'
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
import type { ReasoningDecision } from '../../types/optimization'
import { ScoreBreakdownCards } from '../optimization/ScoreBreakdownCards'
import { AllocatedWarehouseTable, WarehouseScoreBreakdown } from './AllocatedWarehouseTable'

type AllocationDetailsDrawerProps = {
  allocationId: string | null
  preview?: Allocation | null
  isOpen: boolean
  onClose: () => void
}

const decisionColors: Record<
  ReasoningDecision,
  {
    label: string
    icon: typeof CheckCircle2
    badge: string
    card: string
    node: string
  }
> = {
  SELECTED: {
    label: 'Selected Candidate',
    icon: CheckCircle2,
    badge: 'bg-[#3FA66B]/15 text-[#3FA66B] border border-[#3FA66B]/30',
    card: 'border-[#3FA66B]/30 bg-[#3FA66B]/5',
    node: 'bg-[#3FA66B] text-black ring-4 ring-[#3FA66B]/20',
  },
  REJECTED: {
    label: 'Candidate Rejected',
    icon: XCircle,
    badge: 'bg-[#C95555]/15 text-[#C95555] border border-[#C95555]/30',
    card: 'border-[#262630] bg-[#1C1C21]/70',
    node: 'bg-[#C95555] text-white ring-2 ring-[#C95555]/20',
  },
  FILTERED: {
    label: 'Filtered Out',
    icon: Filter,
    badge: 'bg-[#71717A]/15 text-[#A1A1AA] border border-[#71717A]/30',
    card: 'border-[#202027] bg-[#17171B]',
    node: 'bg-[#71717A] text-white ring-2 ring-[#71717A]/20',
  },
  INFO: {
    label: 'Evaluation Step',
    icon: Info,
    badge: 'bg-[#C4622D]/15 text-[#C4622D] border border-[#C4622D]/30',
    card: 'border-[#202027] bg-[#1C1C21]/50',
    node: 'bg-[#C4622D] text-white ring-2 ring-[#C4622D]/20',
  },
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

  const shortAllocId = details ? formatShortId(details.id) : ''
  const shortOrderId = details ? formatShortId(details.orderId) : ''
  const split = details ? isSplitShipment(details) : false
  const totalUnits = details ? getTotalProductQuantity(details) : 0

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close allocation details"
        className="absolute inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <aside
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="allocation-details-title"
        className="relative z-10 flex h-full w-full max-w-2xl flex-col border-l border-[#262630] bg-[#17171B] text-[#F4F4F5] shadow-2xl"
      >
        {/* Header */}
        <header className="flex items-start justify-between border-b border-[#202027] p-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#71717A]">
                ALLOCATION AUDIT RECORD
              </span>
              <span className="text-[#262630]" aria-hidden="true">|</span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#3FA66B]/30 bg-[#3FA66B]/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-[#3FA66B]">
                <span className="size-1.5 rounded-full bg-[#3FA66B]" aria-hidden="true" />
                COMMITTED
              </span>
            </div>

            <h2
              id="allocation-details-title"
              className="font-display text-xl font-bold tracking-tight text-[#F4F4F5]"
            >
              Allocation #ALLOC-{shortAllocId}
            </h2>

            <p className="font-mono text-xs text-[#71717A]">
              UUID: <span className="text-[#A1A1AA]">{details?.id ?? '—'}</span>
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
          {isLoading && !details ? (
            <div className="flex h-48 flex-col items-center justify-center gap-3 text-[#71717A]">
              <Loader2 className="size-6 animate-spin text-[#C4622D]" aria-hidden="true" />
              <p className="font-mono text-xs">Querying allocation audit record...</p>
            </div>
          ) : null}

          {isError && !details ? (
            <div className="rounded-lg border border-[#C95555]/30 bg-[#C95555]/10 p-5 text-center">
              <AlertTriangle className="size-5 mx-auto text-[#C95555]" aria-hidden="true" />
              <h3 className="mt-2 font-display text-sm font-bold text-[#F4F4F5]">
                Unable to load allocation details
              </h3>
              <p className="mt-1 text-xs text-[#A1A1AA]">
                Could not retrieve details for this fulfillment decision.
              </p>
            </div>
          ) : null}

          {details ? (
            <>
              {/* 1. ALLOCATION & ORDER LINKAGE */}
              <section className="space-y-3">
                <h3 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#71717A]">
                  Order Linkage & Execution Timestamp
                </h3>

                <div className="rounded-lg border border-[#262630] bg-[#1C1C21] p-4 text-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[#71717A]">Linked Order</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold text-[#F4F4F5]">
                        #ORD-{shortOrderId}
                      </span>
                      <Link
                        to={paths.orders}
                        className="inline-flex items-center gap-1 font-mono text-[11px] text-[#C4622D] hover:text-[#9E4A20]"
                      >
                        <span>View Orders</span>
                        <ArrowRight className="size-2.5" />
                      </Link>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#71717A]">Order UUID</span>
                    <span className="font-mono text-[11px] text-[#A1A1AA]">{details.orderId}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#71717A]">Current Order Status</span>
                    <span className="font-mono text-[11px] font-medium text-[#F4F4F5]">
                      {isOrderLoading ? 'Loading…' : order?.status ?? 'ALLOCATED'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#71717A]">Committed Dispatch</span>
                    <span className="font-mono text-[#A1A1AA]">
                      {formatAllocationDate(details.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#71717A]">Network State Update</span>
                    <span className="font-mono text-[#A1A1AA]">
                      {formatAllocationDate(details.updatedAt)}
                    </span>
                  </div>
                </div>
              </section>

              {/* 2. DECISION CONTEXT & KEY KPI METRICS */}
              <section className="pt-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#71717A]">
                    Decision Context & Core Metrics
                  </h3>
                  <span className="font-mono text-[10px] text-[#3FA66B] flex items-center gap-1">
                    <ShieldCheck className="size-3" />
                    Verified Optimization
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {/* Freight */}
                  <div className="rounded-lg border border-[#202027] bg-[#1C1C21] p-3">
                    <div className="flex items-center gap-1 text-[#71717A]">
                      <IndianRupee className="size-3 text-[#C4622D]" />
                      <span className="font-mono text-[10px] uppercase">Freight</span>
                    </div>
                    <p className="mt-1 font-mono text-base font-bold text-[#F4F4F5]">
                      {formatAllocationCurrency(details.shippingCost)}
                    </p>
                    <span className="font-mono text-[10px] text-[#71717A]">Total carrier fee</span>
                  </div>

                  {/* ETA */}
                  <div className="rounded-lg border border-[#202027] bg-[#1C1C21] p-3">
                    <div className="flex items-center gap-1 text-[#71717A]">
                      <Clock3 className="size-3 text-[#3FA66B]" />
                      <span className="font-mono text-[10px] uppercase">Transit ETA</span>
                    </div>
                    <p className="mt-1 font-mono text-base font-bold text-[#F4F4F5]">
                      {formatAllocationEta(details.eta)}
                    </p>
                    <span className="font-mono text-[10px] text-[#71717A]">Door delivery</span>
                  </div>

                  {/* Score */}
                  <div className="rounded-lg border border-[#202027] bg-[#1C1C21] p-3">
                    <div className="flex items-center gap-1 text-[#71717A]">
                      <Target className="size-3 text-[#D08A35]" />
                      <span className="font-mono text-[10px] uppercase">Plan Score</span>
                    </div>
                    <p className="mt-1 font-mono text-base font-bold text-[#F4F4F5]">
                      {formatAllocationScore(details.score)}
                    </p>
                    <span className="font-mono text-[10px] text-[#71717A]">Composite index</span>
                  </div>

                  {/* Split */}
                  <div className="rounded-lg border border-[#202027] bg-[#1C1C21] p-3">
                    <div className="flex items-center gap-1 text-[#71717A]">
                      <Split className="size-3 text-[#A1A1AA]" />
                      <span className="font-mono text-[10px] uppercase">Shipment</span>
                    </div>
                    <p className="mt-1 font-mono text-base font-bold text-[#F4F4F5]">
                      {split ? 'Split' : 'Direct'}
                    </p>
                    <span className="font-mono text-[10px] text-[#71717A]">
                      {details.warehouses.length} facility
                    </span>
                  </div>
                </div>

                <div className="rounded-lg border border-[#202027] bg-[#1C1C21] p-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Cpu className="size-3.5 text-[#C4622D]" />
                    <span className="text-[#71717A]">Algorithmic Strategy:</span>
                    <span className="font-mono font-medium text-[#F4F4F5]">
                      {details.strategyName || 'Weighted Greedy Heuristic'}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-[#71717A]">
                    {totalUnits} committed units
                  </span>
                </div>
              </section>

              {/* 3. ASSIGNED WAREHOUSES TABLE */}
              <div className="pt-6">
                <AllocatedWarehouseTable warehouses={details.warehouses} />
              </div>

              {/* 4. PRODUCTS / INVENTORY ALLOCATED */}
              <section className="pt-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#71717A]">
                    Committed Inventory Line Items
                  </h3>
                  <span className="font-mono text-xs text-[#A1A1AA]">
                    {totalUnits} total units
                  </span>
                </div>

                <div className="overflow-hidden rounded-lg border border-[#262630] bg-[#1C1C21]">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#202027] bg-[#141417]">
                        <th scope="col" className="py-2.5 pl-3.5 pr-2 font-mono text-[10px] uppercase tracking-wider text-[#71717A]">
                          Product Item
                        </th>
                        <th scope="col" className="py-2.5 px-2 font-mono text-[10px] uppercase tracking-wider text-[#71717A]">
                          Category
                        </th>
                        <th scope="col" className="py-2.5 pl-2 pr-3.5 text-right font-mono text-[10px] uppercase tracking-wider text-[#71717A]">
                          Committed Qty
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#202027]">
                      {details.products && details.products.length > 0 ? (
                        details.products.map((entry) => (
                          <tr key={entry.product.id} className="hover:bg-[#202027]/40">
                            <td className="py-2.5 pl-3.5 pr-2">
                              <p className="font-medium text-[#F4F4F5]">{entry.product.name}</p>
                              <p className="font-mono text-[10px] text-[#71717A]">
                                SKU: {formatShortId(entry.product.id)} · {entry.product.weight} kg
                              </p>
                            </td>
                            <td className="py-2.5 px-2 font-mono text-[#A1A1AA]">
                              {entry.product.category || 'General'}
                            </td>
                            <td className="py-2.5 pl-2 pr-3.5 text-right font-mono text-sm font-semibold text-[#F4F4F5]">
                              {entry.quantity}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="py-3 px-3.5 text-center text-[#71717A]">
                            No dedicated product items returned.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* 5. OVERALL PLAN SCORE BREAKDOWN */}
              {details.scoreBreakdown ? (
                <div className="pt-6">
                  <ScoreBreakdownCards scoreBreakdown={details.scoreBreakdown} />
                </div>
              ) : null}

              {/* 6. PER-FACILITY SCORE BREAKDOWN */}
              <div className="pt-6">
                <WarehouseScoreBreakdown warehouses={details.warehouses} />
              </div>

              {/* 7. DECISION REASONING AUDIT TRAIL */}
              {details.reasoning && details.reasoning.length > 0 ? (
                <section className="pt-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#71717A]">
                        Optimization Decision Audit Trail
                      </h3>
                      <p className="mt-0.5 text-xs text-[#A1A1AA]">
                        Chronological step-by-step heuristic solver reasoning.
                      </p>
                    </div>
                    <span className="font-mono text-xs text-[#A1A1AA]">
                      {details.reasoning.length} steps
                    </span>
                  </div>

                  <ol className="space-y-2.5">
                    {details.reasoning.map((step, idx) => {
                      const cfg = decisionColors[step.decision] ?? decisionColors.INFO
                      const Icon = cfg.icon

                      return (
                        <li
                          key={idx}
                          className={`rounded-lg border p-3.5 text-xs transition-colors ${cfg.card}`}
                        >
                          <div className="flex items-center justify-between gap-2 border-b border-[#202027]/60 pb-2">
                            <div className="flex items-center gap-2">
                              <span
                                className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold ${cfg.badge}`}
                              >
                                <Icon className="size-3" />
                                {cfg.label}
                              </span>
                              <span className="font-mono text-[10px] text-[#71717A]">
                                Step {idx + 1}
                              </span>
                            </div>

                            {step.warehouseName && (
                              <span className="inline-flex items-center gap-1 font-mono text-[11px] text-[#F4F4F5] bg-[#141417] px-2 py-0.5 rounded border border-[#202027]">
                                <Warehouse className="size-3 text-[#71717A]" />
                                {step.warehouseName}
                              </span>
                            )}
                          </div>

                          <p className="mt-2 leading-relaxed text-[#F4F4F5]/90 font-sans">
                            {step.message}
                          </p>
                        </li>
                      )
                    })}
                  </ol>
                </section>
              ) : null}

              {/* 8. EXECUTION AUDIT STATUS */}
              <section className="pt-6">
                <div className="rounded-lg border border-[#3FA66B]/30 bg-[#3FA66B]/5 p-4 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-mono font-semibold text-[#3FA66B]">
                    <ShieldCheck className="size-4" />
                    <span>NETWORK STATE COMMITTED</span>
                  </div>
                  <p className="text-[#A1A1AA] leading-relaxed">
                    This allocation decision is immutable in the fulfillment history. Warehouse load counters and inventory reservations have been permanently committed to the fulfillment network.
                  </p>
                </div>
              </section>
            </>
          ) : null}
        </div>

        {/* Footer */}
        <footer className="border-t border-[#202027] p-4 flex items-center justify-between">
          <span className="font-mono text-[11px] text-[#71717A]">
            FulfillX Allocation Audit Console
          </span>

          <button
            type="button"
            onClick={onClose}
            className="rounded border border-[#262630] bg-[#1C1C21] px-4 py-2 font-mono text-xs font-medium text-[#F4F4F5] transition-colors hover:border-[#71717A] hover:bg-[#262630] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4622D]"
          >
            Close Audit
          </button>
        </footer>
      </aside>
    </div>
  )
}

