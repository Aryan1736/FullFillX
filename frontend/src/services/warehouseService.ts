import { fetchWarehouseById, fetchWarehouses } from '../api/warehouseApi'
import type {
  PageResponse,
  Warehouse,
  WarehouseQueryParams,
  WarehouseSort,
} from '../types/warehouse'
import { toggleSort as toggleSortUtil } from '../utils/toggleSort'

export class WarehouseService {
  async getWarehouses(params: WarehouseQueryParams): Promise<PageResponse<Warehouse>> {
    return fetchWarehouses(params)
  }

  async getWarehouseById(id: string): Promise<Warehouse> {
    return fetchWarehouseById(id)
  }

  async getDistinctCities(): Promise<string[]> {
    const response = await fetchWarehouses({
      page: 0,
      size: 100,
      sort: { field: 'city', direction: 'asc' },
    })

    const cities = new Set<string>()
    for (const warehouse of response.content) {
      if (warehouse.city.trim()) {
        cities.add(warehouse.city)
      }
    }

    return Array.from(cities).sort((left, right) => left.localeCompare(right))
  }
}

export const warehouseService = new WarehouseService()

export function calculateUtilization(warehouse: Warehouse): number {
  if (warehouse.capacity <= 0) {
    return 0
  }

  return (warehouse.currentLoad / warehouse.capacity) * 100
}

export function formatUtilization(value: number): string {
  return `${value.toFixed(1)}%`
}

export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat('en-IN').format(value)
}

export function formatCoordinate(value: number): string {
  return value.toFixed(4)
}

export function formatDateTime(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export function getUtilizationTone(value: number): 'low' | 'medium' | 'high' {
  if (value >= 80) {
    return 'high'
  }

  if (value >= 50) {
    return 'medium'
  }

  return 'low'
}

export function getStatusLabel(active: boolean): string {
  return active ? 'Active' : 'Inactive'
}

export function buildSortParam(sort?: WarehouseSort): string | undefined {
  if (!sort) {
    return undefined
  }

  return `${sort.field},${sort.direction}`
}

export function toggleSort(
  current: WarehouseSort,
  field: WarehouseSort['field'],
): WarehouseSort {
  return toggleSortUtil(current, field)
}
