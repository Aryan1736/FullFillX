import type { ApiResponse, PageResponse } from './warehouse'
import type { PlanScoreBreakdown, OptimizationReasoning } from './optimization'
import type { Product } from './product'
import type { Warehouse } from './warehouse'

export type { ApiResponse, PageResponse }

export type ScoreBreakdown = {
  distanceScore: number
  shippingCostScore: number
  inventoryScore: number
  warehouseLoadScore: number
  totalScore: number
}

export type AllocatedProduct = {
  product: Product
  quantity: number
}

export type AllocatedWarehouse = {
  warehouse: Warehouse | null
  products: AllocatedProduct[]
  shippingCost: number
  eta: number
  scoreBreakdown: ScoreBreakdown | null
}

export type Allocation = {
  id: string
  orderId: string
  strategyName: string
  score: number
  scoreBreakdown: PlanScoreBreakdown | null
  shippingCost: number
  eta: number
  reasoning: OptimizationReasoning[]
  warehouses: AllocatedWarehouse[]
  products: AllocatedProduct[]
  createdAt: string
  updatedAt: string
}

export type AllocationSortField = 'createdAt' | 'score' | 'shippingCost' | 'eta'

export type AllocationSort = {
  field: AllocationSortField
  direction: 'asc' | 'desc'
}

export type AllocationFilters = {
  search?: string
  orderId?: string
  warehouseId?: string
}

export type AllocationQueryParams = AllocationFilters & {
  page: number
  size: number
  sort?: AllocationSort
}
