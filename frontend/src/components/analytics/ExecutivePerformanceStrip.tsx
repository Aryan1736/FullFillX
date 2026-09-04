import { useMemo } from 'react'
import type { DashboardKpis, OrderStatusCount } from '../../types/dashboard'
import {
  formatCompactNumber,
  formatCurrency,
  formatPercent,
} from '../../services/dashboardService'
import { cn } from '../../utils/cn'

type ExecutivePerformanceStripProps = {
  kpis: DashboardKpis
  ordersByStatus: OrderStatusCount[]
}

export function ExecutivePerformanceStrip({
  kpis,
  ordersByStatus,
}: ExecutivePerformanceStripProps) {
  const { deliveredCount, inTransitCount, fulfillmentRate } = useMemo(() => {
    const statusMap = new Map<string, number>(
      ordersByStatus.map((item) => [item.status, item.count]),
    )
    const delivered = statusMap.get('DELIVERED') ?? 0
    const shipped = statusMap.get('SHIPPED') ?? 0
    const fulfilling = statusMap.get('FULFILLING') ?? 0
    const total = kpis.totalOrders

    const rate = total > 0 ? (delivered / total) * 100 : 0

    return {
      deliveredCount: delivered,
      inTransitCount: shipped + fulfilling,
      fulfillmentRate: rate,
    }
  }, [kpis.totalOrders, ordersByStatus])

  // Utilization threshold
  const utilization = kpis.warehouseUtilization
  const utilizationStatus =
    utilization >= 85
      ? { color: 'text-[#C95555]', label: 'CRITICAL LOAD' }
      : utilization >= 70
        ? { color: 'text-[#D08A35]', label: 'ATTENTION LOAD' }
        : { color: 'text-[#3FA66B]', label: 'HEALTHY BUFFER' }

  return (
    <section
      aria-label="Executive Performance Overview"
      className="animate-section-2 rounded-xl border border-[#262630] bg-[#17171B] shadow-xl overflow-hidden"
    >
      {/* Surface Header Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-[#202027] px-6 py-3.5 bg-[#141418]">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#71717A]">
            NETWORK TELEMETRY
          </span>
          <span className="text-[#262630]" aria-hidden="true">
            |
          </span>
          <h2 className="font-display text-xs font-bold tracking-wider text-[#F4F4F5] uppercase">
            EXECUTIVE PERFORMANCE OVERVIEW
          </h2>
        </div>
        <span className="font-mono text-[11px] text-[#71717A]">
          REAL-TIME AGGREGATE METRICS
        </span>
      </div>

      {/* 4-Metric Unified Surface Grid */}
      <div className="grid grid-cols-1 divide-y divide-[#202027] sm:grid-cols-2 sm:divide-y-0 sm:divide-x lg:grid-cols-4">
        {/* Metric 1: Total Orders */}
        <div className="p-6">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#71717A]">
              TOTAL ORDERS
            </span>
            <span className="font-mono text-[10px] text-[#71717A]">LIFECYCLE</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold tracking-tight text-[#F4F4F5] lg:text-4xl">
              {formatCompactNumber(kpis.totalOrders)}
            </span>
          </div>
          <p className="mt-1 font-mono text-[11px] text-[#71717A]">
            Cumulative order volume logged
          </p>
        </div>

        {/* Metric 2: Fulfillment Rate */}
        <div className="p-6">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#71717A]">
              FULFILLMENT RATE
            </span>
            <span className="font-mono text-[10px] text-[#71717A]">DELIVERIES</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold tracking-tight text-[#F4F4F5] lg:text-4xl">
              {formatPercent(fulfillmentRate)}
            </span>
          </div>
          <p className="mt-1 font-mono text-[11px] text-[#71717A]">
            {deliveredCount} delivered · {inTransitCount} in pipeline
          </p>
        </div>

        {/* Metric 3: Avg Shipping Cost */}
        <div className="p-6">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#71717A]">
              AVG SHIPPING COST
            </span>
            <span className="font-mono text-[10px] text-[#71717A]">DISPATCH</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold tracking-tight text-[#F4F4F5] lg:text-4xl">
              {formatCurrency(kpis.averageShippingCost)}
            </span>
          </div>
          <p className="mt-1 font-mono text-[11px] text-[#71717A]">
            Weighted mean freight per order
          </p>
        </div>

        {/* Metric 4: Network Utilization */}
        <div className="p-6">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#71717A]">
              NETWORK UTILIZATION
            </span>
            <span
              className={cn(
                'font-mono text-[10px] font-semibold uppercase tracking-wider',
                utilizationStatus.color,
              )}
            >
              {utilizationStatus.label}
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold tracking-tight text-[#F4F4F5] lg:text-4xl">
              {formatPercent(utilization)}
            </span>
          </div>
          <p className="mt-1 font-mono text-[11px] text-[#71717A]">
            Fleet-wide capacity saturation
          </p>
        </div>
      </div>
    </section>
  )
}
