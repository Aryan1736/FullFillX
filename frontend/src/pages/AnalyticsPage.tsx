import { BarChart3, TrendingUp } from 'lucide-react'

import { PageHeader } from '../components/common/PageHeader'
import {
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
import { KpiCard } from '../components/dashboard/KpiCard'
import { useDashboard } from '../hooks/useDashboard'
import {
  formatCompactNumber,
  formatCurrency,
  formatHours,
  formatPercent,
  isDashboardEmpty,
} from '../services/dashboardService'

export function AnalyticsPage() {
  const { data: result, isLoading, isError, isMock, refetch } = useDashboard()

  if (isLoading) {
    return (
      <div>
        <PageHeader
          title="Analytics"
          description="Review fulfillment metrics, cost trends, and operational insights to optimize your network."
        />
        <DashboardSkeleton />
      </div>
    )
  }

  if (isError || !result) {
    return (
      <div>
        <PageHeader
          title="Analytics"
          description="Review fulfillment metrics, cost trends, and operational insights to optimize your network."
        />
        <DashboardErrorState
          message="Unable to load analytics data. Please try again."
          onRetry={() => void refetch()}
        />
      </div>
    )
  }

  const { data } = result

  if (isDashboardEmpty(data)) {
    return (
      <div>
        <PageHeader
          title="Analytics"
          description="Review fulfillment metrics, cost trends, and operational insights to optimize your network."
        />
        <DashboardEmptyState />
      </div>
    )
  }

  const { kpis } = data

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Review fulfillment metrics, cost trends, and operational insights to optimize your network."
      />

      {isMock ? (
        <div
          role="status"
          className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
        >
          Backend unavailable. Showing demo analytics until the API is reachable.
        </div>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Order Volume"
          value={formatCompactNumber(kpis.totalOrders)}
          icon={BarChart3}
          description="Total customer orders in the system"
        />
        <KpiCard
          title="Avg. Shipping Cost"
          value={formatCurrency(kpis.averageShippingCost)}
          icon={TrendingUp}
          description="Mean cost per allocation"
        />
        <KpiCard
          title="Warehouse Utilization"
          value={formatPercent(kpis.warehouseUtilization)}
          icon={TrendingUp}
          description="Network-wide capacity usage"
        />
        <KpiCard
          title="Average ETA"
          value={formatHours(kpis.averageETA)}
          icon={TrendingUp}
          description="Mean estimated delivery time"
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <ShippingCostTrendChart data={data.shippingCostTrend} />
        <OrdersByStatusChart data={data.ordersByStatus} />
        <WarehouseUtilizationChart data={data.warehouseUtilization} />
        <InventoryDistributionChart data={data.inventoryDistribution} />
      </section>
    </div>
  )
}
