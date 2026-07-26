import { fetchInventory } from '../api/inventoryApi'
import type {
  InventoryItem,
  InventoryQueryParams,
  InventorySort,
  PageResponse,
} from '../types/inventory'

export class InventoryService {
  async getInventory(params: InventoryQueryParams): Promise<PageResponse<InventoryItem>> {
    return fetchInventory(params)
  }
}

export const inventoryService = new InventoryService()

export function formatQuantity(value: number): string {
  return new Intl.NumberFormat('en-IN').format(value)
}

export function toggleSort(
  current: InventorySort,
  field: InventorySort['field'],
): InventorySort {
  if (current.field === field) {
    return {
      field,
      direction: current.direction === 'asc' ? 'desc' : 'asc',
    }
  }

  return { field, direction: 'asc' }
}

export function isInventoryListEmpty(page: PageResponse<InventoryItem> | undefined): boolean {
  return !page || page.totalElements === 0
}
