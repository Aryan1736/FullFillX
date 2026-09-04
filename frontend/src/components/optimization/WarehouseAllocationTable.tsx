import { Clock, IndianRupee, Package, Warehouse } from 'lucide-react'

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
      <section className="rounded-xl border border-dashed border-[#262630] bg-[#17171B] p-6 text-center shadow-sm">
        <p className="font-mono text-xs text-[#71717A]">No warehouse allocations returned.</p>
      </section>
    )
  }

  return (
    <section className="overflow-hidden rounded-xl border border-[#262630] bg-[#17171B] shadow-sm">
      <div className="border-b border-[#202027] px-5 py-4 flex items-center justify-between">
        <div>
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#71717A]">
            DISPATCH PARTITIONING
          </span>
          <h3 className="font-display text-sm font-bold text-[#F4F4F5] mt-0.5">
            Assigned Facility Allocations
          </h3>
          <p className="mt-0.5 text-xs text-[#A1A1AA]">
            SKU lines partitioned per warehouse hub with associated landed freight and road transit ETA.
          </p>
        </div>
        <span className="font-mono text-xs font-semibold text-[#A1A1AA] bg-[#1C1C21] border border-[#262630] px-2.5 py-1 rounded">
          {candidates.length} Hub{candidates.length === 1 ? '' : 's'} Assigned
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#202027] text-left">
          <thead className="bg-[#1C1C21]">
            <tr>
              <th scope="col" className="px-4 py-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#71717A]">
                Fulfillment Hub
              </th>
              <th scope="col" className="px-4 py-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#71717A]">
                SKUs Allocated
              </th>
              <th scope="col" className="px-4 py-3 text-right font-mono text-[11px] font-semibold uppercase tracking-wider text-[#71717A]">
                Total Units
              </th>
              <th scope="col" className="px-4 py-3 text-right font-mono text-[11px] font-semibold uppercase tracking-wider text-[#71717A]">
                Freight Cost
              </th>
              <th scope="col" className="px-4 py-3 text-right font-mono text-[11px] font-semibold uppercase tracking-wider text-[#71717A]">
                Transit ETA
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#202027] bg-[#17171B]">
            {candidates.map((candidate) => (
              <tr key={candidate.warehouseId} className="hover:bg-[#1C1C21]/60 transition-colors">
                <td className="whitespace-nowrap px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="flex size-7 shrink-0 items-center justify-center rounded bg-[#1C1C21] border border-[#262630] text-[#C4622D]">
                      <Warehouse className="size-3.5" />
                    </div>
                    <span className="font-medium text-xs text-[#F4F4F5]">{candidate.warehouseName}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <span className="inline-flex items-center gap-1.5 rounded border border-[#262630] bg-[#1C1C21] px-2.5 py-1 font-mono text-xs text-[#A1A1AA]">
                    <Package className="size-3 text-[#71717A]" />
                    {formatAllocatedProducts(candidate.allocatedQuantitiesByProductId, productNamesById)}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 text-right font-mono text-xs font-semibold text-[#F4F4F5]">
                  {getTotalAllocatedQuantity(candidate.allocatedQuantitiesByProductId)} units
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 text-right font-mono text-xs font-bold text-[#F4F4F5]">
                  <span className="inline-flex items-center gap-0.5">
                    <IndianRupee className="size-3 text-[#C4622D]" />
                    {formatOptimizationCurrency(candidate.shippingCost).replace('₹', '')}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 text-right font-mono text-xs text-[#A1A1AA]">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="size-3 text-[#71717A]" />
                    {formatOptimizationEta(candidate.estimatedDeliveryHours)}
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
