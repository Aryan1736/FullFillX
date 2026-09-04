import { Warehouse } from 'lucide-react'
import type { Allocation } from '../../types/allocation'

type AllocationDistributionProps = {
  allocations: Allocation[]
  selectedWarehouseId?: string
  onSelectWarehouse?: (warehouseId: string) => void
}

type WarehouseRank = {
  id: string
  name: string
  city?: string
  allocationCount: number
  totalUnits: number
}

export function AllocationDistribution({
  allocations,
  selectedWarehouseId = '',
  onSelectWarehouse,
}: AllocationDistributionProps) {
  // Aggregate real allocation records by warehouse
  const warehouseMap = new Map<string, WarehouseRank>()

  for (const alloc of allocations) {
    for (const entry of alloc.warehouses) {
      if (!entry.warehouse?.id) continue
      const id = entry.warehouse.id
      const existing = warehouseMap.get(id) || {
        id,
        name: entry.warehouse.name,
        city: entry.warehouse.city,
        allocationCount: 0,
        totalUnits: 0,
      }
      existing.allocationCount += 1
      existing.totalUnits += entry.products.reduce((s, p) => s + p.quantity, 0)
      warehouseMap.set(id, existing)
    }
  }

  const rankedWarehouses = Array.from(warehouseMap.values())
    .sort((a, b) => b.allocationCount - a.allocationCount || b.totalUnits - a.totalUnits)
    .slice(0, 5)

  if (rankedWarehouses.length === 0) {
    return null
  }

  return (
    <section
      aria-label="Allocation Distribution by Warehouse"
      className="rounded-xl border border-[#262630] bg-[#17171B] p-5 shadow-xl"
    >
      <div className="flex items-center justify-between pb-3 border-b border-[#202027]">
        <div className="flex items-center gap-2">
          <Warehouse className="size-3.5 text-[#C4622D]" />
          <h3 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#71717A]">
            Fulfillment Share by Facility
          </h3>
        </div>
        <span className="font-mono text-[10px] text-[#71717A]">
          {rankedWarehouses.length} Active Hubs
        </span>
      </div>

      <div className="mt-3.5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {rankedWarehouses.map((wh, idx) => {
          const rankStr = String(idx + 1).padStart(2, '0')
          const isSelected = selectedWarehouseId === wh.id

          return (
            <button
              key={wh.id}
              type="button"
              onClick={() => onSelectWarehouse?.(isSelected ? '' : wh.id)}
              className={`flex items-start gap-3 rounded-lg border p-3 text-left transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C4622D] ${
                isSelected
                  ? 'border-[#C4622D] bg-[#C4622D]/10 ring-1 ring-[#C4622D]/40'
                  : 'border-[#202027] bg-[#1C1C21] hover:border-[#262630] hover:bg-[#1F1F26]'
              }`}
            >
              <span className="font-mono text-xs font-bold text-[#C4622D]">
                {rankStr}
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-xs text-[#F4F4F5]">
                  {wh.name}
                </p>
                {wh.city && (
                  <p className="font-mono text-[10px] text-[#71717A] truncate">
                    {wh.city}
                  </p>
                )}
                <div className="mt-1.5 flex items-center justify-between font-mono text-[10px]">
                  <span className="font-semibold text-[#A1A1AA]">
                    {wh.allocationCount} {wh.allocationCount === 1 ? 'allocation' : 'allocations'}
                  </span>
                  <span className="text-[#71717A]">
                    {wh.totalUnits}u
                  </span>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
