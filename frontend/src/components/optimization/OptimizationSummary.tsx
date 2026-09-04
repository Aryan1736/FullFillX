import { CheckCircle2, Clock3, IndianRupee, Loader2, Package, Play, Split, Target, Warehouse } from 'lucide-react'

import {
  formatOptimizationCurrency,
  formatOptimizationEta,
  formatScore,
  isSplitShipment,
} from '../../services/optimizationService'
import type { OptimizationResult } from '../../types/optimization'
import { Button } from '../common/Button'
import { KpiCard } from '../dashboard/KpiCard'

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
  const selectedWarehouseNames = result.selectedWarehouses
    .map((warehouseId) => warehouseNamesById[warehouseId] ?? warehouseId)
    .join(', ')

  const splitShipment = isSplitShipment(result.selectedWarehouses)

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Optimization Summary</h2>
          <p className="mt-1 text-sm text-slate-500">
            Strategy: <span className="font-medium text-slate-700">{result.strategyName}</span>
          </p>
        </div>

        {onExecute ? (
          <div>
            {isExecuted ? (
              <div className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3.5 py-2 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-600/20">
                <CheckCircle2 className="size-4 text-emerald-600" aria-hidden="true" />
                Allocation Committed
              </div>
            ) : (
              <Button
                variant="primary"
                onClick={onExecute}
                disabled={isExecuting || result.warehouseCandidates.length === 0}
                leftIcon={
                  isExecuting ? (
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <Play className="size-4" aria-hidden="true" />
                  )
                }
              >
                {isExecuting ? 'Committing...' : 'Commit & Execute Allocation'}
              </Button>
            )}
          </div>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <KpiCard
          title="Total Score"
          value={formatScore(result.optimizationScore)}
          icon={Target}
          description={`Estimated savings ${formatOptimizationCurrency(result.estimatedSavings)}`}
        />
        <KpiCard
          title="Shipping Cost"
          value={formatOptimizationCurrency(result.totalShippingCost)}
          icon={IndianRupee}
        />
        <KpiCard
          title="ETA"
          value={formatOptimizationEta(result.estimatedDeliveryHours)}
          icon={Clock3}
        />
        <KpiCard
          title="Selected Warehouses"
          value={String(result.selectedWarehouses.length)}
          icon={Warehouse}
          description={selectedWarehouseNames || 'None selected'}
        />
        <KpiCard
          title="Split Shipment"
          value={splitShipment ? 'Yes' : 'No'}
          icon={Split}
          description={splitShipment ? 'Order fulfilled from multiple warehouses' : 'Single warehouse fulfillment'}
        />
        <KpiCard
          title="Allocated Lines"
          value={String(result.warehouseCandidates.length)}
          icon={Package}
          description="Warehouse allocation rows"
        />
      </div>
    </section>
  )
}
