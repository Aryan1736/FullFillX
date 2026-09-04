import {
  CheckCircle2,
  Loader2,
  Play,
  ShieldCheck,
  Split,
  Warehouse,
} from 'lucide-react'


import {
  formatOptimizationCurrency,
  formatOptimizationEta,
  formatScore,
  isSplitShipment,
} from '../../services/optimizationService'
import type { OptimizationResult } from '../../types/optimization'
import { Button } from '../common/Button'

type OptimizationSummaryProps = {
  result: OptimizationResult
  warehouseNamesById: Record<string, string>
  onExecute?: () => void
  isExecuting?: boolean
  isExecuted?: boolean
}

export function OptimizationSummary({
  result,
  warehouseNamesById,
  onExecute,
  isExecuting = false,
  isExecuted = false,
}: OptimizationSummaryProps) {
  const selectedWarehouseNames = result.selectedWarehouses.map(
    (warehouseId) => warehouseNamesById[warehouseId] ?? warehouseId,
  )

  const splitShipment = isSplitShipment(result.selectedWarehouses)

  return (
    <section className="space-y-4">
      {/* Dominant Winning Recommendation Hero Card */}
      <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900 p-6 text-white shadow-sm">
        <div>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-medium text-emerald-300">
                  <ShieldCheck className="size-3.5 text-emerald-400" />
                  Optimal Allocation Recommendation
                </span>
                <span className="inline-flex items-center rounded-md bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-300">
                  {result.strategyName}
                </span>
              </div>
              <h2 className="mt-2 text-xl font-bold tracking-tight text-white">
                Recommended Fulfillment Plan
              </h2>
              <p className="mt-0.5 text-xs text-slate-400">
                Minimized total shipping cost, shortest transit ETA, and optimal node capacity.
              </p>
            </div>

            {onExecute ? (
              <div className="shrink-0">
                {isExecuted ? (
                  <div className="inline-flex items-center gap-2 rounded-lg bg-emerald-500/20 px-4 py-2.5 text-sm font-semibold text-emerald-300 border border-emerald-500/40">
                    <CheckCircle2 className="size-4 text-emerald-400" aria-hidden="true" />
                    Allocation Committed to Network
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={onExecute}
                    disabled={isExecuting || result.warehouseCandidates.length === 0}
                    className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-medium shadow-sm"
                    leftIcon={
                      isExecuting ? (
                        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                      ) : (
                        <Play className="size-4 fill-current" aria-hidden="true" />
                      )
                    }
                  >
                    {isExecuting ? 'Committing Allocation…' : 'Commit & Execute Allocation'}
                  </Button>
                )}
              </div>
            ) : null}
          </div>

          {/* Primary Metrics Banner Inside Hero */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 border-t border-white/10 pt-5">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Composite Score
              </span>
              <p className="mt-1 font-mono text-2xl font-bold text-white sm:text-3xl">
                {formatScore(result.optimizationScore)}
                <span className="text-xs font-normal text-slate-400">/100</span>
              </p>
              <p className="mt-0.5 text-[11px] text-emerald-300 font-medium">
                Savings: {formatOptimizationCurrency(result.estimatedSavings ?? 0)}
              </p>
            </div>

            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Total Shipping Cost
              </span>
              <p className="mt-1 font-mono text-2xl font-bold text-white sm:text-3xl">
                {formatOptimizationCurrency(result.totalShippingCost)}
              </p>
              <p className="mt-0.5 text-[11px] text-slate-400">Optimal carrier route</p>
            </div>

            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Delivery ETA
              </span>
              <p className="mt-1 font-mono text-2xl font-bold text-white sm:text-3xl">
                {formatOptimizationEta(result.estimatedDeliveryHours)}
              </p>
              <p className="mt-0.5 text-[11px] text-slate-400">Target transit speed</p>
            </div>

            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Consolidation
              </span>
              <p className="mt-1 font-mono text-2xl font-bold text-white sm:text-3xl">
                {splitShipment ? 'Split' : 'Single Hub'}
              </p>
              <p className="mt-0.5 text-[11px] text-slate-400">
                {result.selectedWarehouses.length} warehouse(s) involved
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Decision Context Panels */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Selected Hubs Breakdown */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <Warehouse className="size-4 text-indigo-600" />
            <span>Assigned Warehouses ({result.selectedWarehouses.length})</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedWarehouseNames.length > 0 ? (
              selectedWarehouseNames.map((name, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200/80 bg-indigo-50/80 px-3 py-1.5 text-xs font-semibold text-indigo-900"
                >
                  <Warehouse className="size-3.5 text-indigo-600" />
                  {name}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-500">No warehouse selected</span>
            )}
          </div>
        </div>

        {/* Multi-Hop / Split Shipment Status */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <Split className="size-4 text-violet-600" />
            <span>Shipment Packaging Mode</span>
          </div>
          <p className="mt-2 text-sm font-semibold text-slate-900">
            {splitShipment
              ? 'Multi-Warehouse Split Fulfillment'
              : 'Direct Single-Facility Dispatch'}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {splitShipment
              ? 'Order demands multiple facility nodes to satisfy complete SKU inventory quantities.'
              : 'All requested items consolidated from a single facility with zero package fragmentation.'}
          </p>
        </div>
      </div>
    </section>
  )
}
