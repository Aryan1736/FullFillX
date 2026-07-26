import type { OrderStatus } from '../../types/order'
import { cn } from '../../utils/cn'
import { formatOrderStatus, getOrderStatusStyle } from '../../services/orderService'

type OrderStatusBadgeProps = {
  status: OrderStatus
  className?: string
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
        getOrderStatusStyle(status),
        className,
      )}
    >
      {formatOrderStatus(status)}
    </span>
  )
}
