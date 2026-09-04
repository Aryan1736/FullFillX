import { useMemo } from 'react'
import type { WarehouseUtilizationItem } from '../../types/dashboard'
import { formatPercent } from '../../services/dashboardService'
import { cn } from '../../utils/cn'

type WarehouseUtilizationRankingProps = {
  data: WarehouseUtilizationItem[]
}

export function WarehouseUtilizationRanking({ data }: WarehouseUtilizationRankingProps) {
  const sortedWarehouses = useMemo(() => {
    return [...data].sort((a, b) => b.utilizationPercentage - a.utilizationPercentage)
  }, [data])

  const meanUtilization = useMemo(() => {
    if (sortedWarehouses.length === 0) return 0
    const sum = sortedWarehouses.reduce((acc, w) => acc + w.utilizationPercentage, 0)
    return sum / sortedWarehouses.length
  }, [sortedWarehouses])

  return (
    <div className="flex flex-col h-full rounded-xl border border-[#262630] bg-[#17171B] shadow-xl overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#202027] px-6 py-4 bg-[#141418]">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#71717A]">
              NETWORK CONSTRAINTS
            </span>
            <span className="text-[#262630]" aria-hidden="true">
              |
            </span>
            <h3 className="font-display text-xs font-bold tracking-wider text-[#F4F4F5] uppercase">
              WAREHOUSE PERFORMANCE
            </h3>
          </div>
          <p className="mt-0.5 text-xs text-[#71717A]">
            Facilities ranked by capacity load and operational pressure
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-semibold text-[#F4F4F5] bg-[#1C1C21] px-2.5 py-1 rounded border border-[#262630]">
            Mean {formatPercent(meanUtilization)}
          </span>
        </div>
      </div>

      {/* Body: Ranked List */}
      <div className="flex-1 p-6 flex flex-col justify-between">
        {sortedWarehouses.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-xs text-[#71717A]">No warehouse utilization telemetry available.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#202027]">
            {sortedWarehouses.map((warehouse, idx) => {
              const pct = Math.min(100, Math.max(0, warehouse.utilizationPercentage))
              const isCritical = pct >= 85
              const isAttention = pct >= 70 && pct < 85

              const semanticColor = isCritical
                ? 'text-[#C95555]'
                : isAttention
                  ? 'text-[#D08A35]'
                  : 'text-[#3FA66B]'

              const barColor = isCritical
                ? 'bg-[#C95555]'
                : isAttention
                  ? 'bg-[#D08A35]'
                  : 'bg-[#3FA66B]'

              const rank = String(idx + 1).padStart(2, '0')

              return (
                <div
                  key={warehouse.warehouseId}
                  className="py-3 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="font-mono text-[11px] font-semibold text-[#71717A] w-5">
                        {rank}
                      </span>
                      <span className="font-medium text-[#F4F4F5] truncate">
                        {warehouse.warehouseName}
                      </span>
                      {warehouse.city ? (
                        <span className="hidden sm:inline font-mono text-[10px] text-[#71717A] shrink-0">
                          [{warehouse.city}]
                        </span>
                      ) : null}
                    </div>

                    <div className="flex items-center gap-3 shrink-0 font-mono">
                      {warehouse.capacity > 0 ? (
                        <span className="text-[#71717A] text-[11px] hidden md:inline">
                          {warehouse.currentLoad.toLocaleString()} / {warehouse.capacity.toLocaleString()} u
                        </span>
                      ) : null}
                      <span className={cn('text-xs font-bold w-12 text-right', semanticColor)}>
                        {pct.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {/* Minimalistic load bar */}
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#141418] border border-[#202027]">
                    <div
                      className={cn('h-full rounded-full transition-all duration-300', barColor)}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Legend / threshold indicators */}
        <div className="mt-5 pt-4 border-t border-[#202027] flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-[#71717A]">
          <span className="text-[10px] uppercase tracking-wider">PRESSURE THRESHOLDS:</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-[#3FA66B]" />
              &lt; 70% Optimal
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-[#D08A35]" />
              70–84% Attention
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-[#C95555]" />
              ≥ 85% Critical
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
