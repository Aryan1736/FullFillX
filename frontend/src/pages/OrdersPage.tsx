import { useState } from 'react'

import { Pagination } from '../components/common/Pagination'
import { PageHeader } from '../components/common/PageHeader'
import { OrderCardList, OrderTable } from '../components/orders/OrderTable'
import { OrderEmptyState, OrderErrorState, OrderTableSkeleton } from '../components/orders/OrderStates'
import { useOrders } from '../hooks/useOrders'

const PAGE_SIZE = 10

export function OrdersPage() {
  const [page, setPage] = useState(0)
  const { data, isLoading, isError, refetch, isFetching } = useOrders({ page, size: PAGE_SIZE })

  const orders = data?.content ?? []

  return (
    <div className="space-y-6">
      <PageHeader
        title="Orders"
        description="Monitor customer orders, fulfillment status, and allocation progress across the network."
      />

      {isLoading ? <OrderTableSkeleton /> : null}

      {!isLoading && isError ? <OrderErrorState onRetry={() => void refetch()} /> : null}

      {!isLoading && !isError && orders.length === 0 ? <OrderEmptyState /> : null}

      {!isLoading && !isError && orders.length > 0 ? (
        <>
          <OrderTable orders={orders} />
          <OrderCardList orders={orders} />

          <Pagination
            page={page}
            pageSize={PAGE_SIZE}
            totalElements={data?.totalElements ?? 0}
            totalPages={data?.totalPages ?? 0}
            isFirst={data?.first ?? page === 0}
            isLast={data?.last ?? page >= (data?.totalPages ?? 1) - 1}
            isFetching={isFetching}
            onPageChange={setPage}
            itemLabel="orders"
          />
        </>
      ) : null}
    </div>
  )
}
