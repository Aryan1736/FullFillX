export type NavItem = {
  label: string
  path: string
}

export type {
  InventoryFilters,
  InventoryItem,
  InventoryQueryParams,
  InventorySort,
  InventorySortField,
  LOW_STOCK_THRESHOLD,
} from './inventory'
export type { Customer, CustomerQueryParams } from './customer'
export type {
  OptimizationFormValues,
  OptimizationOrderLine,
  OptimizationReasoning,
  OptimizationRequest,
  OptimizationResult,
  OptimizationRunInput,
  OptimizationWarehouseAvailability,
  OptimizationWeights,
  PlanScoreBreakdown,
  ReasoningDecision,
  WarehouseCandidate,
} from './optimization'
export type { Product, ProductQueryParams } from './product'
export type {
  ApiResponse,
  PageResponse,
  Warehouse,
  WarehouseFilters,
  WarehouseQueryParams,
  WarehouseSort,
  WarehouseSortField,
} from './warehouse'
