import type { ApiResponse, PageResponse } from './warehouse'

export type { ApiResponse, PageResponse }

export type InventoryItem = {
  id: string
  warehouseId: string
  warehouseName: string
  productId: string
  productName: string
  sku: string
  availableQuantity: number
  reservedQuantity: number
  lowStock: boolean
  createdAt: string
  updatedAt: string
}

export type InventorySortField =
  | 'productName'
  | 'sku'
  | 'warehouseName'
  | 'availableQuantity'
  | 'reservedQuantity'

export type InventorySort = {
  field: InventorySortField
  direction: 'asc' | 'desc'
}

export type InventoryFilters = {
  search?: string
  warehouseId?: string
  lowStock?: boolean
}

export type InventoryQueryParams = InventoryFilters & {
  page: number
  size: number
  sort?: InventorySort
}

export const LOW_STOCK_THRESHOLD = 50
