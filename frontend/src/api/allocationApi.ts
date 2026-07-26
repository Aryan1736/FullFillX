import { api } from '../services/api'
import type {
  Allocation,
  AllocationQueryParams,
  ApiResponse,
  PageResponse,
  ScoreBreakdown,
  AllocatedProduct,
  AllocatedWarehouse,
} from '../types/allocation'
import type { PlanScoreBreakdown, OptimizationReasoning, ReasoningDecision } from '../types/optimization'
import type { Product } from '../types/product'
import type { Warehouse } from '../types/warehouse'

function toNumber(value: unknown, fallback = 0): number {
  if (value == null) {
    return fallback
  }

  const parsed = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function mapProduct(payload: Record<string, unknown> | null | undefined): Product {
  const source = payload ?? {}
  return {
    id: String(source.id ?? ''),
    name: String(source.name ?? ''),
    category: String(source.category ?? ''),
    weight: toNumber(source.weight),
    createdAt: String(source.createdAt ?? ''),
    updatedAt: String(source.updatedAt ?? ''),
  }
}

function mapWarehouse(payload: Record<string, unknown> | null | undefined): Warehouse | null {
  if (!payload || payload.id == null) {
    return null
  }

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

function mapPlanScoreBreakdown(
  payload: Record<string, unknown> | null | undefined,
): PlanScoreBreakdown | null {
  if (!payload) {
    return null
  }

  return {
    shippingCostScore: toNumber(payload.shippingCostScore),
    etaScore: toNumber(payload.etaScore),
    warehouseLoadScore: toNumber(payload.warehouseLoadScore),
    splitShipmentPenalty: toNumber(payload.splitShipmentPenalty),
    totalScore: toNumber(payload.totalScore),
  }
}

function mapScoreBreakdown(payload: Record<string, unknown> | null | undefined): ScoreBreakdown | null {
  if (!payload) {
    return null
  }

  return {
    distanceScore: toNumber(payload.distanceScore),
    shippingCostScore: toNumber(payload.shippingCostScore),
    inventoryScore: toNumber(payload.inventoryScore),
    warehouseLoadScore: toNumber(payload.warehouseLoadScore),
    totalScore: toNumber(payload.totalScore),
  }
}

function mapReasoning(payload: Record<string, unknown>): OptimizationReasoning {
  return {
    decision: String(payload.decision ?? 'INFO') as ReasoningDecision,
    warehouseId: payload.warehouseId != null ? String(payload.warehouseId) : null,
    warehouseName: payload.warehouseName != null ? String(payload.warehouseName) : null,
    productId: payload.productId != null ? String(payload.productId) : null,
    message: String(payload.message ?? ''),
  }
}

function mapAllocatedProduct(payload: Record<string, unknown>): AllocatedProduct {
  return {
    product: mapProduct(payload.product as Record<string, unknown>),
    quantity: toNumber(payload.quantity),
  }
}

function mapAllocatedWarehouse(payload: Record<string, unknown>): AllocatedWarehouse {
  return {
    warehouse: mapWarehouse(payload.warehouse as Record<string, unknown>),
    products: ((payload.products as Record<string, unknown>[]) ?? []).map(mapAllocatedProduct),
    shippingCost: toNumber(payload.shippingCost),
    eta: toNumber(payload.eta),
    scoreBreakdown: mapScoreBreakdown(payload.scoreBreakdown as Record<string, unknown>),
  }
}

function mapAllocation(payload: Record<string, unknown>): Allocation {
  return {
    id: String(payload.id ?? ''),
    orderId: String(payload.orderId ?? ''),
    strategyName: String(payload.strategyName ?? ''),
    score: toNumber(payload.score),
    scoreBreakdown: mapPlanScoreBreakdown(payload.scoreBreakdown as Record<string, unknown>),
    shippingCost: toNumber(payload.shippingCost),
    eta: toNumber(payload.eta),
    reasoning: ((payload.reasoning as Record<string, unknown>[]) ?? []).map(mapReasoning),
    warehouses: ((payload.warehouses as Record<string, unknown>[]) ?? []).map(mapAllocatedWarehouse),
    products: ((payload.products as Record<string, unknown>[]) ?? []).map(mapAllocatedProduct),
    createdAt: String(payload.createdAt ?? ''),
    updatedAt: String(payload.updatedAt ?? ''),
  }
}

function buildQueryParams(params: AllocationQueryParams): Record<string, string | number> {
  const query: Record<string, string | number> = {
    page: params.page,
    size: params.size,
  }

  if (params.search?.trim()) {
    query.search = params.search.trim()
  }

  if (params.orderId?.trim()) {
    query.orderId = params.orderId.trim()
  }

  if (params.warehouseId?.trim()) {
    query.warehouseId = params.warehouseId.trim()
  }

  if (params.sort) {
    query.sort = `${params.sort.field},${params.sort.direction}`
  }

  return query
}

function mapPage<T>(
  page: PageResponse<Record<string, unknown>>,
  mapper: (item: Record<string, unknown>) => T,
): PageResponse<T> {
  return {
    page: toNumber(page.page),
    size: toNumber(page.size),
    totalElements: toNumber(page.totalElements),
    totalPages: toNumber(page.totalPages),
    first: Boolean(page.first),
    last: Boolean(page.last),
    sort: String(page.sort ?? ''),
    content: (page.content ?? []).map((item) => mapper(item as Record<string, unknown>)),
  }
}

export async function fetchAllocations(
  params: AllocationQueryParams,
): Promise<PageResponse<Allocation>> {
  const { data } = await api.get<ApiResponse<PageResponse<Record<string, unknown>>>>('/allocations', {
    params: buildQueryParams(params),
  })

  return mapPage(data.data, mapAllocation)
}

export async function fetchAllocationById(id: string): Promise<Allocation> {
  const { data } = await api.get<ApiResponse<Record<string, unknown>>>(`/allocations/${id}`)
  return mapAllocation(data.data)
}
