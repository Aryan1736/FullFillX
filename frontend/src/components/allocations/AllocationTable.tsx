import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ArrowRight,
  Eye,
  IndianRupee,
  Split,
  Warehouse,
} from 'lucide-react'

import {
  formatAllocationCurrency,
  formatAllocationDate,
  formatShortId,
  getTotalProductQuantity,
  isSplitShipment,
} from '../../services/allocationService'
import type { Allocation, AllocationSort, AllocationSortField } from '../../types/allocation'
import { handleRowKeyDown } from '../../utils/keyboard'
import { cn } from '../../utils/cn'

type AllocationTableProps = {
  allocations: Allocation[]
  sort: AllocationSort
  onSortChange: (field: AllocationSortField) => void
  onViewDetails: (allocation: Allocation) => void
}

function SortButton({
  label,
  field,
  sort,
  onSortChange,
  align = 'left',
}: {
  label: string
  field: AllocationSortField
  sort: AllocationSort
  onSortChange: (field: AllocationSortField) => void
  align?: 'left' | 'right'
}) {
  const isActive = sort.field === field
  const Icon = !isActive ? ArrowUpDown : sort.direction === 'asc' ? ArrowUp : ArrowDown

  return (
    <button
      type="button"
      onClick={() => onSortChange(field)}
      className={cn(
        'inline-flex items-center gap-1 font-mono text-[11px] font-semibold uppercase tracking-wider transition-colors hover:text-[#F4F4F5] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C4622D] rounded px-1 py-0.5',
        isActive ? 'text-[#C4622D]' : 'text-[#71717A]',
        align === 'right' && 'flex-row-reverse',
      )}
      aria-label={`Sort by ${label}, ${isActive ? sort.direction : 'not sorted'}`}
    >
      <span>{label}</span>
      <Icon className={cn('size-3', isActive ? 'text-[#C4622D]' : 'text-[#71717A]')} aria-hidden="true" />
    </button>
  )
}

