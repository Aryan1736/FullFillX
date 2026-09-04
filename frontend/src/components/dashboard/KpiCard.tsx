import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Boxes, Package, Warehouse } from 'lucide-react'

import type { DashboardKpis, InventoryStatus } from '../../types/dashboard'
import {
  formatCompactNumber,
  formatCurrency,
  formatHours,
  formatPercent,
} from '../../services/dashboardService'
import { paths } from '../../routes/paths'
import { cn } from '../../utils/cn'

/* =========================================================================
   Individual KpiCard (Used across drawers and sub-pages)
   ========================================================================= */

type KpiCardVariant = 'primary' | 'secondary'

type KpiCardProps = {
  title: string
  value: string
  icon?: LucideIcon
  description?: string
  variant?: KpiCardVariant
  className?: string
}

export function KpiCard({
  title,
  value,
  icon: Icon,
  description,
  variant = 'primary',
  className,
}: KpiCardProps) {
  return (
    <article
      className={cn(
        'rounded-lg border border-[#262630] bg-[#17171B] p-4 transition-colors hover:border-[#3a3a48]',
        variant === 'secondary' && 'bg-[#141418] p-3.5',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="font-sans text-xs font-medium text-[#71717A]">{title}</p>
        {Icon ? <Icon className="size-4 text-[#71717A]" aria-hidden="true" /> : null}
      </div>
      <p className="mt-2 font-display text-2xl font-bold tracking-tight text-[#F4F4F5]">{value}</p>
      {description ? <p className="mt-1 truncate text-xs text-[#71717A]">{description}</p> : null}
    </article>
  )
}

/* =========================================================================
   Unified Primary KPI Summary Panel - "OPERATIONS OVERVIEW"
   ========================================================================= */

type PrimaryKpiSummaryProps = {
  kpis: DashboardKpis
}

export function PrimaryKpiSummary({ kpis }: PrimaryKpiSummaryProps) {
  const metrics = [
    {
      id: 'orders',
      label: 'TOTAL ORDERS',
      value: formatCompactNumber(kpis.totalOrders),
      context: 'Network intake volume',
    },
    {
      id: 'shipping-cost',
      label: 'AVG FREIGHT',
      value: formatCurrency(kpis.averageShippingCost),
      context: 'Mean dispatch rate',
    },
    {
      id: 'warehouse-utilization',
      label: 'NETWORK UTILIZATION',
      value: formatPercent(kpis.warehouseUtilization),
      context: 'Storage capacity load',
      valueColor: kpis.warehouseUtilization >= 80 ? 'text-[#D08A35]' : 'text-[#F4F4F5]',
    },
    {
      id: 'eta',
      label: 'MEAN ETA',
      value: formatHours(kpis.averageETA),
      context: 'Average transit duration',
    },
  ]

  return (
    <section
      aria-label="Operations Overview"
      className="overflow-hidden rounded-xl border border-[#262630] bg-[#17171B]"
    >
      <div className="border-b border-[#262630] px-5 py-3">
        <h2 className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[#71717A]">
          OPERATIONS OVERVIEW
        </h2>
      </div>

      <div className="grid grid-cols-1 divide-y divide-[#262630] sm:grid-cols-2 sm:divide-y-0 sm:divide-x lg:grid-cols-4">
        {metrics.map((m) => (
          <div
            key={m.id}
            className="flex flex-col justify-between p-5 lg:p-6 transition-colors duration-150 hover:bg-[#1C1C21]/60"
          >
            <div>
              <p className="font-sans text-[11px] font-semibold uppercase tracking-wider text-[#71717A]">
                {m.label}
              </p>
              <p
                className={cn(
                  'mt-2.5 font-display text-3xl font-bold tracking-tight sm:text-4xl',
                  m.valueColor ?? 'text-[#F4F4F5]',
                )}
              >
                {m.value}
              </p>
            </div>

            <p className="mt-3 text-xs leading-normal text-[#71717A]">
              {m.context}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

/* =========================================================================
   Secondary Operational Information Strip
   ========================================================================= */

type SecondaryOperationalStripProps = {
  kpis: DashboardKpis
  inventoryStatus?: InventoryStatus
}

export function SecondaryOperationalStrip({
  kpis,
  inventoryStatus,
}: SecondaryOperationalStripProps) {
  const lowStock = inventoryStatus?.lowStockCount ?? 0
  const outOfStock = inventoryStatus?.outOfStockCount ?? 0
  const attentionCount = lowStock + outOfStock

  return (
    <section
      aria-label="Secondary Operational Network Data"
      className="rounded-xl border border-[#262630] bg-[#17171B] p-5"
    >
      <div className="mb-4 flex items-center justify-between border-b border-[#262630] pb-3">
        <h3 className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[#71717A]">
          NETWORK SUPPORTING INFRASTRUCTURE
        </h3>
        <span className="font-mono text-[11px] text-[#71717A]">Active Assets</span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link
          to={paths.warehouses}
          className="interactive-card group flex items-center justify-between rounded-lg border border-[#262630] bg-[#141418] p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4622D]"
        >
          <div className="min-w-0">
            <p className="text-xs font-medium text-[#71717A]">Active Fulfillment Hubs</p>
            <p className="mt-1 font-display text-2xl font-bold text-[#F4F4F5]">
              {formatCompactNumber(kpis.totalWarehouses)}
            </p>
            <p className="mt-0.5 text-[11px] text-[#71717A]">Operational nodes</p>
          </div>
          <div className="flex size-9 shrink-0 items-center justify-center rounded border border-[#262630] bg-[#17171B] text-[#A1A1AA] transition-colors group-hover:border-[#C4622D]/50 group-hover:text-[#C4622D]">
            <Warehouse className="size-4" />
          </div>
        </Link>

        <Link
          to={paths.inventory}
          className="interactive-card group flex items-center justify-between rounded-lg border border-[#262630] bg-[#141418] p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4622D]"
        >
          <div className="min-w-0">
            <p className="text-xs font-medium text-[#71717A]">Tracked SKU Catalog</p>
            <p className="mt-1 font-display text-2xl font-bold text-[#F4F4F5]">
              {formatCompactNumber(kpis.totalProducts)}
            </p>
            <p className="mt-0.5 text-[11px] text-[#71717A]">Distinct identifiers</p>
          </div>
          <div className="flex size-9 shrink-0 items-center justify-center rounded border border-[#262630] bg-[#17171B] text-[#A1A1AA] transition-colors group-hover:border-[#C4622D]/50 group-hover:text-[#C4622D]">
            <Boxes className="size-4" />
          </div>
        </Link>

        <Link
          to={paths.inventory}
          className="interactive-card group flex items-center justify-between rounded-lg border border-[#262630] bg-[#141418] p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4622D]"
        >
          <div className="min-w-0">
            <p className="text-xs font-medium text-[#71717A]">Inventory Fill Ratio</p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-display text-2xl font-bold text-[#F4F4F5]">
                {formatPercent(kpis.inventoryUtilization)}
              </span>
              {attentionCount > 0 ? (
                <span className="font-mono text-[11px] font-semibold text-[#D08A35]">
                  ({attentionCount} low/out)
                </span>
              ) : null}
            </div>
            <p className="mt-0.5 text-[11px] text-[#71717A]">Allocated vs capacity</p>
          </div>
          <div className="flex size-9 shrink-0 items-center justify-center rounded border border-[#262630] bg-[#17171B] text-[#A1A1AA] transition-colors group-hover:border-[#C4622D]/50 group-hover:text-[#C4622D]">
            <Package className="size-4" />
          </div>
        </Link>
      </div>
    </section>
  )
}

export function KpiCardSkeleton() {
  return (
    <div
      className="animate-skeleton rounded-xl border border-[#262630] bg-[#17171B] p-6"
      aria-hidden="true"
    >
      <div className="space-y-3">
        <div className="h-3.5 w-24 rounded bg-[#262630]" />
        <div className="h-8 w-32 rounded bg-[#262630]" />
        <div className="h-3 w-40 rounded bg-[#202027]" />
      </div>
    </div>
  )
}
