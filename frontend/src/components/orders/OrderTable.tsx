import { Package } from 'lucide-react'

import type { CustomerOrder } from '../../types/order'
import { formatOrderDate, formatShortOrderId } from '../../services/orderService'
import { OrderStatusBadge } from './OrderStatusBadge'

type OrderTableProps = {
  orders: CustomerOrder[]
}

export function OrderTable({ orders }: OrderTableProps) {
  return (
    <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md md:block">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600"
              >
                Order ID
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600"
              >
                Customer
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600"
              >
                Status
              </th>
              <th
                scope="col"
                className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600 sm:table-cell"
              >
                Items
              </th>
              <th
                scope="col"
                className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600 md:table-cell"
              >
                Created
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((order) => (
              <tr key={order.id} className="transition-colors hover:bg-slate-50/80">
                <td className="whitespace-nowrap px-4 py-3.5">
                  <span className="font-mono text-sm font-medium text-slate-900" title={order.id}>
                    {formatShortOrderId(order.id)}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 text-sm text-slate-600">
                  {formatShortOrderId(order.customerId)}
                </td>
                <td className="whitespace-nowrap px-4 py-3.5">
                  <OrderStatusBadge status={order.status} />
                </td>
                <td className="hidden whitespace-nowrap px-4 py-3.5 text-sm text-slate-600 sm:table-cell">
                  <span className="inline-flex items-center gap-1.5">
                    <Package className="size-3.5 text-slate-400" aria-hidden="true" />
                    {order.totalItems}
                  </span>
                </td>
                <td className="hidden whitespace-nowrap px-4 py-3.5 text-sm text-slate-600 md:table-cell">
                  {formatOrderDate(order.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function OrderCardList({ orders }: OrderTableProps) {
  return (
    <div className="grid gap-4 md:hidden">
      {orders.map((order) => (
        <article
          key={order.id}
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-mono text-sm font-semibold text-slate-900">{formatShortOrderId(order.id)}</p>
              <p className="mt-1 text-xs text-slate-500">Customer {formatShortOrderId(order.customerId)}</p>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-xs text-slate-500">Items</dt>
              <dd className="mt-0.5 font-medium text-slate-900">{order.totalItems}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Created</dt>
              <dd className="mt-0.5 font-medium text-slate-900">{formatOrderDate(order.createdAt)}</dd>
            </div>
          </dl>
        </article>
      ))}
    </div>
  )
}
