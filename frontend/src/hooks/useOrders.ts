import { useQuery } from '@tanstack/react-query'

import { fetchCustomerOrders } from '../api/customerOrderApi'
import { fetchOrdersByStatus } from '../api/dashboardApi'
import type { CustomerOrderQueryParams } from '../types/order'

export const ordersQueryKey = ['orders'] as const
export const ordersByStatusQueryKey = ['orders-by-status'] as const

export function useOrders(params: CustomerOrderQueryParams) {
  return useQuery({
    queryKey: [...ordersQueryKey, params],
    queryFn: () => fetchCustomerOrders(params),
    placeholderData: (previousData) => previousData,
  })
}

export function useOrdersStatusBreakdown() {
  return useQuery({
    queryKey: ordersByStatusQueryKey,
    queryFn: () => fetchOrdersByStatus(),
    staleTime: 30_000,
  })
}

