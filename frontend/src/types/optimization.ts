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

export type CandidateScoreBreakdown = {
  distanceScore?: number
  shippingCostScore?: number
  inventoryScore?: number
  warehouseLoadScore?: number
  totalScore?: number
}

export type WarehouseCandidate = {
  warehouseId: string
  warehouseName: string
  allocatedQuantitiesByProductId: Record<string, number>
  shippingCost: number
  estimatedDeliveryHours: number
  scoreBreakdown?: CandidateScoreBreakdown
}

export type RankedCandidate = {
  rank: number
  warehouseId: string
  warehouseName: string
  score: number
  isRecommended: boolean
  shippingCost?: number
  estimatedDeliveryHours?: number
  reason?: string
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
  estimatedSavings: number | null
}

export type OptimizationRunInput = {
  customerId: string
  productLines: OptimizationOrderLine[]
  orderId?: string
}

export type OptimizationFormValues = {
  customerId: string
  productLines: OptimizationOrderLine[]
}

