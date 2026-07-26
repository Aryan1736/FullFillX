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
      orderId: crypto.randomUUID(),
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
