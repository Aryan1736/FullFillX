import type { OrdersByStatus } from '../../types/dashboard'

type OrderOverviewProps = {
  statusData?: OrdersByStatus
  totalOrdersFromPage?: number
  isLoading?: boolean
}

export function OrderOverview({
  statusData,
  totalOrdersFromPage = 0,
  isLoading = false,
}: OrderOverviewProps) {
  const getCount = (statusName: string): number => {
    if (!statusData?.statuses) return 0
    const match = statusData.statuses.find((s) => s.status === statusName)
    return match ? match.count : 0
  }

  const totalOrders = statusData?.totalOrders ?? totalOrdersFromPage
  const pendingCount = getCount('PENDING')
  const allocatedCount = getCount('ALLOCATED')
  const fulfillingCount = getCount('FULFILLING')
  const shippedCount = getCount('SHIPPED')
  const deliveredCount = getCount('DELIVERED')

  return (
    <section
      aria-label="Order Overview"
      className="rounded-xl border border-[#262630] bg-[#17171B] p-5 lg:p-6 shadow-xl"
    >
      <div className="flex items-center justify-between pb-4 border-b border-[#202027]">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#71717A]">
            OPERATIONAL METRICS
          </span>
          <span className="text-[#262630]" aria-hidden="true">|</span>
          <span className="font-mono text-[11px] font-medium text-[#A1A1AA]">
            ORDER OVERVIEW
          </span>
        </div>

        {pendingCount > 0 ? (
          <div className="flex items-center gap-1.5 rounded-full border border-[#C4622D]/30 bg-[#C4622D]/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-[#C4622D]">
            <span className="size-1.5 rounded-full bg-[#C4622D] animate-pulse" aria-hidden="true" />
            <span>{pendingCount} AWAITING ALLOCATION</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 rounded-full border border-[#3FA66B]/30 bg-[#3FA66B]/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-[#3FA66B]">
            <span className="size-1.5 rounded-full bg-[#3FA66B]" aria-hidden="true" />
            <span>QUEUE CLEAR</span>
          </div>
        )}
      </div>

      {/* Unified Metrics Strip with Subtle Vertical Dividers */}
      <div className="grid grid-cols-2 gap-y-6 pt-5 sm:grid-cols-3 lg:grid-cols-6 lg:divide-x lg:divide-[#202027]">
        {/* TOTAL ORDERS */}
        <div className="px-2 sm:px-4">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-wider text-[#71717A]">
            Total Orders
          </p>
          <p className="mt-2 font-display text-2xl font-bold tracking-tight text-[#F4F4F5] sm:text-3xl">
            {isLoading ? <span className="animate-pulse text-[#71717A]">--</span> : totalOrders}
          </p>
          <p className="mt-1 font-mono text-[10px] text-[#71717A]">All records</p>
        </div>

        {/* PENDING */}
        <div className="px-2 sm:px-4">
          <div className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-[#C4622D]" aria-hidden="true" />
            <p className="font-sans text-[11px] font-semibold uppercase tracking-wider text-[#C4622D]">
              Pending
            </p>
          </div>
          <p className="mt-2 font-display text-2xl font-bold tracking-tight text-[#C4622D] sm:text-3xl">
            {isLoading ? <span className="animate-pulse text-[#71717A]">--</span> : pendingCount}
          </p>
          <p className="mt-1 font-mono text-[10px] text-[#A1A1AA]">Needs action</p>
        </div>

        {/* ALLOCATED */}
        <div className="px-2 sm:px-4">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-wider text-[#71717A]">
            Allocated
          </p>
          <p className="mt-2 font-display text-2xl font-bold tracking-tight text-[#F4F4F5] sm:text-3xl">
            {isLoading ? <span className="animate-pulse text-[#71717A]">--</span> : allocatedCount}
          </p>
          <p className="mt-1 font-mono text-[10px] text-[#71717A]">Hub assigned</p>
        </div>

        {/* FULFILLING */}
        <div className="px-2 sm:px-4">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-wider text-[#71717A]">
            Fulfilling
          </p>
          <p className="mt-2 font-display text-2xl font-bold tracking-tight text-[#F4F4F5] sm:text-3xl">
            {isLoading ? <span className="animate-pulse text-[#71717A]">--</span> : fulfillingCount}
          </p>
          <p className="mt-1 font-mono text-[10px] text-[#71717A]">In preparation</p>
        </div>

        {/* SHIPPED */}
        <div className="px-2 sm:px-4">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-wider text-[#71717A]">
            Shipped
          </p>
          <p className="mt-2 font-display text-2xl font-bold tracking-tight text-[#F4F4F5] sm:text-3xl">
            {isLoading ? <span className="animate-pulse text-[#71717A]">--</span> : shippedCount}
          </p>
          <p className="mt-1 font-mono text-[10px] text-[#71717A]">In transit</p>
        </div>

        {/* DELIVERED */}
        <div className="px-2 sm:px-4">
          <div className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-[#3FA66B]" aria-hidden="true" />
            <p className="font-sans text-[11px] font-semibold uppercase tracking-wider text-[#3FA66B]">
              Delivered
            </p>
          </div>
          <p className="mt-2 font-display text-2xl font-bold tracking-tight text-[#3FA66B] sm:text-3xl">
            {isLoading ? <span className="animate-pulse text-[#71717A]">--</span> : deliveredCount}
          </p>
          <p className="mt-1 font-mono text-[10px] text-[#71717A]">Completed</p>
        </div>
      </div>
    </section>
  )
}
