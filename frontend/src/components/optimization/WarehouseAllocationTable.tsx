import {
  formatAllocatedProducts,
  formatOptimizationCurrency,
  formatOptimizationEta,
  getTotalAllocatedQuantity,
} from '../../services/optimizationService'
import type { WarehouseCandidate } from '../../types/optimization'

type WarehouseAllocationTableProps = {
  candidates: WarehouseCandidate[]
  productNamesById: Record<string, string>
}

export function WarehouseAllocationTable({
  candidates,
  productNamesById,
}: WarehouseAllocationTableProps) {
  if (candidates.length === 0) {
    return (
      <section className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center shadow-sm">
        <p className="text-sm text-slate-500">No warehouse allocations returned.</p>
      </section>
    )
  }

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-lg font-semibold text-slate-900">Warehouse Allocation</h2>
        <p className="mt-1 text-sm text-slate-500">Products allocated per warehouse with cost and ETA.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left font-medium text-slate-600">
                Warehouse
              </th>
              <th scope="col" className="px-4 py-3 text-left font-medium text-slate-600">
                Products Allocated
              </th>
              <th scope="col" className="px-4 py-3 text-right font-medium text-slate-600">
                Quantity
              </th>
              <th scope="col" className="px-4 py-3 text-right font-medium text-slate-600">
                Shipping Cost
              </th>
              <th scope="col" className="px-4 py-3 text-right font-medium text-slate-600">
                ETA
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {candidates.map((candidate) => (
              <tr key={candidate.warehouseId} className="hover:bg-slate-50/80">
                <td className="px-4 py-3 font-medium text-slate-900">{candidate.warehouseName}</td>
                <td className="px-4 py-3 text-slate-700">
                  {formatAllocatedProducts(candidate.allocatedQuantitiesByProductId, productNamesById)}
                </td>
                <td className="px-4 py-3 text-right text-slate-700">
                  {getTotalAllocatedQuantity(candidate.allocatedQuantitiesByProductId)}
                </td>
                <td className="px-4 py-3 text-right text-slate-700">
                  {formatOptimizationCurrency(candidate.shippingCost)}
                </td>
                <td className="px-4 py-3 text-right text-slate-700">
                  {formatOptimizationEta(candidate.estimatedDeliveryHours)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
