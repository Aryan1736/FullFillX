import { useQuery } from '@tanstack/react-query'

import { fetchCustomers } from '../api/customerApi'

export const customersQueryKey = ['customers'] as const

export function useCustomers() {
  return useQuery({
    queryKey: customersQueryKey,
    queryFn: () =>
      fetchCustomers({
        page: 0,
        size: 200,
        sort: 'name,asc',
      }),
    staleTime: 5 * 60_000,
  })
}
