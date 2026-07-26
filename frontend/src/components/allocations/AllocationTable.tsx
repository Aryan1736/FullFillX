import {
  formatAllocationCurrency,
  formatAllocationDate,
  formatAllocationEta,
  formatAllocationScore,
  formatShortId,
  getWarehouseNames,
} from '../../services/allocationService'
import type { Allocation, AllocationSort, AllocationSortField } from '../../types/allocation'
import { handleRowKeyDown } from '../../utils/keyboard'
import { SortableHeader } from '../common/SortableHeader'

type AllocationTableProps = {
  allocations: Allocation[]
  sort: AllocationSort
  onSortChange: (field: AllocationSortField) => void
  onViewDetails: (allocation: Allocation) => void
}

export function AllocationTable({
  allocations,
  sort,
  onSortChange,
  onViewDetails,
}: AllocationTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <SortableHeader
                label="Date"
                field="createdAt"
                sort={sort}
                onSortChange={onSortChange}
                className="px-4 py-3 text-left text-xs uppercase tracking-wide"
              />
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600"
              >
                Order
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600"
              >
                Warehouses
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600"
              >
                Strategy
              </th>
              <SortableHeader
                label="Score"
                field="score"
                sort={sort}
                onSortChange={onSortChange}
                className="px-4 py-3 text-left text-xs uppercase tracking-wide"
              />
              <SortableHeader
                label="Shipping"
                field="shippingCost"
                sort={sort}
                onSortChange={onSortChange}
                className="px-4 py-3 text-left text-xs uppercase tracking-wide"
              />
              <SortableHeader
                label="ETA"
                field="eta"
                sort={sort}
                onSortChange={onSortChange}
                className="px-4 py-3 text-left text-xs uppercase tracking-wide"
              />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {allocations.map((allocation) => (
              <tr
                key={allocation.id}
                tabIndex={0}
                role="button"
                aria-label={`View allocation for order ${formatShortId(allocation.orderId)}`}
                className="cursor-pointer transition-colors hover:bg-slate-50"
                onClick={() => onViewDetails(allocation)}
                onKeyDown={(event) => handleRowKeyDown(event, () => onViewDetails(allocation))}
              >
                <td className="px-4 py-3 text-sm text-slate-700">
                  {formatAllocationDate(allocation.createdAt)}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-slate-900">
                  {formatShortId(allocation.orderId)}
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">{getWarehouseNames(allocation)}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{allocation.strategyName || '—'}</td>
                <td className="px-4 py-3 text-sm text-slate-700">
                  {formatAllocationScore(allocation.score)}
                </td>
                <td className="px-4 py-3 text-sm text-slate-700">
                  {formatAllocationCurrency(allocation.shippingCost)}
                </td>
                <td className="px-4 py-3 text-sm text-slate-700">
                  {formatAllocationEta(allocation.eta)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
