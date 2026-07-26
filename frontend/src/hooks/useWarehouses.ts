import { useQuery } from '@tanstack/react-query'

import { warehouseService } from '../services/warehouseService'
import type { WarehouseQueryParams } from '../types/warehouse'

export const warehousesQueryKey = ['warehouses'] as const
export const warehouseCitiesQueryKey = ['warehouses', 'cities'] as const

export function useWarehouses(params: WarehouseQueryParams) {
  return useQuery({
    queryKey: [...warehousesQueryKey, params],
    queryFn: () => warehouseService.getWarehouses(params),
    placeholderData: (previousData) => previousData,
  })
}

export function useWarehouse(id: string | null) {
  return useQuery({
    queryKey: [...warehousesQueryKey, 'detail', id],
    queryFn: () => warehouseService.getWarehouseById(id!),
    enabled: Boolean(id),
  })
}

export function useWarehouseCities() {
  return useQuery({
    queryKey: warehouseCitiesQueryKey,
    queryFn: () => warehouseService.getDistinctCities(),
    staleTime: 5 * 60_000,
  })
}
