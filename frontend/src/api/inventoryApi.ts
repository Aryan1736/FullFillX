import { api } from '../services/api'
import type {
  ApiResponse,
  InventoryItem,
  InventoryQueryParams,
  InventorySortField,
  PageResponse,
} from '../types/inventory'

function toNumber(value: unknown, fallback = 0): number {
  if (value == null) {
    return fallback
  }

  const parsed = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function mapInventoryItem(payload: Record<string, unknown>): InventoryItem {
  return {
    id: String(payload.id ?? ''),
    warehouseId: String(payload.warehouseId ?? ''),
    warehouseName: String(payload.warehouseName ?? ''),
    productId: String(payload.productId ?? ''),
    productName: String(payload.productName ?? ''),
    sku: String(payload.sku ?? ''),
    availableQuantity: toNumber(payload.availableQuantity),
    reservedQuantity: toNumber(payload.reservedQuantity),
    lowStock: Boolean(payload.lowStock),
    createdAt: String(payload.createdAt ?? ''),
    updatedAt: String(payload.updatedAt ?? ''),
  }
}

function mapSortField(field: InventorySortField): string {
  switch (field) {
    case 'productName':
      return 'product.name'
    case 'sku':
      return 'product.category'
    case 'warehouseName':
      return 'warehouse.name'
    case 'availableQuantity':
      return 'availableQuantity'
    case 'reservedQuantity':
      return 'reservedQuantity'
    default:
      return 'createdAt'
  }
}

function buildQueryParams(params: InventoryQueryParams): Record<string, string | number | boolean> {
  const query: Record<string, string | number | boolean> = {
    page: params.page,
    size: params.size,
  }

  if (params.search?.trim()) {
    query.search = params.search.trim()
  }

  if (params.warehouseId) {
    query.warehouseId = params.warehouseId
  }

  if (params.lowStock != null) {
    query.lowStock = params.lowStock
  }

  if (params.sort) {
    query.sort = `${mapSortField(params.sort.field)},${params.sort.direction}`
  }

  return query
}

export async function fetchInventory(
  params: InventoryQueryParams,
): Promise<PageResponse<InventoryItem>> {
  const { data } = await api.get<ApiResponse<PageResponse<Record<string, unknown>>>>('/inventory', {
    params: buildQueryParams(params),
  })

  const page = data.data

  return {
    page: toNumber(page.page),
    size: toNumber(page.size),
    totalElements: toNumber(page.totalElements),
    totalPages: toNumber(page.totalPages),
    first: Boolean(page.first),
    last: Boolean(page.last),
    sort: String(page.sort ?? ''),
    content: (page.content ?? []).map((item) => mapInventoryItem(item as Record<string, unknown>)),
  }
}
