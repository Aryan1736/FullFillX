import { Link } from 'react-router-dom'
import { AlertCircle, ArrowRight, ExternalLink } from 'lucide-react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import type {
  InventoryDistributionSlice,
  OrderStatus,
  OrderStatusCount,
  ShippingCostTrendPoint,
  WarehouseUtilizationItem,
} from '../../types/dashboard'
import { formatChartDate } from '../../services/dashboardService'
import { paths } from '../../routes/paths'
import { cn } from '../../utils/cn'
import { ChartCard } from './ChartCard'

type CustomTooltipPayload = {
  name?: string
  value?: number | string
  color?: string
}

type CustomTooltipProps = {
  active?: boolean
  payload?: CustomTooltipPayload[]
  label?: string
  formatter?: (val: number | string) => string
}

function CleanChartTooltip({
  active,
  payload,
  label,
  formatter,
}: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null
  }

  return (
    <div className="rounded border border-[#262630] bg-[#1C1C21] px-3 py-2 text-xs text-[#F4F4F5] shadow-xl">
      {label ? <p className="mb-1 font-mono text-[11px] text-[#71717A]">{label}</p> : null}
      <div className="space-y-1">
        {payload.map((item, idx) => {
          const formattedVal = formatter ? formatter(item.value ?? 0) : String(item.value)
          return (
            <div key={idx} className="flex items-center gap-2">
              <span
                className="size-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: item.color || '#C4622D' }}
              />
              <span className="text-[#A1A1AA]">{item.name || 'Value'}:</span>
              <span className="font-mono font-semibold text-[#F4F4F5]">{formattedVal}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* =========================================================================
   1. Warehouse Utilization - Ranked Operational List with Minimal Bars
   ========================================================================= */

type WarehouseUtilizationChartProps = {
  data: WarehouseUtilizationItem[]
}

export function WarehouseUtilizationChart({ data }: WarehouseUtilizationChartProps) {
  // Sort descending by utilization
  const sortedData = [...data].sort((a, b) => b.utilizationPercentage - a.utilizationPercentage)

  const avgUtilization =
    sortedData.length > 0
      ? (sortedData.reduce((sum, w) => sum + w.utilizationPercentage, 0) / sortedData.length).toFixed(1)
      : '0'

  return (
    <ChartCard
      title="WAREHOUSE NETWORK"
      description="Facility capacity load ranked by headroom constraint"
      badge={
        <span className="font-mono text-xs font-semibold text-[#F4F4F5] bg-[#141418] px-2 py-0.5 rounded border border-[#262630]">
          Mean {avgUtilization}%
        </span>
      }
      action={
        <Link
          to={paths.warehouses}
          className="inline-flex items-center gap-1 font-mono text-xs text-[#71717A] hover:text-[#C4622D] transition-colors"
        >
          <span>All Hubs</span>
          <ExternalLink className="size-3" />
        </Link>
      }
      isEmpty={sortedData.length === 0}
      emptyMessage="No warehouse utilization data available."
    >
      <div className="divide-y divide-[#202027] py-1">
        {sortedData.map((warehouse, idx) => {
          const pct = Math.min(100, Math.max(0, warehouse.utilizationPercentage))
          const isCritical = pct >= 85
          const isWarning = pct >= 70 && pct < 85

          const barColor = isCritical
            ? 'bg-[#C95555]'
            : isWarning
              ? 'bg-[#D08A35]'
              : 'bg-[#3FA66B]'

          const badgeColor = isCritical
            ? 'text-[#C95555]'
            : isWarning
              ? 'text-[#D08A35]'
              : 'text-[#A1A1AA]'

          const rank = String(idx + 1).padStart(2, '0')

          return (
            <div key={warehouse.warehouseId} className="py-2.5 first:pt-0 last:pb-0">
              <div className="flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="font-mono text-[11px] text-[#71717A]">{rank}</span>
                  <span className="font-medium text-[#F4F4F5] truncate">
                    {warehouse.warehouseName}
                  </span>
                  {warehouse.city ? (
                    <span className="font-mono text-[11px] text-[#71717A] shrink-0">
                      [{warehouse.city}]
                    </span>
                  ) : null}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {warehouse.capacity > 0 ? (
                    <span className="font-mono text-[11px] text-[#71717A] hidden sm:inline">
                      {warehouse.currentLoad.toLocaleString()} / {warehouse.capacity.toLocaleString()} u
                    </span>
                  ) : null}
                  <span className={cn('font-mono text-xs font-semibold', badgeColor)}>
                    {pct.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Minimal bar */}
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[#141418]">
                <div
                  className={cn('h-full rounded-full transition-all duration-300', barColor)}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </ChartCard>
  )
}

/* =========================================================================
   2. Order Pipeline - Sequential Lifecycle (Demand -> Decision -> Execution -> Delivery)
   ========================================================================= */

type OrdersByStatusChartProps = {
  data: OrderStatusCount[]
}

const LIFECYCLE_ORDER: { status: OrderStatus; label: string; phase: string }[] = [
  { status: 'PENDING', label: 'Pending', phase: 'DEMAND' },
  { status: 'ALLOCATED', label: 'Allocated', phase: 'DECISION' },
  { status: 'FULFILLING', label: 'Fulfilling', phase: 'PREP' },
  { status: 'SHIPPED', label: 'Shipped', phase: 'TRANSIT' },
  { status: 'DELIVERED', label: 'Delivered', phase: 'DELIVERY' },
]

export function OrdersByStatusChart({ data }: OrdersByStatusChartProps) {
  const totalOrders = data.reduce((sum, item) => sum + item.count, 0)
  const statusMap = new Map<string, number>(data.map((item) => [item.status, item.count]))

  const cancelledCount = statusMap.get('CANCELLED') ?? 0

  const stages = LIFECYCLE_ORDER.map((item) => {
    const count = statusMap.get(item.status) ?? 0
    const pct = totalOrders > 0 ? (count / totalOrders) * 100 : 0
    return {
      ...item,
      count,
      pct,
    }
  })

  return (
    <ChartCard
      title="ORDER PIPELINE"
      description="Demand → Decision → Execution → Delivery"
      badge={
        <span className="font-mono text-xs font-semibold text-[#F4F4F5] bg-[#141418] px-2 py-0.5 rounded border border-[#262630]">
          {totalOrders.toLocaleString()} Total Orders
        </span>
      }
      action={
        <Link
          to={paths.orders}
          className="inline-flex items-center gap-1 font-mono text-xs text-[#71717A] hover:text-[#C4622D] transition-colors"
        >
          <span>Queue</span>
          <ExternalLink className="size-3" />
        </Link>
      }
      isEmpty={data.length === 0}
      emptyMessage="No order status data available."
    >
      <div className="space-y-4 py-1">
        {/* Full-width segmented pipeline progress bar */}
        {totalOrders > 0 ? (
          <div className="space-y-1.5">
            <div className="flex h-2 w-full overflow-hidden rounded-full bg-[#141418]">
              {stages.map((stage, idx) => {
                if (stage.count === 0) return null
                const colors = [
                  'bg-[#C4622D]', // Pending (terracotta)
                  'bg-[#D08A35]', // Allocated (amber)
                  'bg-[#71717A]', // Fulfilling (neutral)
                  'bg-[#A1A1AA]', // Shipped
                  'bg-[#3FA66B]', // Delivered (success)
                ]
                return (
                  <div
                    key={stage.status}
                    style={{ width: `${stage.pct}%` }}
                    className={cn('h-full transition-all', colors[idx % colors.length])}
                    title={`${stage.status}: ${stage.count} (${stage.pct.toFixed(1)}%)`}
                  />
                )
              })}
            </div>
          </div>
        ) : null}

        {/* Sequential Lifecycle Stages */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {stages.map((stage, idx) => (
            <div
              key={stage.status}
              className="rounded border border-[#262630] bg-[#141418] p-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#71717A]">
                  0{idx + 1}
                </span>
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#71717A]">
                  {stage.phase}
                </span>
              </div>
              <p className="mt-1 font-sans text-xs font-semibold uppercase tracking-wider text-[#A1A1AA]">
                {stage.status}
              </p>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="font-display text-xl font-bold text-[#F4F4F5]">
                  {stage.count}
                </span>
                <span className="font-mono text-[10px] text-[#71717A]">
                  {stage.pct.toFixed(0)}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Separated Exception Status: Cancelled */}
        <div className="flex items-center justify-between rounded border border-[#262630] bg-[#141418] px-3.5 py-2 text-xs">
          <div className="flex items-center gap-2 text-[#71717A]">
            <AlertCircle className="size-3.5 text-[#C95555] shrink-0" aria-hidden="true" />
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#A1A1AA]">
              Exceptions & Cancellations:
            </span>
            <span className="text-[11px] hidden sm:inline">Orders voided prior to dispatch</span>
          </div>
          <div className="flex items-center gap-3 font-mono">
            <span className="text-[#C95555] font-semibold">
              {cancelledCount} {cancelledCount === 1 ? 'order' : 'orders'}
            </span>
            <Link
              to={paths.orders}
              className="text-[11px] text-[#71717A] hover:text-[#C4622D] transition-colors"
            >
              Inspect
            </Link>
          </div>
        </div>
      </div>
    </ChartCard>
  )
}

/* =========================================================================
   3. Shipping Cost Trend - Restrained Freight Economics
   ========================================================================= */

export type AnalyticsTimeRange = '7D' | '30D' | '90D'

type ShippingCostTrendChartProps = {
  data: ShippingCostTrendPoint[]
  selectedRange?: AnalyticsTimeRange
  onRangeChange?: (range: AnalyticsTimeRange) => void
  isLoading?: boolean
}

export function ShippingCostTrendChart({
  data,
  selectedRange,
  onRangeChange,
  isLoading = false,
}: ShippingCostTrendChartProps) {
  const chartData = data.map((point) => ({
    ...point,
    label: formatChartDate(point.date),
  }))

  const totalAllocations = chartData.reduce((sum, p) => sum + p.allocationCount, 0)
  const meanCost =
    chartData.length > 0
      ? (chartData.reduce((sum, p) => sum + p.averageShippingCost, 0) / chartData.length).toFixed(2)
      : '0.00'

  const rangeSelector = onRangeChange && selectedRange ? (
    <div
      role="group"
      aria-label="Historical time range"
      className="inline-flex items-center rounded border border-[#262630] bg-[#141418] p-0.5"
    >
      {(['7D', '30D', '90D'] as const).map((r) => {
        const isActive = selectedRange === r
        return (
          <button
            key={r}
            type="button"
            onClick={() => onRangeChange(r)}
            aria-pressed={isActive}
            className={cn(
              'rounded px-2.5 py-0.5 font-mono text-[11px] transition-colors',
              'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C4622D]',
              isActive
                ? 'bg-[#1C1C21] font-semibold text-[#F4F4F5]'
                : 'text-[#71717A] hover:text-[#F4F4F5]',
            )}
          >
            {r}
          </button>
        )
      })}
    </div>
  ) : null

  return (
    <ChartCard
      title="SHIPPING COST TREND"
      description="Mean dispatch freight rate over time"
      action={rangeSelector}
      badge={
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-xs font-semibold text-[#F4F4F5] bg-[#141418] px-2 py-0.5 rounded border border-[#262630]">
            Avg ₹{meanCost}
          </span>
          {chartData.length > 1 ? (
            <span className="font-mono text-[11px] text-[#71717A] hidden sm:inline">
              ({totalAllocations} dispatches)
            </span>
          ) : null}
        </div>
      }
      isEmpty={chartData.length === 0}
      emptyMessage={
        selectedRange
          ? `No shipping cost records found for ${selectedRange}.`
          : 'No shipping cost trend data available.'
      }
    >
      <div className={cn('h-60 w-full relative', isLoading && 'opacity-50 transition-opacity')}>
        {isLoading ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#17171B]/60 backdrop-blur-[1px]">
            <span className="font-mono text-xs text-[#A1A1AA] bg-[#1C1C21] px-3 py-1 rounded border border-[#262630]">
              Syncing {selectedRange} telemetry...
            </span>
          </div>
        ) : null}
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
          >
            <defs>
              <linearGradient id="shippingCostAreaDark" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C4622D" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#C4622D" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#262630" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: '#71717A', fontSize: 10, fontFamily: 'monospace' }}
              axisLine={{ stroke: '#262630' }}
              tickLine={false}
              padding={chartData.length === 1 ? { left: 40, right: 40 } : undefined}
              minTickGap={24}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fill: '#71717A', fontSize: 10, fontFamily: 'monospace' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `₹${v}`}
            />
            <Tooltip
              content={
                <CleanChartTooltip
                  formatter={(val) => `₹${Number(val).toFixed(2)}`}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="averageShippingCost"
              name="Avg Shipping Cost"
              stroke="#C4622D"
              strokeWidth={2}
              fill="url(#shippingCostAreaDark)"
              dot={
                chartData.length === 1
                  ? { r: 4, fill: '#C4622D', stroke: '#0E0E10', strokeWidth: 2 }
                  : false
              }
              activeDot={{ r: 4, fill: '#C4622D', stroke: '#F4F4F5', strokeWidth: 1.5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  )
}

/* =========================================================================
   4. Inventory Distribution - Stock Classification
   ========================================================================= */

type InventoryDistributionChartProps = {
  data: InventoryDistributionSlice[]
}

export function InventoryDistributionChart({ data }: InventoryDistributionChartProps) {
  const totalItems = data.reduce((sum, item) => sum + item.value, 0)

  // Map incoming colors to dark palette
  const darkSlices = data.map((s) => {
    let color = '#71717A'
    if (s.name.toLowerCase().includes('in stock') || s.name.toLowerCase().includes('optimal')) {
      color = '#3FA66B'
    } else if (s.name.toLowerCase().includes('low')) {
      color = '#D08A35'
    } else if (s.name.toLowerCase().includes('out')) {
      color = '#C95555'
    }
    return { ...s, displayColor: color }
  })

  return (
    <ChartCard
      title="INVENTORY CLASSIFICATION"
      description="Stock health and catalog availability"
      badge={
        <span className="font-mono text-xs font-semibold text-[#F4F4F5] bg-[#141418] px-2 py-0.5 rounded border border-[#262630]">
          {totalItems.toLocaleString()} units
        </span>
      }
      action={
        <Link
          to={paths.inventory}
          className="inline-flex items-center gap-1 font-mono text-xs text-[#71717A] hover:text-[#C4622D] transition-colors"
        >
          <span>Inventory SKUs</span>
          <ArrowRight className="size-3" />
        </Link>
      }
      isEmpty={data.length === 0}
      emptyMessage="No inventory distribution data available."
    >
      <div className="flex flex-col sm:flex-row items-center gap-6 py-2">
        <div className="h-52 w-52 shrink-0 relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={darkSlices}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={54}
                paddingAngle={2}
              >
                {darkSlices.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={entry.displayColor}
                    stroke="#17171B"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                content={
                  <CleanChartTooltip
                    formatter={(val) => `${Number(val).toLocaleString()} units`}
                  />
                }
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="font-display text-xl font-bold text-[#F4F4F5]">
              {totalItems > 1000 ? `${(totalItems / 1000).toFixed(1)}k` : totalItems}
            </span>
            <span className="font-mono text-[9px] text-[#71717A] uppercase tracking-wider">
              TOTAL UNITS
            </span>
          </div>
        </div>

        {/* Legend table */}
        <div className="flex-1 w-full divide-y divide-[#202027]">
          {darkSlices.map((slice) => {
            const share = totalItems > 0 ? (slice.value / totalItems) * 100 : 0
            return (
              <div
                key={slice.name}
                className="flex items-center justify-between text-xs py-2 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="size-2 rounded-full shrink-0"
                    style={{ backgroundColor: slice.displayColor }}
                  />
                  <span className="font-medium text-[#F4F4F5]">{slice.name}</span>
                </div>
                <div className="flex items-center gap-3 font-mono">
                  <span className="text-[#71717A] text-[11px]">
                    {share.toFixed(1)}%
                  </span>
                  <span className="font-semibold text-[#F4F4F5]">
                    {slice.value.toLocaleString()}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </ChartCard>
  )
}
