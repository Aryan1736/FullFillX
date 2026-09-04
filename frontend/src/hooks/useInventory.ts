import { useQuery } from '@tanstack/react-query'

import { inventoryService } from '../services/inventoryService'
import type { InventoryQueryParams } from '../types/inventory'

export const inventoryQueryKey = ['inventory'] as const
export const inventoryStatusQueryKey = ['inventory-status'] as const

export function useInventory(params: InventoryQueryParams) {
  return useQuery({
    queryKey: [...inventoryQueryKey, params],
    queryFn: () => inventoryService.getInventory(params),
    placeholderData: (previousData) => previousData,
  })
}

export function useInventoryStatus() {
  return useQuery({
    queryKey: inventoryStatusQueryKey,
    queryFn: () => inventoryService.getInventoryStatus(),
    staleTime: 30_000,
  })
}

