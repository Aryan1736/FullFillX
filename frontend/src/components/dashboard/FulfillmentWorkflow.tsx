import { Link } from 'react-router-dom'
import { ArrowRight, Boxes, Cpu, LineChart, PackageCheck, ShoppingCart, Warehouse } from 'lucide-react'

import type { DashboardData } from '../../types/dashboard'
import { formatCompactNumber, formatHours } from '../../services/dashboardService'
import { paths } from '../../routes/paths'
import { cn } from '../../utils/cn'

type FulfillmentWorkflowProps = {
  data: DashboardData
}

export function FulfillmentWorkflow({ data }: FulfillmentWorkflowProps) {
  const { kpis, ordersByStatus } = data
  const pendingCount = ordersByStatus.find((s) => s.status === 'PENDING')?.count ?? 0
  const allocatedCount = ordersByStatus
    .filter((s) => s.status === 'ALLOCATED' || s.status === 'FULFILLING')
    .reduce((sum, s) => sum + s.count, 0)

  const steps = [
    {
      step: '01',
      title: 'ORDER',
      label: 'Demand Intake',
      description: 'Customer orders ingested into pipeline',
      to: paths.orders,
      icon: ShoppingCart,
      metric: `${formatCompactNumber(kpis.totalOrders)} total · ${pendingCount} pending`,
      isActive: pendingCount > 0,
      statusLabel: pendingCount > 0 ? `${pendingCount} awaiting` : 'Clear',
    },
    {
      step: '02',
      title: 'OPTIMIZE',
      label: 'Strategy Engine',
      description: 'Solve optimal warehouse & shipping routes',
      to: paths.optimization,
      icon: Cpu,
      metric: 'Multi-hub solver engine',
      isActive: pendingCount > 0,
      statusLabel: pendingCount > 0 ? 'Action ready' : 'Standby',
    },
    {
      step: '03',
      title: 'ALLOCATE',
      label: 'Stock Reservation',
      description: 'Commit items & lock facility dispatches',
      to: paths.allocations,
      icon: PackageCheck,
      metric: `${formatCompactNumber(allocatedCount)} active assignments`,
      isActive: true,
      statusLabel: `${allocatedCount} locked`,
    },
    {
      step: '04',
      title: 'MONITOR',
      label: 'Transit Telemetry',
      description: 'Audit freight costs & customer SLA fulfillment',
      to: paths.analytics,
      icon: LineChart,
      metric: `~${formatHours(kpis.averageETA)} mean transit`,
      isActive: true,
      statusLabel: 'Telemetry live',
    },
  ]

  return (
    <section
      aria-label="Fulfillment Operating Workflow"
      className="rounded-xl border border-[#262630] bg-[#17171B] p-5 sm:p-6"
    >
      {/* Header */}
      <div className="flex flex-col gap-1 border-b border-[#262630] pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#71717A]">
            Core Operating Lifecycle
          </span>
          <h2 className="font-display text-lg font-bold tracking-tight text-[#F4F4F5]">
            How FulfillX Turns Demand Into Dispatches
          </h2>
        </div>
        <p className="text-xs text-[#71717A]">
          Step-by-step pipeline from customer cart to last-mile delivery
        </p>
      </div>

      {/* Connected Process Timeline */}
      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-4">
        {steps.map((step, idx) => {
          const Icon = step.icon
          return (
            <div key={step.title} className="relative flex flex-col">
              <Link
                to={step.to}
                className={cn(
                  'group relative flex h-full flex-col justify-between rounded-lg border p-4 transition-all duration-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4622D]',
                  step.isActive
                    ? 'border-[#C4622D] bg-[#1C1C21] shadow-sm hover:-translate-y-1 hover:border-[#C4622D] hover:shadow-lg hover:shadow-[#C4622D]/10'
                    : 'border-[#262630] bg-[#17171B] hover:-translate-y-1 hover:border-[#3a3a48] hover:bg-[#1C1C21] hover:shadow-lg',
                )}
              >
                <div>
                  {/* Step Header */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'font-mono text-xs font-bold tracking-wider',
                          step.isActive ? 'text-[#C4622D]' : 'text-[#71717A]',
                        )}
                      >
                        {step.step}
                      </span>
                      <span className="font-display text-sm font-bold tracking-wider text-[#F4F4F5]">
                        {step.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {step.isActive ? (
                        <span className="inline-flex items-center gap-1 rounded border border-[#C4622D]/40 bg-[#C4622D]/15 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[#C4622D]">
                          <span className="size-1 rounded-full bg-[#C4622D] animate-pulse" />
                          {step.statusLabel}
                        </span>
                      ) : (
                        <span className="font-mono text-[10px] text-[#71717A]">
                          {step.statusLabel}
                        </span>
                      )}
                      <div
                        className={cn(
                          'flex size-6 items-center justify-center rounded border transition-colors',
                          step.isActive
                            ? 'border-[#C4622D]/50 bg-[#C4622D]/10 text-[#C4622D]'
                            : 'border-[#262630] bg-[#17171B] text-[#71717A] group-hover:text-[#F4F4F5] group-hover:border-[#71717A]',
                        )}
                      >
                        <Icon className="size-3.5" aria-hidden="true" />
                      </div>
                    </div>
                  </div>

                  {/* Subtitle & Description */}
                  <p className="mt-2.5 text-xs font-medium text-[#F4F4F5]">
                    {step.label}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-[#A1A1AA]">
                    {step.description}
                  </p>
                </div>

                {/* Metric & Navigation prompt */}
                <div className="mt-4 flex items-center justify-between border-t border-[#262630] pt-3 text-[11px]">
                  <span className="font-mono text-[#A1A1AA] truncate max-w-[170px]">
                    {step.metric}
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-[#C4622D] opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                    Open <ArrowRight className="size-3" />
                  </span>
                </div>
              </Link>

              {/* Connecting indicator on desktop */}
              {idx < steps.length - 1 ? (
                <div
                  className="pointer-events-none absolute -right-2 top-1/2 z-10 hidden -translate-y-1/2 lg:flex"
                  aria-hidden="true"
                >
                  <div className="flex size-4 items-center justify-center rounded-full border border-[#262630] bg-[#17171B] text-[#71717A]">
                    <ArrowRight className="size-2" />
                  </div>
                </div>
              ) : null}
            </div>
          )
        })}
      </div>

      {/* Supporting Infrastructure Strip */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#202027] bg-[#141418] px-4 py-2.5 text-xs text-[#71717A]">
        <div className="flex items-center gap-2">
          <span className="font-medium text-[#A1A1AA]">Foundation Infrastructure:</span>
          <span className="hidden sm:inline">
            Allocation algorithms route inventory using active facility models and SKU stock levels.
          </span>
        </div>
        <div className="flex items-center gap-4 font-mono text-[11px]">
          <Link
            to={paths.warehouses}
            className="inline-flex items-center gap-1.5 text-[#A1A1AA] hover:text-[#C4622D] transition-colors"
          >
            <Warehouse className="size-3 text-[#71717A]" />
            <span>{formatCompactNumber(kpis.totalWarehouses)} Hubs</span>
          </Link>
          <span className="text-[#262630]" aria-hidden="true">•</span>
          <Link
            to={paths.inventory}
            className="inline-flex items-center gap-1.5 text-[#A1A1AA] hover:text-[#C4622D] transition-colors"
          >
            <Boxes className="size-3 text-[#71717A]" />
            <span>{formatCompactNumber(kpis.totalProducts)} Catalog SKUs</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
