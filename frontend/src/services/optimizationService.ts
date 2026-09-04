import axios from 'axios'

import { fetchCustomerById } from '../api/customerApi'
import { fetchInventory } from '../api/inventoryApi'
import { runOptimization } from '../api/optimizationApi'
import { fetchWarehouses } from '../api/warehouseApi'
import type { InventoryItem } from '../types/inventory'
import type {
  OptimizationRequest,
  OptimizationResult,
  OptimizationRunInput,
  OptimizationWarehouseAvailability,
} from '../types/optimization'
import type { Warehouse } from '../types/warehouse'
import { formatCurrency, formatHours } from './dashboardService'

export const DEFAULT_OPTIMIZATION_WEIGHTS = {
  distanceWeight: 0.35,
  shippingCostWeight: 0.25,
  inventoryWeight: 0.25,
  warehouseLoadWeight: 0.15,
} as const

const LIST_PAGE_SIZE = 200

export function formatScore(value: number): string {
  return value.toFixed(2)
}

export function formatOptimizationCurrency(value: number): string {
  return formatCurrency(value)
}

export function formatOptimizationEta(hours: number): string {
  return formatHours(hours)
}

export function isSplitShipment(selectedWarehouses: string[]): boolean {
  return selectedWarehouses.length > 1
}

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const responseMessage = error.response?.data?.message
    if (typeof responseMessage === 'string' && responseMessage.trim()) {
      return responseMessage
    }

    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Unable to run optimization. Please try again.'
}

export function formatDistance(kilometers: number): string {
  return `${kilometers.toLocaleString('en-IN', { maximumFractionDigits: 1 })} km`
}

export function formatUtilization(ratio: number): string {
  const pct = ratio > 1 ? ratio : ratio * 100
  return `${pct.toFixed(1)}%`
}

export function buildWarehouseAvailabilities(
  warehouses: Warehouse[],
  inventory: InventoryItem[],
  productIds: string[],
): OptimizationWarehouseAvailability[] {
  const productIdSet = new Set(productIds)

  return warehouses
    .filter((warehouse) => warehouse.active)
    .map((warehouse) => {
      const availableStockByProductId: Record<string, number> = {}

      // Ensure every requested product is present in map to satisfy backend validation
      for (const productId of productIds) {
        availableStockByProductId[productId] = 0
      }

      for (const item of inventory) {
        if (item.warehouseId === warehouse.id && productIdSet.has(item.productId)) {
          availableStockByProductId[item.productId] = item.availableQuantity
        }
      }

      return {
        warehouseId: warehouse.id,
        warehouseName: warehouse.name,
        latitude: warehouse.latitude,
        longitude: warehouse.longitude,
        capacity: warehouse.capacity,
        currentLoad: warehouse.currentLoad,
        availableStockByProductId,
      }
    })
}

export function formatAllocatedProducts(
  allocatedQuantitiesByProductId: Record<string, number>,
  productNamesById: Record<string, string>,
): string {
  const entries = Object.entries(allocatedQuantitiesByProductId).filter(([, quantity]) => quantity > 0)

  if (entries.length === 0) {
    return '—'
  }

  return entries
    .map(([productId, quantity]) => {
      const productName = productNamesById[productId] ?? productId
      return `${productName} (${quantity})`
    })
    .join(', ')
}

export function getTotalAllocatedQuantity(
  allocatedQuantitiesByProductId: Record<string, number>,
): number {
  return Object.values(allocatedQuantitiesByProductId).reduce((total, quantity) => total + quantity, 0)
}

/**
 * Extracts and ranks all candidate fulfillment hubs evaluated during the optimization run.
 * Combines the winning candidate(s) with alternative plans evaluated and scored in solver reasoning logs.
 */