export function AllocationTable({
  allocations,
  sort,
  onSortChange,
  onViewDetails,
}: AllocationTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#262630] bg-[#17171B] shadow-xl">
      {/* DESKTOP & TABLET OPERATIONAL TABLE */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#202027] bg-[#141417]">
              <th
                scope="col"
                className="py-3.5 pl-5 pr-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#71717A]"
              >
                Allocation
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#71717A]"
              >
                Order
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#71717A]"
              >
                Warehouse
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-right font-mono text-[11px] font-semibold uppercase tracking-wider text-[#71717A]"
              >
                Units
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-right font-mono text-[11px] font-semibold uppercase tracking-wider text-[#71717A]"
              >
                <div className="flex justify-end">
                  <SortButton
                    label="Freight"
                    field="shippingCost"
                    sort={sort}
                    onSortChange={onSortChange}
                    align="right"
                  />
                </div>
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#71717A]"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#71717A]"
              >
                <SortButton
                  label="Created"
                  field="createdAt"
                  sort={sort}
                  onSortChange={onSortChange}
                />
              </th>
              <th
                scope="col"
                className="py-3.5 pl-3 pr-5 text-right font-mono text-[11px] font-semibold uppercase tracking-wider text-[#71717A]"
              >
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#202027]">
            {allocations.map((allocation) => {
              const split = isSplitShipment(allocation)
              const totalUnits = getTotalProductQuantity(allocation)
              const shortAllocId = formatShortId(allocation.id)
              const shortOrderId = formatShortId(allocation.orderId)

              return (
                <tr
                  key={allocation.id}
                  tabIndex={0}
                  role="button"
                  aria-label={`View allocation for order #ORD-${shortOrderId}`}
                  className="group cursor-pointer transition-colors duration-150 hover:bg-[#1C1C21]/70 focus-visible:bg-[#1C1C21]/90 focus-visible:outline-none"
                  onClick={() => onViewDetails(allocation)}
                  onKeyDown={(event) => handleRowKeyDown(event, () => onViewDetails(allocation))}
                >
                  {/* ALLOCATION ID */}
                  <td className="py-3.5 pl-5 pr-3 whitespace-nowrap">
                    <span className="font-mono text-xs font-bold text-[#F4F4F5] group-hover:text-[#C4622D] transition-colors">
                      ALLOC-{shortAllocId}
                    </span>
                  </td>

                  {/* ORDER ID */}
                  <td className="px-3 py-3.5 whitespace-nowrap">
                    <span className="font-mono text-xs text-[#A1A1AA]">
                      #ORD-{shortOrderId}
                    </span>
                  </td>

                  {/* WAREHOUSES */}
                  <td className="px-3 py-3.5">
                    <div className="flex flex-wrap items-center gap-1.5 max-w-xs">
                      {allocation.warehouses.map((wh, idx) => (
                        <span
                          key={wh.warehouse?.id ?? idx}
                          className="inline-flex items-center gap-1 rounded border border-[#262630] bg-[#141417] px-2 py-0.5 text-xs font-medium text-[#F4F4F5]"
                        >
                          <Warehouse className="size-2.5 text-[#71717A]" />
                          <span className="truncate max-w-[120px] lg:max-w-none">
                            {wh.warehouse?.name ?? 'Facility'}
                          </span>
                        </span>
                      ))}

                      {split && (
                        <span className="inline-flex items-center gap-1 rounded border border-[#C4622D]/30 bg-[#C4622D]/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[#C4622D]">
                          <Split className="size-2.5" />
                          Split
                        </span>
                      )}
                    </div>
                  </td>

                  {/* UNITS */}
                  <td className="px-3 py-3.5 text-right whitespace-nowrap">
                    <span className="font-mono text-xs text-[#A1A1AA]">
                      {totalUnits} {totalUnits === 1 ? 'unit' : 'units'}
                    </span>
                  </td>

                  {/* FREIGHT */}
                  <td className="px-3 py-3.5 text-right whitespace-nowrap">
                    <span className="font-mono text-xs font-bold text-[#F4F4F5] inline-flex items-center">
                      <IndianRupee className="size-3 text-[#71717A]" />
                      {formatAllocationCurrency(allocation.shippingCost).replace('₹', '')}
                    </span>
                  </td>

                  {/* STATUS */}
                  <td className="px-3 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-medium text-[#3FA66B]">
                        <span className="size-1.5 rounded-full bg-[#3FA66B]" aria-hidden="true" />
                        COMMITTED
                      </span>
                      {allocation.strategyName && (
                        <span className="hidden xl:inline-block font-mono text-[10px] text-[#71717A] bg-[#141417] px-1.5 py-0.5 rounded border border-[#202027]">
                          {allocation.strategyName}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* CREATED */}
                  <td className="px-3 py-3.5 whitespace-nowrap font-mono text-xs text-[#71717A]">
                    {formatAllocationDate(allocation.createdAt)}
                  </td>

                  {/* ACTION */}
                  <td className="py-3.5 pl-3 pr-5 text-right whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 font-mono text-xs font-medium text-[#A1A1AA] transition-transform group-hover:text-[#F4F4F5] group-hover:translate-x-0.5">
                      <span>View</span>
                      <ArrowRight className="size-3 text-[#71717A]" />
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* MOBILE VERTICAL ALLOCATION CARDS */}
      <div className="divide-y divide-[#202027] md:hidden">
        {allocations.map((allocation) => {
          const split = isSplitShipment(allocation)
          const totalUnits = getTotalProductQuantity(allocation)
          const shortAllocId = formatShortId(allocation.id)
          const shortOrderId = formatShortId(allocation.orderId)

          return (
            <article
              key={allocation.id}
              tabIndex={0}
              role="button"
              onClick={() => onViewDetails(allocation)}
              onKeyDown={(event) => handleRowKeyDown(event, () => onViewDetails(allocation))}
              className="p-4 bg-[#17171B] transition-colors hover:bg-[#1C1C21] cursor-pointer"
            >
              {/* Card Header: Allocation ID & Status */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-mono text-xs font-bold text-[#F4F4F5]">
                    ALLOC-{shortAllocId}
                  </span>
                  <p className="mt-0.5 font-mono text-[11px] text-[#A1A1AA]">
                    #ORD-{shortOrderId}
                  </p>
                </div>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#3FA66B]/30 bg-[#3FA66B]/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-[#3FA66B]">
                  <span className="size-1.5 rounded-full bg-[#3FA66B]" aria-hidden="true" />
                  COMMITTED
                </span>
              </div>

              {/* Warehouse facilities */}
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                {allocation.warehouses.map((wh, idx) => (
                  <span
                    key={wh.warehouse?.id ?? idx}
                    className="inline-flex items-center gap-1 rounded border border-[#262630] bg-[#141417] px-2 py-0.5 text-xs text-[#F4F4F5]"
                  >
                    <Warehouse className="size-2.5 text-[#71717A]" />
                    <span>{wh.warehouse?.name ?? 'Facility'}</span>
                  </span>
                ))}
                {split && (
                  <span className="inline-flex items-center gap-1 rounded border border-[#C4622D]/30 bg-[#C4622D]/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[#C4622D]">
                    <Split className="size-2.5" />
                    Split
                  </span>
                )}
              </div>

              {/* Units, Freight, Created Grid */}
              <div className="mt-3 grid grid-cols-3 gap-2 border-t border-[#202027] pt-2.5 font-mono text-xs">
                <div>
                  <span className="text-[10px] uppercase text-[#71717A]">Units</span>
                  <p className="text-[#A1A1AA]">{totalUnits}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-[#71717A]">Freight</span>
                  <p className="text-[#F4F4F5] font-bold">
                    {formatAllocationCurrency(allocation.shippingCost)}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-[#71717A]">Committed</span>
                  <p className="text-[#71717A] truncate">
                    {formatAllocationDate(allocation.createdAt)}
                  </p>
                </div>
              </div>

              {/* View details */}
              <div className="mt-3 flex items-center justify-end pt-2 border-t border-[#202027]">
                <span className="inline-flex items-center gap-1 font-mono text-xs font-medium text-[#C4622D]">
                  <Eye className="size-3" />
                  <span>View Details &rarr;</span>
                </span>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}

