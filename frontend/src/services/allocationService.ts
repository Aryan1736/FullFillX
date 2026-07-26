import { fetchAllocationById, fetchAllocations } from '../api/allocationApi'
import type {
  Allocation,
  AllocationQueryParams,
  AllocationSort,
  PageResponse,
} from '../types/allocation'
import { formatDateTime } from './warehouseService'
import { formatOptimizationCurrency, formatOptimizationEta, formatScore } from './optimizationService'
import { formatShortId as formatShortIdUtil } from '../utils/formatShortId'
import { toggleSort as toggleSortUtil } from '../utils/toggleSort'

export class AllocationService {
  async getAllocations(params: AllocationQueryParams): Promise<PageResponse<Allocation>> {
    return fetchAllocations(params)
  }

  async getAllocationById(id: string): Promise<Allocation> {
    return fetchAllocationById(id)
  }
}

export const allocationService = new AllocationService()

export function toggleAllocationSort(
  current: AllocationSort,
  field: AllocationSort['field'],
): AllocationSort {
  return toggleSortUtil(current, field, 'desc')
}

export function formatAllocationDate(value: string): string {
  return formatDateTime(value)
}

export function formatAllocationScore(value: number): string {
  return formatScore(value)
}

export function formatAllocationCurrency(value: number): string {
  return formatOptimizationCurrency(value)
}

export function formatAllocationEta(hours: number): string {
  return formatOptimizationEta(hours)
}

export function formatShortId(value: string): string {
  return formatShortIdUtil(value)
}

export function getWarehouseNames(allocation: Allocation): string {
  const names = allocation.warehouses
    .map((entry) => entry.warehouse?.name)
    .filter((name): name is string => Boolean(name))

  if (names.length === 0) {
    return '—'
  }

  return names.join(', ')
}

export function getTotalProductQuantity(allocation: Allocation): number {
  return allocation.products.reduce((total, entry) => total + entry.quantity, 0)
}

export function isSplitShipment(allocation: Allocation): boolean {
  return allocation.warehouses.length > 1
}
