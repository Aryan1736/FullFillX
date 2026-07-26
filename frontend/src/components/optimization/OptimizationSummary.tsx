import { Clock3, IndianRupee, Package, Split, Target, Warehouse } from 'lucide-react'

import {
  formatOptimizationCurrency,
  formatOptimizationEta,
  formatScore,
  isSplitShipment,
} from '../../services/optimizationService'
import type { OptimizationResult } from '../../types/optimization'
import { KpiCard } from '../dashboard/KpiCard'

type OptimizationSummaryProps = {
  result: OptimizationResult
  warehouseNamesById: Record<string, string>
}

export function OptimizationSummary({ result, warehouseNamesById }: OptimizationSummaryProps) {
  const selectedWarehouseNames = result.selectedWarehouses
    .map((warehouseId) => warehouseNamesById[warehouseId] ?? warehouseId)
    .join(', ')

  const splitShipment = isSplitShipment(result.selectedWarehouses)

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900">Optimization Summary</h2>
        <p className="mt-1 text-sm text-slate-500">
          Strategy: <span className="font-medium text-slate-700">{result.strategyName}</span>
        </p>
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
