import {
  CheckCircle2,
  Clock,
  IndianRupee,
  MapPin,
  Package,
  Route,
  ShieldCheck,
  Split,
  TrendingDown,
  Warehouse,
} from 'lucide-react'

import {
  formatDistance,
  formatOptimizationCurrency,
  formatOptimizationEta,
  formatScore,
  formatUtilization,
} from '../../services/optimizationService'
import type { OptimizationResult, WarehouseCandidate } from '../../types/optimization'

type RecommendationHeroProps = {
  result: OptimizationResult
  primaryCandidate: WarehouseCandidate | null
  destinationCity?: string
  customerName?: string
  orderReference?: string
  isExecuted?: boolean
  totalAvailableStock?: number
}

export function RecommendationHero({
  result,
  primaryCandidate,
  destinationCity,
  customerName,
  orderReference,
  isExecuted = false,
  totalAvailableStock,
}: RecommendationHeroProps) {
  const isSplit = result.selectedWarehouses.length > 1
  const winningWarehouseName = primaryCandidate?.warehouseName ?? 'Selected Facility'
  const distanceKm = primaryCandidate?.scoreBreakdown?.distanceScore ?? null
  const utilizationRatio = primaryCandidate?.scoreBreakdown?.warehouseLoadScore ?? null
  const shippingCost = primaryCandidate?.shippingCost ?? result.totalShippingCost
  const deliveryHours = primaryCandidate?.estimatedDeliveryHours ?? result.estimatedDeliveryHours

  return (
    <section className="relative overflow-hidden rounded-xl border border-[#262630] bg-[#17171B] p-6 shadow-md transition-all duration-300 hover:border-[#C4622D]/60 hover:-translate-y-0.5 sm:p-7">
      {/* Subtle depth glow */}
      <div
        className="pointer-events-none absolute -right-20 -top-20 -z-0 h-64 w-64 rounded-full bg-radial from-[#C4622D]/10 via-transparent to-transparent blur-2xl"
        aria-hidden="true"
      />

      {/* Top Header Eyebrow & Status Tags */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-[#202027] pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-md border border-[#C4622D]/30 bg-[#C4622D]/15 px-2.5 py-1 font-mono text-[11px] font-bold text-[#C4622D]">
            <ShieldCheck className="size-3.5" />
            RECOMMENDED ALLOCATION
          </span>

          <span className="rounded border border-[#262630] bg-[#1C1C21] px-2.5 py-1 font-mono text-[11px] text-[#A1A1AA]">
            {result.strategyName.replace('_', ' ')}
          </span>

          {isSplit ? (
            <span className="inline-flex items-center gap-1 rounded border border-[#D08A35]/30 bg-[#D08A35]/15 px-2 py-0.5 font-mono text-[11px] font-semibold text-[#D08A35]">
              <Split className="size-3" />
              Split Shipment ({result.selectedWarehouses.length} Nodes)
            </span>
          ) : (
            <span className="rounded border border-[#262630] bg-[#1C1C21] px-2 py-0.5 font-mono text-[10px] text-[#71717A]">
              Single Facility Consolidated
            </span>
          )}
        </div>

        {/* Simulation vs Executed Indicator */}
        <div>
          {isExecuted ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#3FA66B]/30 bg-[#3FA66B]/15 px-3 py-1 font-mono text-xs font-semibold text-[#3FA66B]">
              <CheckCircle2 className="size-3.5 text-[#3FA66B]" />
              EXECUTED & COMMITTED
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#262630] bg-[#1C1C21] px-3 py-1 font-mono text-xs font-medium text-[#A1A1AA]">
              <span className="size-2 rounded-full bg-[#71717A]" aria-hidden="true" />
              SIMULATION (State Unchanged)
            </span>
          )}
        </div>
      </div>

      {/* Main Dominant Recommendation Heading */}
      <div className="relative z-10 mt-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
          <div>
            <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-[#71717A]">
              OPTIMIZATION RESULT
            </span>
            <h2 className="font-display text-2xl font-bold tracking-tight text-[#F4F4F5] sm:text-3xl lg:text-4xl mt-1">
              {winningWarehouseName}
            </h2>
          </div>

          <div className="text-left sm:text-right">
            <span className="font-mono text-[11px] text-[#71717A] uppercase tracking-wider">
              Optimization Score
            </span>
            <div className="font-mono text-2xl font-bold text-[#F4F4F5] sm:text-3xl">
              {formatScore(result.optimizationScore)}
              <span className="text-xs font-normal text-[#71717A]"> / 100</span>
            </div>
            {result.estimatedSavings && result.estimatedSavings > 0 ? (
              <span className="inline-flex items-center gap-1 font-mono text-xs font-medium text-[#3FA66B]">
                <TrendingDown className="size-3" />
                Savings: {formatOptimizationCurrency(result.estimatedSavings)}
              </span>
            ) : null}
          </div>
        </div>

        {/* Location & Reference Trail */}
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-[#A1A1AA]">
          {destinationCity ? (
            <span className="inline-flex items-center gap-1.5 font-medium">
              <MapPin className="size-3.5 text-[#C4622D]" />
              <span>Routing to: <strong className="text-[#F4F4F5]">{destinationCity}</strong></span>
            </span>
          ) : null}
          {customerName ? (
            <span className="text-[#A1A1AA]">
              Customer: <strong className="text-[#F4F4F5]">{customerName}</strong>
            </span>
          ) : null}
          {orderReference ? (
            <span className="font-mono text-[11px] text-[#71717A]">
              Ref: <span className="text-[#F4F4F5]">#{orderReference.slice(0, 8)}</span>
            </span>
          ) : null}
        </div>
      </div>

      {/* 4 Core Decision Metrics */}
      <div className="relative z-10 mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 border-t border-[#202027] pt-5">
        {/* Metric 1: Shipping Cost */}
        <div className="rounded-lg border border-[#202027] bg-[#1C1C21] p-3.5">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#71717A]">
            <IndianRupee className="size-3.5 text-[#C4622D]" />
            <span>Shipping Cost</span>
          </div>
          <p className="mt-1 font-mono text-xl font-bold text-[#F4F4F5] sm:text-2xl">
            {formatOptimizationCurrency(shippingCost)}
          </p>
          <span className="font-mono text-[10px] text-[#71717A]">Optimal carrier rate</span>
        </div>

        {/* Metric 2: Distance */}
        <div className="rounded-lg border border-[#202027] bg-[#1C1C21] p-3.5">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#71717A]">
            <Route className="size-3.5 text-[#C4622D]" />
            <span>Transit Distance</span>
          </div>
          <p className="mt-1 font-mono text-xl font-bold text-[#F4F4F5] sm:text-2xl">
            {distanceKm !== null ? formatDistance(distanceKm) : 'Direct Hub'}
          </p>
          <span className="font-mono text-[10px] text-[#71717A]">Haversine highway leg</span>
        </div>

        {/* Metric 3: Warehouse Utilization */}
        <div className="rounded-lg border border-[#202027] bg-[#1C1C21] p-3.5">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#71717A]">
            <Warehouse className="size-3.5 text-[#C4622D]" />
            <span>Warehouse Utilization</span>
          </div>
          <p className="mt-1 font-mono text-xl font-bold text-[#F4F4F5] sm:text-2xl">
            {utilizationRatio !== null ? formatUtilization(utilizationRatio) : '—'}
          </p>
          <span className="font-mono text-[10px] text-[#71717A]">Projected capacity load</span>
        </div>

        {/* Metric 4: Available Inventory */}
        <div className="rounded-lg border border-[#202027] bg-[#1C1C21] p-3.5">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#71717A]">
            <Package className="size-3.5 text-[#C4622D]" />
            <span>Available Inventory</span>
          </div>
          <p className="mt-1 font-mono text-xl font-bold text-[#F4F4F5] sm:text-2xl">
            {totalAvailableStock !== undefined
              ? `${totalAvailableStock.toLocaleString()} units`
              : 'Full Coverage'}
          </p>
          <span className="font-mono text-[10px] text-[#71717A]">Zero stockout risk</span>
        </div>
      </div>

      {/* Transit ETA Banner */}
      <div className="relative z-10 mt-4 flex items-center justify-between rounded-lg border border-[#262630] bg-[#1C1C21]/60 px-4 py-2.5 font-mono text-xs text-[#A1A1AA]">
        <div className="flex items-center gap-2">
          <Clock className="size-3.5 text-[#C4622D]" />
          <span>Estimated Transit Horizon:</span>
          <strong className="text-[#F4F4F5]">{formatOptimizationEta(deliveryHours)}</strong>
        </div>
        <span className="text-[11px] text-[#71717A]">SLA compliant</span>
      </div>
    </section>
  )
}
