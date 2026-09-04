import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { warehouseService } from '../services/warehouseService'
import type {
  CreateWarehouseRequest,
  UpdateWarehouseRequest,
  WarehouseQueryParams,
} from '../types/warehouse'

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

export function useCreateWarehouse() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateWarehouseRequest) => warehouseService.createWarehouse(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: warehousesQueryKey })
      void queryClient.invalidateQueries({ queryKey: warehouseCitiesQueryKey })
      void queryClient.invalidateQueries({ queryKey: ['warehouses', 'map'] })
      void queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export function useUpdateWarehouse() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateWarehouseRequest }) =>
      warehouseService.updateWarehouse(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: warehousesQueryKey })
      void queryClient.invalidateQueries({ queryKey: warehouseCitiesQueryKey })
      void queryClient.invalidateQueries({ queryKey: ['warehouses', 'map'] })
      void queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export function useDeleteWarehouse() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => warehouseService.deleteWarehouse(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: warehousesQueryKey })
      void queryClient.invalidateQueries({ queryKey: warehouseCitiesQueryKey })
      void queryClient.invalidateQueries({ queryKey: ['warehouses', 'map'] })
      void queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

