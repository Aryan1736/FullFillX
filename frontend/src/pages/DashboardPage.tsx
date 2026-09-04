import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Cpu, Eye, RefreshCw } from 'lucide-react'

import {
  type AnalyticsTimeRange,
  InventoryDistributionChart,
  OrdersByStatusChart,
  ShippingCostTrendChart,
  WarehouseUtilizationChart,
} from '../components/dashboard/DashboardCharts'
import {
  DashboardEmptyState,
  DashboardErrorState,
  DashboardSkeleton,
} from '../components/dashboard/DashboardStates'
import { FulfillmentWorkflow } from '../components/dashboard/FulfillmentWorkflow'
import {
  PrimaryKpiSummary,
  SecondaryOperationalStrip,
} from '../components/dashboard/KpiCard'
import { NeedsAttentionBanner } from '../components/dashboard/NeedsAttentionBanner'
import { useDashboard } from '../hooks/useDashboard'
import { useShippingCostTrend } from '../hooks/useShippingCostTrend'
import { paths } from '../routes/paths'
import { isDashboardEmpty } from '../services/dashboardService'

export function DashboardPage() {
  const [trendRange, setTrendRange] = useState<AnalyticsTimeRange>('30D')
  const { data: result, isLoading, isError, isMock, refetch, isFetching } = useDashboard()
  const {
    data: trendResult,
    isLoading: isTrendLoading,
    isFetching: isTrendFetching,
  } = useShippingCostTrend(trendRange)

  if (isLoading) {
    return (
      <div className="space-y-12">
        <header className="space-y-2">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[#71717A]">
            FULFILLMENT OPERATIONS
          </p>
          <h1 className="font-display text-3xl font-bold tracking-tight text-[#F4F4F5] sm:text-4xl lg:text-5xl">
            FulfillX Operations
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-[#A1A1AA] sm:text-base">
            Monitor your fulfillment network, review demand, and turn customer orders into optimized warehouse allocations.
          </p>
        </header>
        <DashboardSkeleton />
      </div>
    )
  }

  if (isError || !result) {
    return (
      <div className="space-y-12">
        <header className="space-y-2">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[#71717A]">
            FULFILLMENT OPERATIONS
          </p>
          <h1 className="font-display text-3xl font-bold tracking-tight text-[#F4F4F5] sm:text-4xl lg:text-5xl">
            FulfillX Operations
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-[#A1A1AA] sm:text-base">
            Monitor your fulfillment network, review demand, and turn customer orders into optimized warehouse allocations.
          </p>
        </header>
        <DashboardErrorState onRetry={() => void refetch()} />
      </div>
    )
  }

  const { data } = result

  if (isDashboardEmpty(data)) {
    return (
      <div className="space-y-12">
        <header className="space-y-2">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[#71717A]">
            FULFILLMENT OPERATIONS
          </p>
          <h1 className="font-display text-3xl font-bold tracking-tight text-[#F4F4F5] sm:text-4xl lg:text-5xl">
            FulfillX Operations
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-[#A1A1AA] sm:text-base">
            Monitor your fulfillment network, review demand, and turn customer orders into optimized warehouse allocations.
          </p>
        </header>
        <DashboardEmptyState />
      </div>
    )
  }

  const { kpis } = data

  return (
    <div className="relative space-y-12 sm:space-y-16 pb-12">
      {/* Subtle depth glow behind hero area */}
      <div
        className="pointer-events-none absolute -top-16 left-1/2 -z-10 h-96 w-full max-w-4xl -translate-x-1/2 rounded-full bg-radial from-[#C4622D]/5 via-transparent to-transparent blur-2xl"
        aria-hidden="true"
      />

      {/* 1. HERO / INTRO SECTION */}
      <header className="animate-section-1 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between border-b border-[#202027] pb-8">
        <div className="max-w-2xl space-y-2">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[#71717A]">
              FULFILLMENT OPERATIONS
            </span>
            <span className="text-[#262630]" aria-hidden="true">|</span>
            {isMock ? (
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold text-[#D08A35]">
                <span className="size-1.5 rounded-full bg-[#D08A35]" aria-hidden="true" />
                SIMULATED TELEMETRY
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold text-[#3FA66B]">
                <span className="size-1.5 rounded-full bg-[#3FA66B]" aria-hidden="true" />
                LIVE NETWORK
              </span>
            )}
          </div>

          <h1 className="font-display text-3xl font-bold tracking-tight text-[#F4F4F5] sm:text-4xl lg:text-5xl">
            FulfillX Operations
          </h1>

          <p className="text-sm leading-relaxed text-[#A1A1AA] sm:text-base">
            Monitor your fulfillment network, review demand, and turn customer orders into optimized warehouse allocations.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => void refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-1.5 rounded border border-[#262630] bg-[#17171B] px-3 py-2 text-xs font-medium text-[#A1A1AA] transition-colors hover:border-[#71717A] hover:text-[#F4F4F5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4622D] disabled:opacity-50"
            title="Refresh network telemetry"
          >
            <RefreshCw className={`size-3.5 text-[#71717A] ${isFetching ? 'animate-spin' : ''}`} />
            <span>{isFetching ? 'Syncing...' : 'Sync Telemetry'}</span>
          </button>

          <Link
            to={paths.orders}
            className="inline-flex items-center gap-1.5 rounded border border-[#262630] bg-[#17171B] px-3.5 py-2 text-xs font-semibold text-[#F4F4F5] transition-colors hover:bg-[#1C1C21] hover:border-[#71717A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4622D]"
          >
            <Eye className="size-3.5 text-[#71717A]" />
            <span>View Orders</span>
          </Link>

          <Link
            to={paths.optimization}
            className="inline-flex items-center gap-1.5 rounded border border-[#C4622D] bg-[#C4622D] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#9E4A20] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4622D]"
          >
            <Cpu className="size-3.5" />
            <span>Optimize Orders</span>
            <ArrowRight className="size-3" />
          </Link>
        </div>
      </header>

      {/* 2. FULFILLMENT WORKFLOW TIMELINE */}
      <div className="animate-section-2">
        <FulfillmentWorkflow data={data} />
      </div>

      {/* 3. NEEDS ATTENTION OPERATIONS QUEUE */}
      <div className="animate-section-3">
        <NeedsAttentionBanner data={data} />
      </div>

      {/* 4. PRIMARY KPI SUMMARY - UNIFIED OPERATIONS OVERVIEW */}
      <div className="animate-section-4">
        <PrimaryKpiSummary kpis={kpis} />
      </div>

      {/* 5. NETWORK SATURATION & ORDER PIPELINE */}
      <section className="animate-section-5 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <WarehouseUtilizationChart data={data.warehouseUtilization} />
        <OrdersByStatusChart data={data.ordersByStatus} />
      </section>

      {/* 6. SHIPPING COST TREND & INVENTORY CLASSIFICATION */}
      <section className="animate-section-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ShippingCostTrendChart
          data={trendResult?.trend ?? data.shippingCostTrend}
          selectedRange={trendRange}
          onRangeChange={setTrendRange}
          isLoading={isTrendLoading || isTrendFetching}
        />
        <InventoryDistributionChart data={data.inventoryDistribution} />
      </section>

      {/* 7. SECONDARY OPERATIONAL STRIP */}
      <div className="animate-section-6">
        <SecondaryOperationalStrip kpis={kpis} inventoryStatus={data.inventoryStatus} />
      </div>
    </div>
  )
}
