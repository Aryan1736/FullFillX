import { useQuery } from '@tanstack/react-query'

import { fetchCustomerOrderById, fetchCustomerOrders } from '../api/customerOrderApi'
import { allocationService } from '../services/allocationService'
import type { AllocationQueryParams } from '../types/allocation'

export const allocationsQueryKey = ['allocations'] as const
export const customerOrdersQueryKey = ['customer-orders'] as const

export function useAllocations(params: AllocationQueryParams) {
  return useQuery({
    queryKey: [...allocationsQueryKey, params],
    queryFn: () => allocationService.getAllocations(params),
    placeholderData: (previousData) => previousData,
  })
}

export function useAllocation(id: string | null) {
  return useQuery({
    queryKey: [...allocationsQueryKey, 'detail', id],
    queryFn: () => allocationService.getAllocationById(id!),
    enabled: Boolean(id),
  })
}

export function useCustomerOrdersForFilter() {
  return useQuery({
    queryKey: [...customerOrdersQueryKey, 'filter-options'],
    queryFn: () => fetchCustomerOrders({ page: 0, size: 100 }),
    staleTime: 5 * 60_000,
  })
}

export function useCustomerOrder(id: string | null) {
  return useQuery({
    queryKey: [...customerOrdersQueryKey, 'detail', id],
    queryFn: () => fetchCustomerOrderById(id!),
    enabled: Boolean(id),
  })
}
