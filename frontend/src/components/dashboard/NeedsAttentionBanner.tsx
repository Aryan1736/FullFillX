import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

import type { DashboardData } from '../../types/dashboard'
import { paths } from '../../routes/paths'

type NeedsAttentionBannerProps = {
  data: DashboardData
}

export function NeedsAttentionBanner({ data }: NeedsAttentionBannerProps) {
  const { ordersByStatus, warehouseUtilization, inventoryStatus, inventoryDistribution } = data

  const pendingOrders = ordersByStatus.find((s) => s.status === 'PENDING')?.count ?? 0
  const highSaturationWarehouses = warehouseUtilization.filter(
    (w) => w.utilizationPercentage >= 80,
  )

  const lowStockCount =
    inventoryStatus?.lowStockCount ??
    inventoryDistribution.find((s) => s.name === 'Low Stock')?.value ??
    0
  const outOfStockCount =
    inventoryStatus?.outOfStockCount ??
    inventoryDistribution.find((s) => s.name === 'Out of Stock')?.value ??
    0
  const totalInventoryAlerts = lowStockCount + outOfStockCount

  const hasIssues =
    pendingOrders > 0 || highSaturationWarehouses.length > 0 || totalInventoryAlerts > 0

  if (!hasIssues) {
    return (
      <section
        aria-label="Operational Status"
        className="flex items-center justify-between gap-4 rounded-xl border border-[#262630] bg-[#17171B] px-5 py-3.5"
      >
        <div className="flex items-center gap-3">
          <CheckCircle2 className="size-4 text-[#3FA66B] shrink-0" aria-hidden="true" />
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#3FA66B]">
              Network Healthy
            </span>
            <span className="text-[#262630]" aria-hidden="true">•</span>
            <p className="text-xs text-[#A1A1AA]">
              All fulfillment hubs have sufficient headroom and all intake orders are allocated.
            </p>
          </div>
        </div>
        <Link
          to={paths.analytics}
          className="shrink-0 inline-flex items-center gap-1 font-mono text-xs text-[#71717A] hover:text-[#F4F4F5] transition-colors"
        >
          View Telemetry <ArrowRight className="size-3" />
        </Link>
      </section>
    )
  }

  return (
    <section
      aria-label="Immediate Operational Actions"
      className="rounded-xl border border-[#262630] bg-[#17171B] p-5"
    >
      <div className="flex items-center justify-between border-b border-[#262630] pb-3">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-[#D08A35] animate-pulse" aria-hidden="true" />
          <h2 className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[#F4F4F5]">
            NEEDS ATTENTION
          </h2>
        </div>
        <span className="font-mono text-[11px] text-[#71717A]">
          Action Queue
        </span>
      </div>

      <div className="mt-3 divide-y divide-[#202027]">
        {/* Pending Orders Condition: Primary Action (Terracotta) */}
        {pendingOrders > 0 ? (
          <div className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="size-1.5 rounded-full bg-[#C4622D] shrink-0" aria-hidden="true" />
              <div>
                <p className="text-xs text-[#F4F4F5]">
                  <span className="font-semibold text-[#F4F4F5]">{pendingOrders} {pendingOrders === 1 ? 'order' : 'orders'}</span>
                  {' '}awaiting fulfillment optimization
                </p>
                <p className="text-[11px] text-[#71717A]">
                  Unallocated customer orders require facility routing
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 pl-4.5 sm:pl-0">
              <Link
                to={paths.orders}
                className="text-xs text-[#71717A] hover:text-[#A1A1AA] transition-colors"
              >
                View Orders
              </Link>
              <Link
                to={paths.optimization}
                className="inline-flex items-center gap-1.5 rounded border border-[#C4622D] bg-[#C4622D] px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-[#9E4A20] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4622D]"
              >
                <span>Optimize Orders</span>
                <ArrowRight className="size-3" />
              </Link>
            </div>
          </div>
        ) : null}

        {/* High Saturation Warehouses Condition (Amber/Critical) */}
        {highSaturationWarehouses.length > 0 ? (
          <div className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="size-1.5 rounded-full bg-[#D08A35] shrink-0" aria-hidden="true" />
              <div>
                <p className="text-xs text-[#F4F4F5]">
                  <span className="font-semibold text-[#D08A35]">{highSaturationWarehouses.length} {highSaturationWarehouses.length === 1 ? 'hub' : 'hubs'}</span>
                  {' '}approaching capacity constraint (≥80%)
                </p>
                <p className="text-[11px] text-[#71717A]">
                  Constrained headroom may cause cross-zone order splitting
                </p>
              </div>
            </div>

            <div className="flex items-center pl-4.5 sm:pl-0">
              <Link
                to={paths.warehouses}
                className="inline-flex items-center gap-1 text-xs font-medium text-[#D08A35] hover:text-[#e5a049] transition-colors"
              >
                <span>Review Warehouses</span>
                <ArrowRight className="size-3" />
              </Link>
            </div>
          </div>
        ) : null}

        {/* Stock Depletion Condition (Amber) */}
        {totalInventoryAlerts > 0 ? (
          <div className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="size-1.5 rounded-full bg-[#D08A35] shrink-0" aria-hidden="true" />
              <div>
                <p className="text-xs text-[#F4F4F5]">
                  <span className="font-semibold text-[#D08A35]">{totalInventoryAlerts} SKU{totalInventoryAlerts === 1 ? '' : 's'}</span>
                  {' '}approaching stock depletion ({lowStockCount} low{outOfStockCount > 0 ? `, ${outOfStockCount} out` : ''})
                </p>
                <p className="text-[11px] text-[#71717A]">
                  Restock allocations prevent fulfillment order holds
                </p>
              </div>
            </div>

            <div className="flex items-center pl-4.5 sm:pl-0">
              <Link
                to={paths.inventory}
                className="inline-flex items-center gap-1 text-xs font-medium text-[#A1A1AA] hover:text-[#F4F4F5] transition-colors"
              >
                <span>Review Inventory</span>
                <ArrowRight className="size-3" />
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
