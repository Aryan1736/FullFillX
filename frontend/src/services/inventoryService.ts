import { fetchInventory } from '../api/inventoryApi'
import type {
  InventoryItem,
  InventoryQueryParams,
  InventorySort,
  PageResponse,
} from '../types/inventory'
import { toggleSort as toggleSortUtil } from '../utils/toggleSort'

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
  return toggleSortUtil(current, field)
}
