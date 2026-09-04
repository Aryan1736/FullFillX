import { useMemo } from 'react'
import { Activity, AlertTriangle, Box, CheckCircle2, IndianRupee } from 'lucide-react'
import type {
  DashboardData,
  ShippingCostTrendPoint,
} from '../../types/dashboard'
import { formatCurrency } from '../../services/dashboardService'

type OperationalSignalsProps = {
  data: DashboardData
  trendData: ShippingCostTrendPoint[]
}

type SignalItem = {
  id: string
  title: string
  statement: string
  type: 'healthy' | 'attention' | 'neutral'
  icon: typeof Activity
}

export function OperationalSignals({ data, trendData }: OperationalSignalsProps) {
  const signals = useMemo((): SignalItem[] => {
    const list: SignalItem[] = []

    // 1. Warehouse Capacity Signal
    const warehouses = data.warehouseUtilization
    const highLoadCount = warehouses.filter((w) => w.utilizationPercentage >= 70).length
    const sortedWarehouses = [...warehouses].sort(
      (a, b) => b.utilizationPercentage - a.utilizationPercentage,
    )
    const topHub = sortedWarehouses[0]

    if (highLoadCount > 0 && topHub) {
      list.push({
        id: 'facility-pressure',
        title: 'NETWORK CAPACITY PRESSURE',
        statement: `${highLoadCount} ${highLoadCount === 1 ? 'facility is' : 'facilities are'} above the 70% attention threshold (peak load at ${topHub.warehouseName}: ${topHub.utilizationPercentage.toFixed(1)}%).`,
        type: 'attention',
        icon: AlertTriangle,
      })
    } else if (warehouses.length > 0 && topHub) {
      list.push({
        id: 'facility-headroom',
        title: 'NETWORK CAPACITY HEADROOM',
        statement: `All ${warehouses.length} active facilities operate within optimal capacity limits (peak load at ${topHub.warehouseName}: ${topHub.utilizationPercentage.toFixed(1)}%).`,
        type: 'healthy',
        icon: CheckCircle2,
      })
    }

    // 2. Inventory Stock Signal
    const inv = data.inventoryStatus
    if (inv) {
      if (inv.outOfStockCount > 0) {
        list.push({
          id: 'stock-out',
          title: 'INVENTORY EXPOSURE',
          statement: `${inv.outOfStockCount} catalog ${inv.outOfStockCount === 1 ? 'SKU is' : 'SKUs are'} out of stock; ${inv.lowStockCount} items are nearing safety reorder thresholds.`,
          type: 'attention',
          icon: AlertTriangle,
        })
      } else if (inv.lowStockCount > 0) {
        list.push({
          id: 'stock-low',
          title: 'CATALOG REORDER MONITOR',
          statement: `${inv.lowStockCount} catalog ${inv.lowStockCount === 1 ? 'SKU is' : 'SKUs are'} currently flagged with low stock reserves; 0 out-of-stock items detected across the catalog.`,
          type: 'attention',
          icon: Box,
        })
      } else {
        list.push({
          id: 'stock-healthy',
          title: 'INVENTORY INTEGRITY',
          statement: `Full catalog buffer intact: 0 low-stock and 0 stockout conditions across ${inv.inventoryRecordCount} active SKUs.`,
          type: 'healthy',
          icon: CheckCircle2,
        })
      }
    }

    // 3. Freight Economics Signal
    const totalDispatches = trendData.reduce((acc, p) => acc + p.allocationCount, 0)
    const avgFreight = data.kpis.averageShippingCost
    if (totalDispatches > 0 || avgFreight > 0) {
      list.push({
        id: 'freight-economics',
        title: 'FREIGHT EXPENDITURE',
        statement: `Mean dispatch freight is established at ${formatCurrency(avgFreight)}${totalDispatches > 0 ? ` across ${totalDispatches} recorded dispatches in the active time window` : ''}.`,
        type: 'neutral',
        icon: IndianRupee,
      })
    }

    // 4. Pipeline Execution Signal
    const statusMap = new Map<string, number>(data.ordersByStatus.map((s) => [s.status, s.count]))
    const inFlight = (statusMap.get('SHIPPED') ?? 0) + (statusMap.get('FULFILLING') ?? 0)
    const pending = statusMap.get('PENDING') ?? 0
    const total = data.kpis.totalOrders
    if (total > 0) {
      const inFlightPct = ((inFlight / total) * 100).toFixed(1)
      list.push({
        id: 'pipeline-execution',
        title: 'FULFILLMENT PIPELINE',
        statement: `${inFlight} orders are actively fulfilling or in-transit (${inFlightPct}% of total orders); ${pending} orders await routing decisions.`,
        type: 'neutral',
        icon: Activity,
      })
    }

    return list
  }, [data, trendData])

  if (signals.length === 0) {
    return null
  }

  return (
    <section
      aria-label="Operational Signals"
      className="animate-section-5 rounded-xl border border-[#262630] bg-[#17171B] shadow-xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#202027] px-6 py-3.5 bg-[#141418]">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#71717A]">
            INTELLIGENCE LAYER
          </span>
          <span className="text-[#262630]" aria-hidden="true">
            |
          </span>
          <h2 className="font-display text-xs font-bold tracking-wider text-[#F4F4F5] uppercase">
            OPERATIONAL SIGNALS
          </h2>
        </div>
        <span className="font-mono text-[11px] text-[#71717A]">
          DATA-DERIVED OBSERVATIONS
        </span>
      </div>

      {/* Signals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 divide-[#202027] p-4 sm:p-6 gap-4">
        {signals.map((signal) => {
          const Icon = signal.icon
          const borderStyle =
            signal.type === 'attention'
              ? 'border-[#D08A35]/30 bg-[#D08A35]/5'
              : signal.type === 'healthy'
                ? 'border-[#3FA66B]/30 bg-[#3FA66B]/5'
                : 'border-[#262630] bg-[#141418]'

          const iconColor =
            signal.type === 'attention'
              ? 'text-[#D08A35]'
              : signal.type === 'healthy'
                ? 'text-[#3FA66B]'
                : 'text-[#C4622D]'

          return (
            <div
              key={signal.id}
              className={`rounded-lg border p-4 flex items-start gap-3.5 ${borderStyle}`}
            >
              <Icon className={`size-4 shrink-0 mt-0.5 ${iconColor}`} aria-hidden="true" />
              <div className="space-y-1">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#A1A1AA]">
                  {signal.title}
                </span>
                <p className="text-xs leading-relaxed text-[#F4F4F5]">
                  {signal.statement}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
