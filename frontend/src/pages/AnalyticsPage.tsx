import { useState } from 'react'

import { AnalyticsHeader } from '../components/analytics/AnalyticsHeader'
import { AnalyticsSkeleton } from '../components/analytics/AnalyticsSkeletons'
import { AnalyticsEmptyState, AnalyticsErrorState } from '../components/analytics/AnalyticsStates'
import { ExecutivePerformanceStrip } from '../components/analytics/ExecutivePerformanceStrip'
import { InventoryHealthBreakdown } from '../components/analytics/InventoryHealthBreakdown'
import { OperationalSignals } from '../components/analytics/OperationalSignals'
import { OrderOutcomeDistribution } from '../components/analytics/OrderOutcomeDistribution'
import { ShippingCostTrendSection } from '../components/analytics/ShippingCostTrendSection'
import { WarehouseUtilizationRanking } from '../components/analytics/WarehouseUtilizationRanking'
import { useDashboard } from '../hooks/useDashboard'
import { type AnalyticsTimeRange, useShippingCostTrend } from '../hooks/useShippingCostTrend'
import { isDashboardEmpty } from '../services/dashboardService'

export function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<AnalyticsTimeRange>('30D')
  const { data: result, isLoading, isError, isMock, refetch } = useDashboard()
  const {
    data: trendResult,
    startDate,
    endDate,
    isLoading: isTrendLoading,
    isFetching: isTrendFetching,
  } = useShippingCostTrend(timeRange)

  if (isLoading) {
    return (
      <div className="space-y-12 pb-12">
        <AnalyticsHeader
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          startDate={startDate}
          endDate={endDate}
          isMock={isMock}
        />
        <AnalyticsSkeleton />
      </div>
    )
  }

  if (isError || !result) {
    return (
      <div className="space-y-12 pb-12">
        <AnalyticsHeader
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          startDate={startDate}
          endDate={endDate}
          isMock={isMock}
        />
        <AnalyticsErrorState onRetry={() => void refetch()} />
      </div>
    )
  }

  const { data } = result

  if (isDashboardEmpty(data)) {
    return (
      <div className="space-y-12 pb-12">
        <AnalyticsHeader
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          startDate={startDate}
          endDate={endDate}
          isMock={isMock}
        />
        <AnalyticsEmptyState />
      </div>
    )
  }

  const trendData = trendResult?.trend ?? data.shippingCostTrend

  return (
    <div className="relative space-y-12 sm:space-y-16 pb-12">
      {/* Subtle depth glow behind header area */}
      <div
        className="pointer-events-none absolute -top-16 left-1/2 -z-10 h-96 w-full max-w-4xl -translate-x-1/2 rounded-full bg-radial from-[#C4622D]/5 via-transparent to-transparent blur-2xl"
        aria-hidden="true"
      />

      {/* 1. Header with Eyebrow, Title & Time-Range Selector */}
      <AnalyticsHeader
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        startDate={startDate}
        endDate={endDate}
        isMock={isMock}
      />

      {/* 2. Executive Performance Strip (Unified surface) */}
      <ExecutivePerformanceStrip
        kpis={data.kpis}
        ordersByStatus={data.ordersByStatus}
      />

      {/* 3. Primary Analytics Grid (Left: Shipping Cost Trend, Right: Order Outcomes) */}
      <section
        aria-label="Primary Performance Analytics"
        className="animate-section-3 grid grid-cols-1 gap-6 lg:grid-cols-2"
      >
        <ShippingCostTrendSection
          data={trendData}
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          isLoading={isTrendLoading || isTrendFetching}
        />
        <OrderOutcomeDistribution data={data.ordersByStatus} />
      </section>

      {/* 4. Network Constraints & Stock Risk (Left: Warehouse Ranking, Right: Inventory Health) */}
      <section
        aria-label="Network and Inventory Constraints"
        className="animate-section-4 grid grid-cols-1 gap-6 lg:grid-cols-2"
      >
        <WarehouseUtilizationRanking data={data.warehouseUtilization} />
        <InventoryHealthBreakdown
          distribution={data.inventoryDistribution}
          inventoryStatus={data.inventoryStatus}
        />
      </section>

      {/* 5. Operational Signals Area (Derived strictly from real telemetry) */}
      <OperationalSignals data={data} trendData={trendData} />
    </div>
  )
}
