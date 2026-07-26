import {
  formatAllocationCurrency,
  formatAllocationEta,
  formatAllocationScore,
} from '../../services/allocationService'
import type { AllocatedWarehouse } from '../../types/allocation'

type AllocatedWarehouseTableProps = {
  warehouses: AllocatedWarehouse[]
}

export function AllocatedWarehouseTable({ warehouses }: AllocatedWarehouseTableProps) {
  if (warehouses.length === 0) {
    return (
      <section className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center shadow-sm">
        <p className="text-sm text-slate-500">No warehouse allocations recorded.</p>
      </section>
    )
  }

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h3 className="text-base font-semibold text-slate-900">Selected Warehouses</h3>
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
                Products
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
            {warehouses.map((entry) => (
              <tr key={entry.warehouse?.id ?? entry.products.map((p) => p.product.id).join('-')}>
                <td className="px-4 py-3 font-medium text-slate-900">
                  {entry.warehouse?.name ?? 'Unknown warehouse'}
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {entry.products.length === 0
                    ? '—'
                    : entry.products
                        .map((productEntry) => `${productEntry.product.name} (${productEntry.quantity})`)
                        .join(', ')}
                </td>
                <td className="px-4 py-3 text-right text-slate-700">
                  {formatAllocationCurrency(entry.shippingCost)}
                </td>
                <td className="px-4 py-3 text-right text-slate-700">
                  {formatAllocationEta(entry.eta)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

type WarehouseScoreBreakdownProps = {
  warehouses: AllocatedWarehouse[]
}

export function WarehouseScoreBreakdown({ warehouses }: WarehouseScoreBreakdownProps) {
  const entries = warehouses.filter((entry) => entry.scoreBreakdown != null)

  if (entries.length === 0) {
    return null
  }

  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-base font-semibold text-slate-900">Per-Warehouse Score Breakdown</h3>
        <p className="mt-1 text-sm text-slate-500">Candidate scoring factors for each selected warehouse.</p>
      </div>

      <div className="grid gap-4">
        {entries.map((entry) => (
          <div
            key={entry.warehouse?.id ?? entry.products.map((p) => p.product.id).join('-')}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <p className="text-sm font-medium text-slate-900">
              {entry.warehouse?.name ?? 'Unknown warehouse'}
            </p>
            <dl className="mt-3 grid gap-2 sm:grid-cols-2">
              <div className="flex justify-between gap-4 text-sm">
                <dt className="text-slate-500">Distance</dt>
                <dd className="font-medium text-slate-900">
                  {formatAllocationScore(entry.scoreBreakdown!.distanceScore)}
                </dd>
              </div>
              <div className="flex justify-between gap-4 text-sm">
                <dt className="text-slate-500">Shipping</dt>
                <dd className="font-medium text-slate-900">
                  {formatAllocationScore(entry.scoreBreakdown!.shippingCostScore)}
                </dd>
              </div>
              <div className="flex justify-between gap-4 text-sm">
                <dt className="text-slate-500">Inventory</dt>
                <dd className="font-medium text-slate-900">
                  {formatAllocationScore(entry.scoreBreakdown!.inventoryScore)}
                </dd>
              </div>
              <div className="flex justify-between gap-4 text-sm">
                <dt className="text-slate-500">Load</dt>
                <dd className="font-medium text-slate-900">
                  {formatAllocationScore(entry.scoreBreakdown!.warehouseLoadScore)}
                </dd>
              </div>
              <div className="flex justify-between gap-4 text-sm sm:col-span-2">
                <dt className="text-slate-500">Total</dt>
                <dd className="font-semibold text-slate-900">
                  {formatAllocationScore(entry.scoreBreakdown!.totalScore)}
                </dd>
              </div>
            </dl>
          </div>
        ))}
      </div>
    </section>
  )
}
