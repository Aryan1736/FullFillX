import { useQuery } from '@tanstack/react-query'

import { fetchProducts } from '../api/productApi'

export const productsQueryKey = ['products'] as const

export function useProducts() {
  return useQuery({
    queryKey: productsQueryKey,
    queryFn: () =>
      fetchProducts({
        page: 0,
        size: 200,
        sort: 'name,asc',
      }),
    staleTime: 5 * 60_000,
  })
}
