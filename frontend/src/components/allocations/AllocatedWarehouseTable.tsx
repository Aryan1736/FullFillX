import { IndianRupee, Truck } from 'lucide-react'
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
      <section className="rounded-lg border border-dashed border-[#262630] bg-[#1C1C21]/60 p-6 text-center">
        <p className="text-xs text-[#71717A]">No warehouse allocations recorded.</p>
      </section>
    )
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#71717A]">
          Assigned Warehouse Facilities
        </h3>
        <span className="font-mono text-xs text-[#A1A1AA]">
          {warehouses.length} {warehouses.length === 1 ? 'facility' : 'facilities'}
        </span>
      </div>

      <div className="overflow-hidden rounded-lg border border-[#262630] bg-[#1C1C21]">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#202027] bg-[#141417]">
              <th scope="col" className="py-2.5 pl-3.5 pr-2 font-mono text-[10px] uppercase tracking-wider text-[#71717A]">
                Warehouse Hub
              </th>
              <th scope="col" className="py-2.5 px-2 font-mono text-[10px] uppercase tracking-wider text-[#71717A]">
                Committed SKUs
              </th>
              <th scope="col" className="py-2.5 px-2 text-right font-mono text-[10px] uppercase tracking-wider text-[#71717A]">
                Freight
              </th>
              <th scope="col" className="py-2.5 pl-2 pr-3.5 text-right font-mono text-[10px] uppercase tracking-wider text-[#71717A]">
                ETA
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#202027]">
            {warehouses.map((entry) => (
              <tr
                key={entry.warehouse?.id ?? entry.products.map((p) => p.product.id).join('-')}
                className="hover:bg-[#202027]/40 transition-colors"
              >
                <td className="py-2.5 pl-3.5 pr-2 align-top">
                  <p className="font-medium text-[#F4F4F5]">
                    {entry.warehouse?.name ?? 'Assigned Facility'}
                  </p>
                  {entry.warehouse?.city && (
                    <p className="font-mono text-[10px] text-[#71717A]">
                      {entry.warehouse.city}
                    </p>
                  )}
                </td>
                <td className="py-2.5 px-2 text-[#A1A1AA] align-top">
                  {entry.products.length === 0 ? (
                    <span className="text-[#71717A]">—</span>
                  ) : (
                    <div className="space-y-1">
                      {entry.products.map((productEntry) => (
                        <div
                          key={productEntry.product.id}
                          className="flex items-center gap-1.5 font-mono text-[11px]"
                        >
                          <span className="font-semibold text-[#F4F4F5]">{productEntry.quantity}×</span>
                          <span className="text-[#A1A1AA] truncate max-w-[140px] sm:max-w-none">
                            {productEntry.product.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </td>
                <td className="py-2.5 px-2 text-right font-mono text-xs font-semibold text-[#F4F4F5] align-top whitespace-nowrap">
                  <span className="inline-flex items-center">
                    <IndianRupee className="size-3 text-[#71717A]" />
                    {formatAllocationCurrency(entry.shippingCost).replace('₹', '')}
                  </span>
                </td>
                <td className="py-2.5 pl-2 pr-3.5 text-right font-mono text-xs text-[#A1A1AA] align-top whitespace-nowrap">
                  <span className="inline-flex items-center gap-1">
                    <Truck className="size-3 text-[#71717A]" />
                    {formatAllocationEta(entry.eta)}
                  </span>
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
    <section className="space-y-3">
      <div>
        <h3 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#71717A]">
          Facility Score Breakdown
        </h3>
        <p className="mt-0.5 text-xs text-[#A1A1AA]">
          Sub-objective factor scores evaluated for each selected facility.
        </p>
      </div>

      <div className="grid gap-3">
        {entries.map((entry) => (
          <div
            key={entry.warehouse?.id ?? entry.products.map((p) => p.product.id).join('-')}
            className="rounded-lg border border-[#202027] bg-[#1C1C21] p-4 text-xs space-y-2.5"
          >
            <div className="flex items-center justify-between border-b border-[#202027] pb-2">
              <span className="font-medium text-[#F4F4F5]">
                {entry.warehouse?.name ?? 'Candidate Facility'}
              </span>
              <span className="font-mono text-[11px] font-bold text-[#3FA66B]">
                Total: {formatAllocationScore(entry.scoreBreakdown!.totalScore)}
              </span>
            </div>

            <dl className="grid grid-cols-2 gap-2 font-mono text-[11px]">
              <div className="flex justify-between gap-2">
                <dt className="text-[#71717A]">Distance</dt>
                <dd className="font-medium text-[#F4F4F5]">
                  {formatAllocationScore(entry.scoreBreakdown!.distanceScore)}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-[#71717A]">Freight Cost</dt>
                <dd className="font-medium text-[#F4F4F5]">
                  {formatAllocationScore(entry.scoreBreakdown!.shippingCostScore)}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-[#71717A]">Inventory Buffer</dt>
                <dd className="font-medium text-[#F4F4F5]">
                  {formatAllocationScore(entry.scoreBreakdown!.inventoryScore)}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-[#71717A]">Facility Load</dt>
                <dd className="font-medium text-[#F4F4F5]">
                  {formatAllocationScore(entry.scoreBreakdown!.warehouseLoadScore)}
                </dd>
              </div>
            </dl>
          </div>
        ))}
      </div>
    </section>
  )
}

