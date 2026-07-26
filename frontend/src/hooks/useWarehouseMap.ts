import { useQuery } from '@tanstack/react-query'

import { allocationService } from '../services/allocationService'
import { warehouseMapService } from '../services/warehouseMapService'

export const warehouseMapQueryKey = ['warehouses', 'map'] as const

export function useWarehouseMapData() {
  return useQuery({
    queryKey: warehouseMapQueryKey,
    queryFn: () => warehouseMapService.getMapData(),
    staleTime: 60_000,
  })
}

export function useWarehouseAllocations(warehouseId: string | null) {
  return useQuery({
    queryKey: ['allocations', 'warehouse-map', warehouseId],
    queryFn: () =>
      allocationService.getAllocations({
        page: 0,
        size: 50,
        warehouseId: warehouseId!,
        sort: { field: 'createdAt', direction: 'desc' },
      }),
    enabled: Boolean(warehouseId),
  })
}
