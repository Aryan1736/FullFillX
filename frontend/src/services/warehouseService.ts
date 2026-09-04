import {
  createWarehouse as createWarehouseApi,
  deleteWarehouse as deleteWarehouseApi,
  fetchWarehouseById,
  fetchWarehouses,
  updateWarehouse as updateWarehouseApi,
} from '../api/warehouseApi'
import type {
  CreateWarehouseRequest,
  PageResponse,
  UpdateWarehouseRequest,
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

  async createWarehouse(payload: CreateWarehouseRequest): Promise<Warehouse> {
    return createWarehouseApi(payload)
  }

  async updateWarehouse(id: string, payload: UpdateWarehouseRequest): Promise<Warehouse> {
    return updateWarehouseApi(id, payload)
  }

  async deleteWarehouse(id: string): Promise<void> {
    return deleteWarehouseApi(id)
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

export function getUtilizationColor(percentage: number): string {
  if (percentage >= 85) return '#C95555'
  if (percentage >= 70) return '#D08A35'
  return '#3FA66B'
}

export type UtilizationSemantic = {
  label: 'HEALTHY' | 'ATTENTION' | 'CRITICAL'
  color: string
  bg: string
  border: string
}

export function getUtilizationSemantic(percentage: number): UtilizationSemantic {
  if (percentage >= 85) {
    return {
      label: 'CRITICAL',
      color: '#C95555',
      bg: 'rgba(201, 85, 85, 0.12)',
      border: 'rgba(201, 85, 85, 0.28)',
    }
  }
  if (percentage >= 70) {
    return {
      label: 'ATTENTION',
      color: '#D08A35',
      bg: 'rgba(208, 138, 53, 0.12)',
      border: 'rgba(208, 138, 53, 0.28)',
    }
  }
  return {
    label: 'HEALTHY',
    color: '#3FA66B',
    bg: 'rgba(63, 166, 107, 0.12)',
    border: 'rgba(63, 166, 107, 0.28)',
  }
}

export function getUtilizationTone(value: number): 'low' | 'medium' | 'high' {
  if (value >= 85) {
    return 'high'
  }

  if (value >= 70) {
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
