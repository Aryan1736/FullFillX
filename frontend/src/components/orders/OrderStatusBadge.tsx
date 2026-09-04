import type { OrderStatus } from '../../types/order'
import { formatOrderStatus } from '../../services/orderService'
import { cn } from '../../utils/cn'

type OrderStatusBadgeProps = {
  status: OrderStatus
  className?: string
  pulsePending?: boolean
}

type StatusTheme = {
  label: string
  dotClass: string
  textClass: string
}

const statusConfig: Record<OrderStatus, StatusTheme> = {
  PENDING: {
    label: 'PENDING',
    dotClass: 'bg-[#C4622D]',
    textClass: 'text-[#C4622D] font-bold',
  },
  ALLOCATED: {
    label: 'ALLOCATED',
    dotClass: 'bg-[#60A5FA]',
    textClass: 'text-[#93C5FD]',
  },
  FULFILLING: {
    label: 'FULFILLING',
    dotClass: 'bg-[#818CF8]',
    textClass: 'text-[#A5B4FC]',
  },
  SHIPPED: {
    label: 'SHIPPED',
    dotClass: 'bg-[#A78BFA]',
    textClass: 'text-[#C4B5FD]',
  },
  DELIVERED: {
    label: 'DELIVERED',
    dotClass: 'bg-[#3FA66B]',
    textClass: 'text-[#3FA66B]',
  },
  CANCELLED: {
    label: 'CANCELLED',
    dotClass: 'bg-[#71717A]',
    textClass: 'text-[#71717A]',
  },
}

export function OrderStatusBadge({ status, className, pulsePending = true }: OrderStatusBadgeProps) {
  const config = statusConfig[status] ?? {
    label: formatOrderStatus(status).toUpperCase(),
    dotClass: 'bg-[#71717A]',
    textClass: 'text-[#A1A1AA]',
  }

  const shouldPulse = pulsePending && (status === 'PENDING' || status === 'FULFILLING')

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-mono text-[11px] tracking-wider',
        config.textClass,
        className,
      )}
    >
      <span className="relative flex size-1.5 shrink-0 items-center justify-center">
        {shouldPulse ? (
          <span
            className={cn(
              'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
              config.dotClass,
            )}
          />
        ) : null}
        <span className={cn('relative inline-flex size-1.5 rounded-full', config.dotClass)} />
      </span>
      <span>{config.label}</span>
    </span>
  )
}
