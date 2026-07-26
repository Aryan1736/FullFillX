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
  PENDING: 'bg-amber-50 text-amber-800 ring-amber-200',
  ALLOCATED: 'bg-sky-50 text-sky-800 ring-sky-200',
  FULFILLING: 'bg-indigo-50 text-indigo-800 ring-indigo-200',
  SHIPPED: 'bg-violet-50 text-violet-800 ring-violet-200',
  DELIVERED: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  CANCELLED: 'bg-slate-100 text-slate-600 ring-slate-200',
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
