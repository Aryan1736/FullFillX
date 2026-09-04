import { useMemo } from 'react'
import type { InventoryDistributionSlice, InventoryStatus } from '../../types/dashboard'
import { formatCompactNumber } from '../../services/dashboardService'
import { cn } from '../../utils/cn'

type InventoryHealthBreakdownProps = {
  distribution: InventoryDistributionSlice[]
  inventoryStatus?: InventoryStatus
}

export function InventoryHealthBreakdown({
  distribution,
  inventoryStatus,
}: InventoryHealthBreakdownProps) {
  const { tiers, totalSkus, availableUnits, reservedUnits, totalUnits } = useMemo(() => {
    let inStock = 0
    let lowStock = 0
    let outOfStock = 0

    if (inventoryStatus) {
      outOfStock = inventoryStatus.outOfStockCount
      lowStock = inventoryStatus.lowStockCount
      inStock = Math.max(
        0,
        inventoryStatus.inventoryRecordCount - lowStock - outOfStock,
      )
    } else {
      for (const item of distribution) {
        const lower = item.name.toLowerCase()
        if (lower.includes('out')) outOfStock = item.value
        else if (lower.includes('low')) lowStock = item.value
        else inStock = item.value
      }
    }

    const total = inStock + lowStock + outOfStock

    const tierList = [
      {
        id: 'in-stock',
        name: 'HEALTHY / IN STOCK',
        count: inStock,
        percentage: total > 0 ? (inStock / total) * 100 : 0,
        color: '#3FA66B',
        barClass: 'bg-[#3FA66B]',
        textClass: 'text-[#3FA66B]',
        description: 'Sufficient inventory buffer across facilities',
      },
      {
        id: 'low-stock',
        name: 'LOW STOCK ATTENTION',
        count: lowStock,
        percentage: total > 0 ? (lowStock / total) * 100 : 0,
        color: '#D08A35',
        barClass: 'bg-[#D08A35]',
        textClass: 'text-[#D08A35]',
        description: 'Approaching replenishment threshold',
      },
      {
        id: 'out-of-stock',
        name: 'OUT OF STOCK CRITICAL',
        count: outOfStock,
        percentage: total > 0 ? (outOfStock / total) * 100 : 0,
        color: '#C95555',
        barClass: 'bg-[#C95555]',
        textClass: 'text-[#C95555]',
        description: 'Zero available physical inventory',
      },
    ]

    return {
      tiers: tierList,
      totalSkus: total,
      availableUnits: inventoryStatus?.totalAvailableQuantity ?? 0,
      reservedUnits: inventoryStatus?.totalReservedQuantity ?? 0,
      totalUnits: inventoryStatus?.totalQuantity ?? 0,
    }
  }, [distribution, inventoryStatus])

  return (
    <div className="flex flex-col h-full rounded-xl border border-[#262630] bg-[#17171B] shadow-xl overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#202027] px-6 py-4 bg-[#141418]">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#71717A]">
              STOCK RISK
            </span>
            <span className="text-[#262630]" aria-hidden="true">
              |
            </span>
            <h3 className="font-display text-xs font-bold tracking-wider text-[#F4F4F5] uppercase">
              INVENTORY HEALTH
            </h3>
          </div>
          <p className="mt-0.5 text-xs text-[#71717A]">
            Catalog inventory risk tiers and physical unit reserves
          </p>
        </div>

        <span className="font-mono text-xs font-semibold text-[#F4F4F5] bg-[#1C1C21] px-2.5 py-1 rounded border border-[#262630]">
          {totalSkus} Tracked SKUs
        </span>
      </div>

      {/* Body */}
      <div className="flex-1 p-6 space-y-6 flex flex-col justify-between">
        {/* Full Segmented Proportion Bar */}
        {totalSkus > 0 ? (
          <div className="space-y-1.5">
            <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-[#141418] border border-[#202027]">
              {tiers.map((tier) => {
                if (tier.count === 0) return null
                return (
                  <div
                    key={tier.id}
                    style={{ width: `${tier.percentage}%` }}
                    className={cn('h-full transition-all duration-300', tier.barClass)}
                    title={`${tier.name}: ${tier.count} SKUs (${tier.percentage.toFixed(1)}%)`}
                  />
                )
              })}
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono text-[#71717A]">
              <span>Risk exposure ratio</span>
              <span>100% Catalog surveyed</span>
            </div>
          </div>
        ) : null}

        {/* 3 Risk Tiers */}
        <div className="space-y-3">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className="rounded-lg border border-[#262630] bg-[#141418] p-3.5 space-y-2"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="size-2 rounded-full shrink-0"
                    style={{ backgroundColor: tier.color }}
                    aria-hidden="true"
                  />
                  <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#F4F4F5]">
                    {tier.name}
                  </span>
                </div>

                <div className="flex items-center gap-2 font-mono">
                  <span className="text-xs text-[#71717A]">
                    {tier.percentage.toFixed(1)}%
                  </span>
                  <span className="text-[#262630]">·</span>
                  <span className={cn('text-sm font-bold', tier.textClass)}>
                    {tier.count} {tier.count === 1 ? 'SKU' : 'SKUs'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#71717A]">
                <span>{tier.description}</span>
                <div className="w-24 bg-[#1C1C21] h-1 rounded-full overflow-hidden">
                  <div
                    className={cn('h-full rounded-full', tier.barClass)}
                    style={{ width: `${tier.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Unit Breakdown Footer */}
        {totalUnits > 0 ? (
          <div className="pt-4 border-t border-[#202027] grid grid-cols-3 gap-3 text-center">
            <div className="p-2 rounded bg-[#141418] border border-[#202027]">
              <span className="block font-mono text-[9px] uppercase tracking-wider text-[#71717A]">
                AVAILABLE
              </span>
              <span className="font-mono text-xs font-bold text-[#3FA66B]">
                {formatCompactNumber(availableUnits)}
              </span>
            </div>
            <div className="p-2 rounded bg-[#141418] border border-[#202027]">
              <span className="block font-mono text-[9px] uppercase tracking-wider text-[#71717A]">
                RESERVED
              </span>
              <span className="font-mono text-xs font-bold text-[#D08A35]">
                {formatCompactNumber(reservedUnits)}
              </span>
            </div>
            <div className="p-2 rounded bg-[#141418] border border-[#202027]">
              <span className="block font-mono text-[9px] uppercase tracking-wider text-[#71717A]">
                TOTAL UNITS
              </span>
              <span className="font-mono text-xs font-bold text-[#F4F4F5]">
                {formatCompactNumber(totalUnits)}
              </span>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
