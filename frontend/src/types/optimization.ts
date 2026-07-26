import type { ApiResponse } from './warehouse'

export type { ApiResponse }

export type OptimizationOrderLine = {
  productId: string
  quantity: number
}

export type OptimizationWarehouseAvailability = {
  warehouseId: string
  warehouseName: string
  latitude: number
  longitude: number
  capacity: number
  currentLoad: number
  availableStockByProductId: Record<string, number>
}

export type OptimizationWeights = {
  distanceWeight: number
  shippingCostWeight: number
  inventoryWeight: number
  warehouseLoadWeight: number
}

export type OptimizationRequest = {
  orderId: string
  destinationLatitude: number
  destinationLongitude: number
  orderLines: OptimizationOrderLine[]
  warehouseAvailabilities: OptimizationWarehouseAvailability[]
  optimizationWeights: OptimizationWeights
}

export type PlanScoreBreakdown = {
  shippingCostScore: number
  etaScore: number
  warehouseLoadScore: number
  splitShipmentPenalty: number
  totalScore: number
}

export type ReasoningDecision = 'SELECTED' | 'REJECTED' | 'FILTERED' | 'INFO'

export type OptimizationReasoning = {
  decision: ReasoningDecision
  warehouseId: string | null
  warehouseName: string | null
  productId: string | null
  message: string
}

export type WarehouseCandidate = {
  warehouseId: string
  warehouseName: string
  allocatedQuantitiesByProductId: Record<string, number>
  shippingCost: number
  estimatedDeliveryHours: number
}

export type OptimizationResult = {
  strategyName: string
  warehouseCandidates: WarehouseCandidate[]
  optimizationScore: number
  totalShippingCost: number
  estimatedDeliveryHours: number
  scoreBreakdown: PlanScoreBreakdown
  reasoning: OptimizationReasoning[]
  selectedWarehouses: string[]
  estimatedSavings: number
}

export type OptimizationRunInput = {
  customerId: string
  productLines: OptimizationOrderLine[]
}

export type OptimizationFormValues = {
  customerId: string
  productLines: OptimizationOrderLine[]
}
