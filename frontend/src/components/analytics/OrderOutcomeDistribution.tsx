import { useMemo } from 'react'
import type { OrderStatus, OrderStatusCount } from '../../types/dashboard'
import { cn } from '../../utils/cn'

type OrderOutcomeDistributionProps = {
  data: OrderStatusCount[]
}

type StatusMeta = {
  status: OrderStatus
  label: string
  description: string
  color: string
  barClass: string
}

const ORDER_STATUS_METADATA: StatusMeta[] = [
  {
    status: 'DELIVERED',
    label: 'Delivered',
    description: 'Received by customer',
    color: '#3FA66B',
    barClass: 'bg-[#3FA66B]',
  },
  {
    status: 'SHIPPED',
    label: 'Shipped',
    description: 'In-transit with freight carrier',
    color: '#A1A1AA',
    barClass: 'bg-[#A1A1AA]',
  },
  {
    status: 'FULFILLING',
    label: 'Fulfilling',
    description: 'Facility pick, pack & staging',
    color: '#71717A',
    barClass: 'bg-[#71717A]',
  },
  {
    status: 'ALLOCATED',
    label: 'Allocated',
    description: 'Inventory committed to facility',
    color: '#D08A35',
    barClass: 'bg-[#D08A35]',
  },
  {
    status: 'PENDING',
    label: 'Pending',
    description: 'Awaiting optimization run',
    color: '#C4622D',
    barClass: 'bg-[#C4622D]',
  },
  {
    status: 'CANCELLED',
    label: 'Cancelled',
    description: 'Voided before delivery',
    color: '#C95555',
    barClass: 'bg-[#C95555]',
  },
]

export function OrderOutcomeDistribution({ data }: OrderOutcomeDistributionProps) {
  const { totalOrders, outcomes } = useMemo(() => {
    const statusMap = new Map<string, number>(data.map((item) => [item.status, item.count]))
    const total = data.reduce((sum, item) => sum + item.count, 0)

    const list = ORDER_STATUS_METADATA.map((meta) => {
      const count = statusMap.get(meta.status) ?? 0
      const percentage = total > 0 ? (count / total) * 100 : 0
      return {
        ...meta,
        count,
        percentage,
      }
    })

    return { totalOrders: total, outcomes: list }
  }, [data])

  return (
    <div className="flex flex-col h-full rounded-xl border border-[#262630] bg-[#17171B] shadow-xl overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#202027] px-6 py-4 bg-[#141418]">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#71717A]">
              DEMAND & EXECUTION
            </span>
            <span className="text-[#262630]" aria-hidden="true">
              |
            </span>
            <h3 className="font-display text-xs font-bold tracking-wider text-[#F4F4F5] uppercase">
              ORDER OUTCOMES
            </h3>
          </div>
          <p className="mt-0.5 text-xs text-[#71717A]">
            Distribution of orders across fulfillment lifecycle states
          </p>
        </div>

        <span className="font-mono text-xs font-semibold text-[#F4F4F5] bg-[#1C1C21] px-2.5 py-1 rounded border border-[#262630]">
          {totalOrders.toLocaleString()} Total Orders
        </span>
      </div>

      {/* Body */}
      <div className="flex-1 p-6 space-y-5 flex flex-col justify-between">
        {/* Proportional Segmented Bar */}
        {totalOrders > 0 ? (
          <div className="space-y-1.5">
            <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-[#141418] border border-[#202027]">
              {outcomes.map((item) => {
                if (item.count === 0) return null
                return (
                  <div
                    key={item.status}
                    style={{ width: `${item.percentage}%` }}
                    className={cn('h-full transition-all duration-300', item.barClass)}
                    title={`${item.label}: ${item.count} orders (${item.percentage.toFixed(1)}%)`}
                  />
                )
              })}
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono text-[#71717A]">
              <span>Active pipeline split</span>
              <span>100% Demand tracked</span>
            </div>
          </div>
        ) : null}

        {/* Detailed Minimal Status Breakdown */}
        <div className="divide-y divide-[#202027]">
          {outcomes.map((item) => (
            <div
              key={item.status}
              className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className="size-2 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[#F4F4F5]">{item.label}</span>
                    <span className="hidden sm:inline font-mono text-[10px] text-[#71717A]">
                      · {item.description}
                    </span>
                  </div>
                </div>
              </div>

              {/* Counts and percentage */}
              <div className="flex items-center gap-4 shrink-0 font-mono">
                <div className="w-16 hidden sm:block">
                  <div className="h-1.5 w-full bg-[#141418] rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full', item.barClass)}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
                <span className="text-[#71717A] text-[11px] w-12 text-right">
                  {item.percentage.toFixed(1)}%
                </span>
                <span className="font-bold text-[#F4F4F5] w-8 text-right">
                  {item.count}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
