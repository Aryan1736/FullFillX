import { api } from '../services/api'
import type {
  ApiResponse,
  OptimizationReasoning,
  OptimizationRequest,
  OptimizationResult,
  PlanScoreBreakdown,
  ReasoningDecision,
  WarehouseCandidate,
} from '../types/optimization'

function toNumber(value: unknown, fallback = 0): number {
  if (value == null) {
    return fallback
  }

  const parsed = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function mapUuidRecord(value: unknown): Record<string, number> {
  if (!value || typeof value !== 'object') {
    return {}
  }

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([key, quantity]) => [
      String(key),
      toNumber(quantity),
    ]),
  )
}

function mapPlanScoreBreakdown(payload: Record<string, unknown> | undefined): PlanScoreBreakdown {
  return {
    shippingCostScore: toNumber(payload?.shippingCostScore),
    etaScore: toNumber(payload?.etaScore),
    warehouseLoadScore: toNumber(payload?.warehouseLoadScore),
    splitShipmentPenalty: toNumber(payload?.splitShipmentPenalty),
    totalScore: toNumber(payload?.totalScore),
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

function mapWarehouseCandidate(payload: Record<string, unknown>): WarehouseCandidate {
  return {
    warehouseId: String(payload.warehouseId ?? ''),
    warehouseName: String(payload.warehouseName ?? ''),
    allocatedQuantitiesByProductId: mapUuidRecord(payload.allocatedQuantitiesByProductId),
    shippingCost: toNumber(payload.shippingCost),
    estimatedDeliveryHours: toNumber(payload.estimatedDeliveryHours),
  }
}

function mapOptimizationResult(payload: Record<string, unknown>): OptimizationResult {
  const warehouseCandidates = Array.isArray(payload.warehouseCandidates)
    ? payload.warehouseCandidates.map((candidate) =>
        mapWarehouseCandidate(candidate as Record<string, unknown>),
      )
    : []

  const reasoning = Array.isArray(payload.reasoning)
    ? payload.reasoning.map((entry) => mapReasoning(entry as Record<string, unknown>))
    : []

  const selectedWarehouses = Array.isArray(payload.selectedWarehouses)
    ? payload.selectedWarehouses.map((id) => String(id))
    : []

  return {
    strategyName: String(payload.strategyName ?? ''),
    warehouseCandidates,
    optimizationScore: toNumber(payload.optimizationScore),
    totalShippingCost: toNumber(payload.totalShippingCost),
    estimatedDeliveryHours: toNumber(payload.estimatedDeliveryHours),
    scoreBreakdown: mapPlanScoreBreakdown(payload.scoreBreakdown as Record<string, unknown>),
    reasoning,
    selectedWarehouses,
    estimatedSavings: toNumber(payload.estimatedSavings),
  }
}

export async function runOptimization(request: OptimizationRequest): Promise<OptimizationResult> {
  const { data } = await api.post<ApiResponse<Record<string, unknown>>>('/optimization/run', request)
  return mapOptimizationResult(data.data)
}
