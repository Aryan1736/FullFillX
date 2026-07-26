import { api } from '../services/api'
import type {
  ApiResponse,
  PageResponse,
  Warehouse,
  WarehouseQueryParams,
} from '../types/warehouse'

function toNumber(value: unknown, fallback = 0): number {
  if (value == null) {
    return fallback
  }

  const parsed = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function mapWarehouse(payload: Record<string, unknown>): Warehouse {
  return {
    id: String(payload.id ?? ''),
    name: String(payload.name ?? ''),
    city: String(payload.city ?? ''),
    latitude: toNumber(payload.latitude),
    longitude: toNumber(payload.longitude),
    capacity: toNumber(payload.capacity),
    currentLoad: toNumber(payload.currentLoad),
    active: Boolean(payload.active),
    createdAt: String(payload.createdAt ?? ''),
    updatedAt: String(payload.updatedAt ?? ''),
  }
}

function buildQueryParams(params: WarehouseQueryParams): Record<string, string | number | boolean> {
  const query: Record<string, string | number | boolean> = {
    page: params.page,
    size: params.size,
  }

  if (params.name?.trim()) {
    query.name = params.name.trim()
  }

  if (params.city?.trim()) {
    query.city = params.city.trim()
  }

  if (params.active != null) {
    query.active = params.active
  }

  if (params.sort) {
    query.sort = `${params.sort.field},${params.sort.direction}`
  }

  return query
}

export async function fetchWarehouses(
  params: WarehouseQueryParams,
): Promise<PageResponse<Warehouse>> {
  const { data } = await api.get<ApiResponse<PageResponse<Record<string, unknown>>>>('/warehouses', {
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
    content: (page.content ?? []).map((item) => mapWarehouse(item as Record<string, unknown>)),
  }
}

export async function fetchWarehouseById(id: string): Promise<Warehouse> {
  const { data } = await api.get<ApiResponse<Record<string, unknown>>>(`/warehouses/${id}`)
  return mapWarehouse(data.data)
}
