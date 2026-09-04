import { ChevronRight } from 'lucide-react'
import type { OrderStatus } from '../../types/order'
import type { OrdersByStatus } from '../../types/dashboard'
import { cn } from '../../utils/cn'

type OrderLifecycleProps = {
  statusData?: OrdersByStatus
  activeStatusFilter: OrderStatus | 'ALL'
  onSelectStatus: (status: OrderStatus | 'ALL') => void
  isLoading?: boolean
}

type PipelineStage = {
  step: string
  status: OrderStatus
  title: string
  description: string
  dotClass: string
  accentBorderClass: string
}

const pipelineStages: PipelineStage[] = [
  {
    step: '01',
    status: 'PENDING',
    title: 'PENDING',
    description: 'Awaiting optimization',
    dotClass: 'bg-[#C4622D]',
    accentBorderClass: 'border-[#C4622D]/40',
  },
  {
    step: '02',
    status: 'ALLOCATED',
    title: 'ALLOCATED',
    description: 'Warehouse assigned',
    dotClass: 'bg-[#60A5FA]',
    accentBorderClass: 'border-[#60A5FA]/40',
  },
  {
    step: '03',
    status: 'FULFILLING',
    title: 'FULFILLING',
    description: 'Dispatch in progress',
    dotClass: 'bg-[#818CF8]',
    accentBorderClass: 'border-[#818CF8]/40',
  },
  {
    step: '04',
    status: 'SHIPPED',
    title: 'SHIPPED',
    description: 'In transit',
    dotClass: 'bg-[#A78BFA]',
    accentBorderClass: 'border-[#A78BFA]/40',
  },
  {
    step: '05',
    title: 'DELIVERED',
    status: 'DELIVERED',
    description: 'Completed',
    dotClass: 'bg-[#3FA66B]',
    accentBorderClass: 'border-[#3FA66B]/40',
  },
]

export function OrderLifecycle({
  statusData,
  activeStatusFilter,
  onSelectStatus,
  isLoading = false,
}: OrderLifecycleProps) {
  const getCount = (status: OrderStatus): number => {
    if (!statusData?.statuses) return 0
    const match = statusData.statuses.find((s) => s.status === status)
    return match ? match.count : 0
  }

  const cancelledCount = getCount('CANCELLED')

  return (
    <section
      aria-label="Fulfillment Lifecycle Pipeline"
      className="rounded-xl border border-[#262630] bg-[#17171B] p-5 lg:p-6 shadow-xl"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-[#202027]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#71717A]">
              FULFILLMENT PIPELINE
            </span>
            <span className="text-[#262630]" aria-hidden="true">|</span>
            <span className="font-mono text-[11px] text-[#A1A1AA]">
              LIFECYCLE FLOW
            </span>
          </div>
          <p className="text-xs text-[#71717A]">
            Sequential order transition flow from initial demand through committed hub delivery.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-[#71717A]">
            Total Volume: <strong className="text-[#F4F4F5]">{statusData?.totalOrders ?? 0}</strong>
          </span>
        </div>
      </div>

      {/* Connected Operational Pipeline Area */}
      <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-[1fr_auto] items-stretch">
        {/* Stages 01 to 05 connected */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {pipelineStages.map((stage, index) => {
            const count = getCount(stage.status)
            const isPending = stage.status === 'PENDING'
            const isSelected = activeStatusFilter === stage.status
            const hasPendingAction = isPending && count > 0

            return (
              <div key={stage.status} className="relative flex flex-col">
                <button
                  type="button"
                  onClick={() => onSelectStatus(isSelected ? 'ALL' : stage.status)}
                  className={cn(
                    'group flex flex-col justify-between h-full rounded-lg border p-3.5 text-left transition-all duration-200',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4622D]',
                    isSelected
                      ? 'border-[#C4622D] bg-[#1C1C21] shadow-md shadow-[#C4622D]/5'
                      : hasPendingAction
                      ? 'border-[#C4622D]/40 bg-[#1C1C21]/70 hover:border-[#C4622D]/70'
                      : 'border-[#262630] bg-[#17171B] hover:border-[#71717A] hover:bg-[#1C1C21]/50',
                  )}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={cn(
                        'font-mono text-[10px] font-bold tracking-wider',
                        isSelected || hasPendingAction ? 'text-[#C4622D]' : 'text-[#71717A]',
                      )}
                    >
                      {stage.step}
                    </span>

                    <span className="flex items-center gap-1.5 font-mono text-[10px]">
                      <span className={cn('size-1.5 rounded-full shrink-0', stage.dotClass)} />
                      <span
                        className={cn(
                          'font-semibold uppercase tracking-wider text-[11px]',
                          isSelected ? 'text-[#F4F4F5]' : isPending ? 'text-[#C4622D]' : 'text-[#A1A1AA]',
                        )}
                      >
                        {stage.title}
                      </span>
                    </span>
                  </div>

                  <div className="mt-3 flex items-baseline justify-between">
                    <span
                      className={cn(
                        'font-display text-2xl font-bold tracking-tight',
                        isPending && count > 0 ? 'text-[#C4622D]' : 'text-[#F4F4F5]',
                      )}
                    >
                      {isLoading ? <span className="animate-pulse">--</span> : count}
                    </span>

                    {index < pipelineStages.length - 1 && (
                      <span className="hidden lg:inline text-[#71717A]/40 group-hover:text-[#A1A1AA] transition-colors">
                        <ChevronRight className="size-3.5" />
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-[11px] text-[#71717A] truncate">
                    {stage.description}
                  </p>
                </button>
              </div>
            )
          })}
        </div>

        {/* Separated Exception Area: CANCELLED */}
        <div className="xl:border-l xl:border-[#202027] xl:pl-4 flex">
          <button
            type="button"
            onClick={() => onSelectStatus(activeStatusFilter === 'CANCELLED' ? 'ALL' : 'CANCELLED')}
            className={cn(
              'group flex flex-col justify-between w-full rounded-lg border p-3.5 text-left transition-all duration-200 xl:w-44',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4622D]',
              activeStatusFilter === 'CANCELLED'
                ? 'border-[#71717A] bg-[#1C1C21]'
                : 'border-[#262630] bg-[#17171B] hover:border-[#71717A] hover:bg-[#1C1C21]/50',
            )}
          >
            <div className="flex items-center justify-between w-full">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#71717A]">
                EXCEPTION
              </span>
              <span className="size-1.5 rounded-full bg-[#71717A]" aria-hidden="true" />
            </div>

            <div className="mt-3 flex items-baseline justify-between">
              <span className="font-display text-2xl font-bold tracking-tight text-[#A1A1AA]">
                {isLoading ? <span className="animate-pulse">--</span> : cancelledCount}
              </span>
              <span className="font-mono text-[10px] uppercase text-[#71717A]">Terminated</span>
            </div>

            <p className="mt-1 text-[11px] text-[#71717A] truncate">
              Order cancelled
            </p>
          </button>
        </div>
      </div>
    </section>
  )
}
