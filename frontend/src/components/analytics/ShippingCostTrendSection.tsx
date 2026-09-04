import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { AnalyticsTimeRange } from '../../hooks/useShippingCostTrend'
import type { ShippingCostTrendPoint } from '../../types/dashboard'
import { formatChartDate, formatCurrency } from '../../services/dashboardService'
import { cn } from '../../utils/cn'

type CustomTooltipPayload = {
  name?: string
  value?: number | string
  payload?: ShippingCostTrendPoint
}

type CustomTooltipProps = {
  active?: boolean
  payload?: CustomTooltipPayload[]
  label?: string
}

function ShippingTrendTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null
  }

  const point = payload[0]?.payload
  const cost = Number(payload[0]?.value ?? 0)

  return (
    <div className="rounded-lg border border-[#262630] bg-[#1C1C21] p-3 text-xs shadow-xl min-w-44">
      <div className="flex items-center justify-between border-b border-[#262630] pb-1.5 mb-2">
        <span className="font-mono text-[10px] uppercase text-[#71717A]">
          DISPATCH TELEMETRY
        </span>
        <span className="font-mono text-[10px] text-[#A1A1AA]">{label}</span>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[#A1A1AA]">Mean Shipping Cost:</span>
          <span className="font-mono font-bold text-[#C4622D]">
            {formatCurrency(cost)}
          </span>
        </div>
        {point?.allocationCount != null ? (
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#71717A]">Allocations Dispatched:</span>
            <span className="font-mono font-semibold text-[#F4F4F5]">
              {point.allocationCount}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  )
}

type ShippingCostTrendSectionProps = {
  data: ShippingCostTrendPoint[]
  timeRange: AnalyticsTimeRange
  onTimeRangeChange: (range: AnalyticsTimeRange) => void
  isLoading?: boolean
}

export function ShippingCostTrendSection({
  data,
  timeRange,
  onTimeRangeChange,
  isLoading = false,
}: ShippingCostTrendSectionProps) {
  const chartData = data.map((point) => ({
    ...point,
    label: formatChartDate(point.date),
  }))

  const totalAllocations = chartData.reduce((sum, p) => sum + p.allocationCount, 0)
  const averageCost =
    chartData.length > 0
      ? chartData.reduce((sum, p) => sum + p.averageShippingCost, 0) / chartData.length
      : 0

  const hasData = chartData.length > 0
  const isSinglePoint = chartData.length === 1

  return (
    <div className="flex flex-col h-full rounded-xl border border-[#262630] bg-[#17171B] shadow-xl overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#202027] px-6 py-4 bg-[#141418]">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#71717A]">
              FREIGHT ECONOMICS
            </span>
            <span className="text-[#262630]" aria-hidden="true">
              |
            </span>
            <h3 className="font-display text-xs font-bold tracking-wider text-[#F4F4F5] uppercase">
              SHIPPING COST TREND
            </h3>
          </div>
          <p className="mt-0.5 text-xs text-[#71717A]">
            Historical per-dispatch shipping expense over time
          </p>
        </div>

        {/* Header Right: Stats and Range selector */}
        <div className="flex items-center gap-3">
          {hasData ? (
            <div className="hidden sm:flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-[#F4F4F5] bg-[#1C1C21] px-2.5 py-1 rounded border border-[#262630]">
                Avg {formatCurrency(averageCost)}
              </span>
              <span className="font-mono text-[11px] text-[#71717A]">
                ({totalAllocations} {totalAllocations === 1 ? 'dispatch' : 'dispatches'})
              </span>
            </div>
          ) : null}

          {/* Inline Range Selector */}
          <div
            role="group"
            aria-label="Shipping trend range"
            className="inline-flex items-center rounded border border-[#262630] bg-[#1C1C21] p-0.5"
          >
            {(['7D', '30D', '90D'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => onTimeRangeChange(r)}
                aria-pressed={timeRange === r}
                className={cn(
                  'rounded px-2.5 py-1 font-mono text-[11px] font-medium transition-colors',
                  'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C4622D]',
                  timeRange === r
                    ? 'bg-[#262630] font-semibold text-[#F4F4F5]'
                    : 'text-[#71717A] hover:text-[#F4F4F5]',
                )}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Body */}
      <div className="relative flex-1 p-5 sm:p-6 flex flex-col justify-between">
        {isLoading ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#17171B]/70 backdrop-blur-[1px]">
            <span className="font-mono text-xs text-[#A1A1AA] bg-[#1C1C21] px-3.5 py-1.5 rounded-md border border-[#262630] shadow-md">
              Syncing {timeRange} freight trend...
            </span>
          </div>
        ) : null}

        {!hasData ? (
          <div className="flex flex-col items-center justify-center py-12 text-center my-auto">
            <span className="font-display text-sm font-semibold text-[#F4F4F5]">
              No data for this period
            </span>
            <p className="mt-1 text-xs text-[#71717A]">
              {timeRange !== '90D'
                ? 'Try a wider date range (e.g. 30D or 90D) to inspect historical dispatches.'
                : 'No dispatches recorded in this historical interval.'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col flex-1 justify-between gap-3 sm:gap-4">
            {/* Chart Area with independent vertical space */}
            <div className="h-56 sm:h-64 w-full min-h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 12, right: 16, left: -10, bottom: 8 }}
                >
                  {/* Clean, restrained gridlines - horizontal only */}
                  <CartesianGrid strokeDasharray="3 3" stroke="#262630" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: '#71717A', fontSize: 10, fontFamily: 'monospace' }}
                    axisLine={{ stroke: '#262630' }}
                    tickLine={false}
                    padding={isSinglePoint ? { left: 40, right: 40 } : undefined}
                    minTickGap={20}
                  />
                  <YAxis
                    tick={{ fill: '#71717A', fontSize: 10, fontFamily: 'monospace' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `₹${v}`}
                    width={58}
                  />
                  <Tooltip content={<ShippingTrendTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="averageShippingCost"
                    name="Avg Freight"
                    stroke="#C4622D"
                    strokeWidth={2}
                    dot={
                      isSinglePoint
                        ? { r: 5, fill: '#C4622D', stroke: '#0E0E10', strokeWidth: 2 }
                        : { r: 3, fill: '#C4622D', stroke: '#0E0E10', strokeWidth: 1.5 }
                    }
                    activeDot={{
                      r: 5,
                      fill: '#C4622D',
                      stroke: '#F4F4F5',
                      strokeWidth: 2,
                    }}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Bottom Annotation / Metadata - Fully visible, responsive, wrapped */}
            {isSinglePoint ? (
              <div className="flex items-center justify-center text-center pt-1 pb-0.5">
                <span className="inline-block font-mono text-[11px] leading-relaxed text-[#71717A] bg-[#141418] px-3 py-1.5 rounded border border-[#202027] max-w-full text-center break-words sm:whitespace-nowrap">
                  Single dispatch observation on {chartData[0].date}: {formatCurrency(chartData[0].averageShippingCost)} ({chartData[0].allocationCount} {chartData[0].allocationCount === 1 ? 'allocation' : 'allocations'})
                </span>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}
