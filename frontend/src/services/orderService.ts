import type { OrderStatus } from '../types/order'
import { formatShortId } from '../utils/formatShortId'

const statusLabels: Record<OrderStatus, string> = {
  PENDING: 'Pending',
  ALLOCATED: 'Allocated',
  FULFILLING: 'Fulfilling',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
}

const statusStyles: Record<OrderStatus, string> = {
  PENDING: 'bg-[#D08A35]/15 text-[#D08A35] ring-1 ring-[#D08A35]/30',
  ALLOCATED: 'bg-[#C4622D]/15 text-[#C4622D] ring-1 ring-[#C4622D]/30',
  FULFILLING: 'bg-[#C4622D]/20 text-[#C4622D] ring-1 ring-[#C4622D]/40',
  SHIPPED: 'bg-[#A1A1AA]/15 text-[#F4F4F5] ring-1 ring-[#262630]',
  DELIVERED: 'bg-[#3FA66B]/15 text-[#3FA66B] ring-1 ring-[#3FA66B]/30',
  CANCELLED: 'bg-[#1C1C21] text-[#71717A] ring-1 ring-[#262630]',
}

export function formatOrderStatus(status: OrderStatus): string {
  return statusLabels[status] ?? status
}

export function getOrderStatusStyle(status: OrderStatus): string {
  return statusStyles[status] ?? statusStyles.PENDING
}

export function formatShortOrderId(id: string): string {
  return formatShortId(id, 10)
}

export function formatOrderDate(value: string): string {
  if (!value) {
    return '—'
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}
