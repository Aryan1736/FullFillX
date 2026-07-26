import {
  Boxes,
  Clock3,
  IndianRupee,
  Package,
  Percent,
  ShoppingCart,
  Warehouse,
} from 'lucide-react'

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

export function DashboardPage() {
  const { data: result, isLoading, isError, isMock, refetch } = useDashboard()

  if (isLoading) {
    return (
      <div>
        <PageHeader
          title="Dashboard"
          description="Overview of fulfillment performance, active orders, and warehouse health."
        />
        <DashboardSkeleton />
      </div>
    )
  }

  if (isError || !result) {
    return (
      <div>
        <PageHeader
          title="Dashboard"
          description="Overview of fulfillment performance, active orders, and warehouse health."
        />
        <DashboardErrorState onRetry={() => void refetch()} />
      </div>
    )
  }

  const { data } = result

  if (isDashboardEmpty(data)) {
    return (
      <div>
        <PageHeader
          title="Dashboard"
          description="Overview of fulfillment performance, active orders, and warehouse health."
        />
        <DashboardEmptyState />
      </div>
    )
  }

  const { kpis } = data

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of fulfillment performance, active orders, and warehouse health."
      />

      {isMock ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Backend unavailable. Showing temporary demo data until the API is reachable.
        </div>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Total Warehouses"
          value={formatCompactNumber(kpis.totalWarehouses)}
          icon={Warehouse}
        />
        <KpiCard
          title="Total Products"
          value={formatCompactNumber(kpis.totalProducts)}
          icon={Boxes}
        />
        <KpiCard
          title="Total Orders"
          value={formatCompactNumber(kpis.totalOrders)}
          icon={ShoppingCart}
        />
        <KpiCard
          title="Inventory Utilization"
          value={formatPercent(kpis.inventoryUtilization)}
          icon={Package}
        />
        <KpiCard
          title="Warehouse Utilization"
          value={formatPercent(kpis.warehouseUtilization)}
          icon={Percent}
        />
        <KpiCard
          title="Average Shipping Cost"
          value={formatCurrency(kpis.averageShippingCost)}
          icon={IndianRupee}
        />
        <KpiCard
          title="Average ETA"
          value={formatHours(kpis.averageETA)}
          icon={Clock3}
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <WarehouseUtilizationChart data={data.warehouseUtilization} />
        <InventoryDistributionChart data={data.inventoryDistribution} />
        <ShippingCostTrendChart data={data.shippingCostTrend} />
        <OrdersByStatusChart data={data.ordersByStatus} />
      </section>
    </div>
  )
}
