import type { OrderStatus } from '../../types/order'
import type { OrdersByStatus } from '../../types/dashboard'
import { cn } from '../../utils/cn'

export type OrderStatusFilter = OrderStatus | 'ALL'

type OrderFiltersProps = {
  currentFilter: OrderStatusFilter
  statusData?: OrdersByStatus
  totalOrdersFromPage?: number
  onFilterChange: (filter: OrderStatusFilter) => void
}

const filterOptions: { id: OrderStatusFilter; label: string }[] = [
  { id: 'ALL', label: 'ALL' },
  { id: 'PENDING', label: 'PENDING' },
  { id: 'ALLOCATED', label: 'ALLOCATED' },
  { id: 'FULFILLING', label: 'FULFILLING' },
  { id: 'SHIPPED', label: 'SHIPPED' },
  { id: 'DELIVERED', label: 'DELIVERED' },
  { id: 'CANCELLED', label: 'CANCELLED' },
]

export function OrderFilters({
  currentFilter,
  statusData,
  totalOrdersFromPage = 0,
  onFilterChange,
}: OrderFiltersProps) {
  const getFilterCount = (filterId: OrderStatusFilter): number => {
    if (filterId === 'ALL') {
      return statusData?.totalOrders ?? totalOrdersFromPage
    }
    if (!statusData?.statuses) {
      return 0
    }
    const match = statusData.statuses.find((s) => s.status === filterId)
    return match ? match.count : 0
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[#202027] pb-3">
      {/* High-end developer interface status tabs */}
      <nav
        aria-label="Filter orders by fulfillment status"
        className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5"
      >
        {filterOptions.map((option) => {
          const isActive = currentFilter === option.id
          const count = getFilterCount(option.id)
          const isPending = option.id === 'PENDING'

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onFilterChange(option.id)}
              className={cn(
                'relative flex items-center gap-2 whitespace-nowrap px-3 py-2 font-mono text-xs font-medium transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4622D] rounded-t',
                isActive
                  ? 'text-[#F4F4F5]'
                  : 'text-[#71717A] hover:text-[#A1A1AA]',
              )}
            >
              <span>{option.label}</span>
              <span
                className={cn(
                  'rounded px-1.5 py-0.2 font-mono text-[10px] font-semibold',
                  isActive
                    ? isPending && count > 0
                      ? 'bg-[#C4622D]/20 text-[#C4622D]'
                      : 'bg-[#262630] text-[#F4F4F5]'
                    : isPending && count > 0
                    ? 'bg-[#C4622D]/10 text-[#C4622D]'
                    : 'bg-[#1C1C21] text-[#71717A]',
                )}
              >
                {count}
              </span>

              {/* Terracotta Underline for active tab */}
              {isActive && (
                <span
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C4622D]"
                  aria-hidden="true"
                />
              )}
            </button>
          )
        })}
      </nav>

      {/* Queue state indicator */}
      <div className="flex items-center gap-2 font-mono text-xs text-[#71717A] shrink-0">
        <span className="size-1.5 rounded-full bg-[#71717A]" aria-hidden="true" />
        <span>
          Showing:{' '}
          <strong className="text-[#F4F4F5]">
            {currentFilter === 'ALL' ? 'All Orders' : currentFilter}
          </strong>
        </span>
      </div>
    </div>
  )
}
