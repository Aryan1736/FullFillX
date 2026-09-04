import { ArrowRight, Cpu, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'

import type { CustomerOrder } from '../../types/order'
import { formatOrderDate, formatShortOrderId } from '../../services/orderService'
import { paths } from '../../routes/paths'
import { OrderStatusBadge } from './OrderStatusBadge'
import { cn } from '../../utils/cn'

type OrderTableProps = {
  orders: CustomerOrder[]
  customerMap?: Record<string, string>
  onSelectOrder: (order: CustomerOrder) => void
}

export function OrderTable({ orders, customerMap = {}, onSelectOrder }: OrderTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#262630] bg-[#17171B] shadow-xl">
      {/* DESKTOP & TABLET OPERATIONAL TABLE */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#202027] bg-[#141417]">
              <th
                scope="col"
                className="py-3.5 pl-5 pr-4 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#71717A]"
              >
                Order
              </th>
              <th
                scope="col"
                className="px-4 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#71717A]"
              >
                Customer
              </th>
              <th
                scope="col"
                className="px-4 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#71717A]"
              >
                Items
              </th>
              <th
                scope="col"
                className="px-4 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#71717A]"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-4 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#71717A]"
              >
                Created
              </th>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-5 text-right font-mono text-[11px] font-semibold uppercase tracking-wider text-[#71717A]"
              >
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#202027]">
            {orders.map((order) => {
              const isPending = order.status === 'PENDING'
              const customerName = customerMap[order.customerId]
              const shortId = formatShortOrderId(order.id)
              const shortCustId = formatShortOrderId(order.customerId)

              return (
                <tr
                  key={order.id}
                  className={cn(
                    'group transition-colors duration-200',
                    isPending
                      ? 'border-l-2 border-l-[#C4622D] bg-[#1C1C21]/60 hover:bg-[#1F1F26]'
                      : 'hover:bg-[#1C1C21]/50',
                  )}
                >
                  {/* ORDER IDENTIFIER */}
                  <td className="py-3.5 pl-5 pr-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-[#F4F4F5]">
                        #ORD-{shortId}
                      </span>
                    </div>
                  </td>

                  {/* CUSTOMER */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div>
                      <p className="text-xs font-medium text-[#F4F4F5]">
                        {customerName || `Customer ${shortCustId}`}
                      </p>
                      <p className="font-mono text-[10px] text-[#71717A]">
                        CUST-{shortCustId}
                      </p>
                    </div>
                  </td>

                  {/* ITEMS */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="font-mono text-xs text-[#A1A1AA]">
                      {order.totalItems} {order.totalItems === 1 ? 'item' : 'items'}
                    </span>
                  </td>

                  {/* STATUS */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <OrderStatusBadge status={order.status} />
                  </td>

                  {/* CREATED TIMESTAMP */}
                  <td className="px-4 py-3.5 whitespace-nowrap font-mono text-xs text-[#71717A]">
                    {formatOrderDate(order.createdAt)}
                  </td>

                  {/* ACTIONS */}
                  <td className="py-3.5 pl-4 pr-5 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-3">
                      {isPending && (
                        <Link
                          to={paths.optimization}
                          className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-[#C4622D] transition-all hover:text-[#9E4A20] hover:translate-x-0.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C4622D] rounded"
                          title="Run optimization heuristics for this pending order"
                        >
                          <Cpu className="size-3 shrink-0" />
                          <span>Optimize</span>
                          <ArrowRight className="size-3 shrink-0" />
                        </Link>
                      )}

                      <button
                        type="button"
                        onClick={() => onSelectOrder(order)}
                        className="inline-flex items-center gap-1 font-mono text-xs font-medium text-[#A1A1AA] transition-all hover:text-[#F4F4F5] hover:translate-x-0.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C4622D] rounded px-1.5 py-0.5"
                      >
                        <Eye className="size-3 text-[#71717A]" />
                        <span>View</span>
                        <span aria-hidden="true">&rarr;</span>
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* MOBILE STACKED CARD-LIKE ROWS */}
      <div className="divide-y divide-[#202027] md:hidden">
        {orders.map((order) => {
          const isPending = order.status === 'PENDING'
          const customerName = customerMap[order.customerId]
          const shortId = formatShortOrderId(order.id)
          const shortCustId = formatShortOrderId(order.customerId)

          return (
            <article
              key={order.id}
              className={cn(
                'p-4 transition-colors duration-200',
                isPending
                  ? 'border-l-2 border-l-[#C4622D] bg-[#1C1C21]/60'
                  : 'bg-[#17171B]',
              )}
            >
              {/* Header: Order ID & Status */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-mono text-xs font-bold text-[#F4F4F5]">
                    #ORD-{shortId}
                  </span>
                  <p className="mt-0.5 text-xs font-medium text-[#F4F4F5]">
                    {customerName || `Customer ${shortCustId}`}
                  </p>
                </div>
                <OrderStatusBadge status={order.status} />
              </div>

              {/* Items & Placed timestamp */}
              <div className="mt-3 grid grid-cols-2 gap-2 border-t border-[#202027] pt-2.5 font-mono text-xs">
                <div>
                  <span className="text-[10px] uppercase text-[#71717A]">Items</span>
                  <p className="text-[#A1A1AA]">{order.totalItems} units</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-[#71717A]">Created</span>
                  <p className="text-[#71717A] truncate">{formatOrderDate(order.createdAt)}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-3 flex items-center justify-end gap-3 pt-2 border-t border-[#202027]">
                {isPending && (
                  <Link
                    to={paths.optimization}
                    className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-[#C4622D] hover:text-[#9E4A20]"
                  >
                    <Cpu className="size-3" />
                    <span>Optimize</span>
                    <ArrowRight className="size-3" />
                  </Link>
                )}

                <button
                  type="button"
                  onClick={() => onSelectOrder(order)}
                  className="inline-flex items-center gap-1 font-mono text-xs font-medium text-[#A1A1AA] hover:text-[#F4F4F5]"
                >
                  <Eye className="size-3 text-[#71717A]" />
                  <span>View Details &rarr;</span>
                </button>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
