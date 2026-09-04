import { fetchInventory } from '../api/inventoryApi'
import { fetchInventoryStatus } from '../api/dashboardApi'
import type { InventoryStatus } from '../types/dashboard'
import {
  LOW_STOCK_THRESHOLD,
  type InventoryItem,
  type InventoryQueryParams,
  type InventorySort,
  type PageResponse,
  type StockStatus,
} from '../types/inventory'
import { toggleSort as toggleSortUtil } from '../utils/toggleSort'

export class InventoryService {
  async getInventory(params: InventoryQueryParams): Promise<PageResponse<InventoryItem>> {
    return fetchInventory(params)
  }

  async getInventoryStatus(): Promise<InventoryStatus> {
    return fetchInventoryStatus()
  }
}

export const inventoryService = new InventoryService()

export function formatQuantity(value: number): string {
  return new Intl.NumberFormat('en-IN').format(value)
}

export function getStockStatus(item: InventoryItem): StockStatus {
  if (item.availableQuantity === 0) {
    return 'OUT_OF_STOCK'
  }
  if (item.lowStock || item.availableQuantity < LOW_STOCK_THRESHOLD) {
    return 'LOW_STOCK'
  }
  return 'HEALTHY'
}

export function getStockRatio(item: InventoryItem): number {
  const total = item.availableQuantity + item.reservedQuantity
  if (total <= 0) return 0
  return Math.min(100, Math.max(0, (item.availableQuantity / total) * 100))
}

export function toggleSort(
  current: InventorySort,
  field: InventorySort['field'],
): InventorySort {
  return toggleSortUtil(current, field)
}

