import { useMemo, useState } from 'react'
import { Activity, AlertTriangle, ArrowRight } from 'lucide-react'

import {
  calculateUtilization,
  formatCompactNumber,
  formatUtilization,
  getUtilizationSemantic,
} from '../../services/warehouseService'
import type { Warehouse } from '../../types/warehouse'

type CapacityPressureSectionProps = {
  warehouses: Warehouse[]
  onSelectWarehouse: (warehouse: Warehouse) => void
}

export function CapacityPressureSection({
  warehouses,
  onSelectWarehouse,
}: CapacityPressureSectionProps) {
  const [showAll, setShowAll] = useState(false)

  // Rank facilities: highest utilization → lowest utilization
  const rankedWarehouses = useMemo(() => {
    return [...warehouses].sort((a, b) => {
      const utilA = calculateUtilization(a)
      const utilB = calculateUtilization(b)
      return utilB - utilA
    })
  }, [warehouses])

  if (rankedWarehouses.length === 0) {
    return null
  }

  const criticalCount = rankedWarehouses.filter(
    (w) => calculateUtilization(w) >= 85,
  ).length
  const attentionCount = rankedWarehouses.filter((w) => {
    const u = calculateUtilization(w)
    return u >= 70 && u < 85
  }).length

  const displayList = showAll ? rankedWarehouses : rankedWarehouses.slice(0, 4)

  return (
    <section
      aria-label="Capacity Pressure"
      className="rounded-xl border border-[#262630] bg-[#17171B] p-5 sm:p-6 shadow-xl"
    >
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[#202027] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#71717A]">
              CAPACITY HEALTH
            </span>
            <span className="text-[#262630]" aria-hidden="true">|</span>
            <span className="font-mono text-[10px] font-semibold text-[#A1A1AA]">
              HEADROOM AUDIT
            </span>
          </div>
          <h2 className="mt-1 font-display text-lg font-bold tracking-tight text-[#F4F4F5] sm:text-xl">
            CAPACITY PRESSURE
          </h2>
          <p className="mt-0.5 text-xs text-[#A1A1AA]">
            Operational ranking of fulfillment nodes by capacity utilization risk.
          </p>
        </div>

        {/* Risk Pill Indicators */}
        <div className="flex items-center gap-2 shrink-0">
          {criticalCount > 0 && (
            <span className="inline-flex items-center gap-1 rounded border border-[#C95555]/30 bg-[#C95555]/10 px-2.5 py-1 font-mono text-[11px] font-semibold text-[#C95555]">
              <AlertTriangle className="size-3" aria-hidden="true" />
              <span>{criticalCount} CRITICAL</span>
            </span>
          )}
          {attentionCount > 0 && (
            <span className="inline-flex items-center gap-1 rounded border border-[#D08A35]/30 bg-[#D08A35]/10 px-2.5 py-1 font-mono text-[11px] font-semibold text-[#D08A35]">
              <Activity className="size-3" aria-hidden="true" />
              <span>{attentionCount} ATTENTION</span>
            </span>
          )}
          {criticalCount === 0 && attentionCount === 0 && (
            <span className="inline-flex items-center gap-1 rounded border border-[#3FA66B]/30 bg-[#3FA66B]/10 px-2.5 py-1 font-mono text-[11px] font-semibold text-[#3FA66B]">
              <span className="size-1.5 rounded-full bg-[#3FA66B]" aria-hidden="true" />
              <span>ALL WITHIN LIMITS</span>
            </span>
          )}
        </div>
      </div>

      {/* Operational Ranked List */}
      <div className="mt-4 divide-y divide-[#202027]">
        {displayList.map((warehouse, index) => {
          const utilization = calculateUtilization(warehouse)
          const semantic = getUtilizationSemantic(utilization)
          const rankStr = String(index + 1).padStart(2, '0')
          const clamped = Math.min(Math.max(utilization, 0), 100)

          return (
            <div
              key={warehouse.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelectWarehouse(warehouse)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onSelectWarehouse(warehouse)
                }
              }}
              className="group flex flex-col gap-3 py-3.5 sm:flex-row sm:items-center sm:justify-between cursor-pointer rounded-lg px-2 -mx-2 transition-colors hover:bg-[#1C1C21] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4622D]"
              aria-label={`Rank ${rankStr}: ${warehouse.name} at ${formatUtilization(utilization)}`}
            >
              {/* Left: Rank & Facility Details */}
              <div className="flex items-center gap-3.5 min-w-0">
                <span className="font-mono text-sm font-bold text-[#71717A] group-hover:text-[#F4F4F5] transition-colors w-6">
                  {rankStr}
                </span>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-sm font-semibold text-[#F4F4F5] group-hover:text-[#C4622D] transition-colors truncate">
                      {warehouse.name}
                    </span>
                    {!warehouse.active && (
                      <span className="font-mono text-[10px] text-[#71717A] bg-[#202027] px-1.5 py-0.5 rounded">
                        OFFLINE
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-[#A1A1AA]">{warehouse.city}</p>
                </div>
              </div>

              {/* Right: Utilization Figures & Progress */}
              <div className="flex flex-col sm:items-end gap-1.5 sm:w-64 shrink-0">
                <div className="flex items-center justify-between sm:justify-end gap-3 w-full">
                  <span
                    className="inline-flex items-center rounded px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider"
                    style={{
                      color: semantic.color,
                      backgroundColor: semantic.bg,
                      border: `1px solid ${semantic.border}`,
                    }}
                  >
                    {semantic.label}
                  </span>

                  <span
                    className="font-mono text-sm font-bold"
                    style={{ color: semantic.color }}
                  >
                    {formatUtilization(utilization)}
                  </span>
                </div>

                {/* Thin utilization bar */}
                <div className="h-1 w-full overflow-hidden rounded-full bg-[#262630]">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${clamped}%`,
                      backgroundColor: semantic.color,
                    }}
                  />
                </div>

                {/* Units breakdown */}
                <div className="flex items-center justify-between w-full font-mono text-[11px] text-[#71717A]">
                  <span>{formatCompactNumber(warehouse.currentLoad)} / {formatCompactNumber(warehouse.capacity)} units</span>
                  <span className="text-[10px] text-[#A1A1AA] opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1">
                    Details <ArrowRight className="size-2.5" />
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Show more / show less toggle if more than 4 facilities */}
      {rankedWarehouses.length > 4 && (
        <div className="mt-3 border-t border-[#202027] pt-3 text-center">
          <button
            type="button"
            onClick={() => setShowAll((prev) => !prev)}
            className="font-mono text-xs font-semibold text-[#C4622D] hover:text-[#9E4A20] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C4622D]"
          >
            {showAll
              ? 'Show Top 4 Facilities'
              : `Show All ${rankedWarehouses.length} Facilities (${rankedWarehouses.length - 4} more)`}
          </button>
        </div>
      )}
    </section>
  )
}