export function extractRankedCandidates(
  result: OptimizationResult,
  warehouseMap: Record<string, { name: string; city?: string; capacity?: number }>,
): Array<{
  rank: number
  warehouseId: string
  warehouseName: string
  city?: string
  score: number
  isRecommended: boolean
  shippingCost?: number
  estimatedDeliveryHours?: number
  reason: string
}> {
  const seenIds = new Set<string>()
  const candidates: Array<{
    warehouseId: string
    warehouseName: string
    city?: string
    score: number
    isRecommended: boolean
    shippingCost?: number
    estimatedDeliveryHours?: number
    reason: string
  }> = []

  // 1. Add selected winning candidate(s)
  for (const candidate of result.warehouseCandidates) {
    seenIds.add(candidate.warehouseId)
    const whInfo = warehouseMap[candidate.warehouseId]
    candidates.push({
      warehouseId: candidate.warehouseId,
      warehouseName: candidate.warehouseName || whInfo?.name || 'Selected Hub',
      city: whInfo?.city,
      score: candidate.scoreBreakdown?.totalScore ?? result.optimizationScore,
      isRecommended: true,
      shippingCost: candidate.shippingCost,
      estimatedDeliveryHours: candidate.estimatedDeliveryHours,
      reason: 'Optimal weighted score across freight cost, transit ETA, and capacity headroom.',
    })
  }

  // 2. Parse scored alternatives from solver reasoning logs
  for (const entry of result.reasoning) {
    if (entry.decision === 'REJECTED') {
      // Check for single warehouse rejection with score
      const match = entry.message.match(/single warehouse ([a-f0-9-]+)\):\s*score\s*([\d.]+)/i)
      if (match) {
        const whId = match[1]
        const score = Number.parseFloat(match[2])
        if (!seenIds.has(whId) && Number.isFinite(score)) {
          seenIds.add(whId)
          const whInfo = warehouseMap[whId]
          candidates.push({
            warehouseId: whId,
            warehouseName: entry.warehouseName || whInfo?.name || `Warehouse ${whId.slice(0, 8)}`,
            city: whInfo?.city,
            score,
            isRecommended: false,
            reason: 'Alternative candidate — higher composite cost/time score.',
          })
        }
      }

      // Check warehouse-specific leg rejection
      if (entry.warehouseId && !seenIds.has(entry.warehouseId)) {
        const legScoreMatch = entry.message.match(/Leg score ([\d.]+)/i)
        const score = legScoreMatch ? Number.parseFloat(legScoreMatch[1]) : null
        if (score !== null && Number.isFinite(score)) {
          seenIds.add(entry.warehouseId)
          const whInfo = warehouseMap[entry.warehouseId]
          candidates.push({
            warehouseId: entry.warehouseId,
            warehouseName: entry.warehouseName || whInfo?.name || `Warehouse ${entry.warehouseId.slice(0, 8)}`,
            city: whInfo?.city,
            score,
            isRecommended: false,
            reason: 'Alternative candidate — leg score exceeds selected warehouse.',
          })
        }
      }
    }
  }

  // Sort by score ascending (lowest score is best in weighted greedy)
  candidates.sort((a, b) => a.score - b.score)

  return candidates.map((c, index) => ({
    ...c,
    rank: index + 1,
  }))
}

export class OptimizationService {
  async runOptimization(input: OptimizationRunInput): Promise<OptimizationResult> {
    const productIds = input.productLines.map((line) => line.productId)

    const [customer, warehousePage, inventoryPage] = await Promise.all([
      fetchCustomerById(input.customerId),
      fetchWarehouses({
        page: 0,
        size: LIST_PAGE_SIZE,
        active: true,
        sort: { field: 'name', direction: 'asc' },
      }),
      fetchInventory({
        page: 0,
        size: LIST_PAGE_SIZE,
        sort: { field: 'productName', direction: 'asc' },
      }),
    ])

    const warehouseAvailabilities = buildWarehouseAvailabilities(
      warehousePage.content,
      inventoryPage.content,
      productIds,
    )

    if (warehouseAvailabilities.length === 0) {
      throw new Error('No active warehouses available for optimization.')
    }

    const request: OptimizationRequest = {
      orderId: input.orderId || crypto.randomUUID(),
      destinationLatitude: customer.latitude,
      destinationLongitude: customer.longitude,
      orderLines: input.productLines,
      warehouseAvailabilities,
      optimizationWeights: { ...DEFAULT_OPTIMIZATION_WEIGHTS },
    }

    return runOptimization(request)
  }
}

export const optimizationService = new OptimizationService()

