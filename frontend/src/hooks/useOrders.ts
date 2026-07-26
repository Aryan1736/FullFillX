import { useQuery } from '@tanstack/react-query'

import { fetchCustomerOrders } from '../api/customerOrderApi'
import type { CustomerOrderQueryParams } from '../types/order'

export const ordersQueryKey = ['orders'] as const

export function useOrders(params: CustomerOrderQueryParams) {
  return useQuery({
    queryKey: [...ordersQueryKey, params],
    queryFn: () => fetchCustomerOrders(params),
    placeholderData: (previousData) => previousData,
  })
}
