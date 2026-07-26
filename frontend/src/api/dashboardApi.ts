import { api } from '../services/api'
import type {
  AnalyticsSummary,
  ApiResponse,
  InventoryStatus,
  OrdersByStatus,
  ShippingCostAnalysis,
  ShippingCostTrend,
  WarehouseUtilization,
} from '../types/dashboard'

function unwrap<T>(response: ApiResponse<T>): T {
  return response.data
}

function toNumber(value: unknown, fallback = 0): number {
  if (value == null) {
    return fallback
  }

  const parsed = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

export async function fetchAnalyticsSummary(): Promise<AnalyticsSummary> {
  const { data } = await api.get<ApiResponse<Record<string, unknown>>>('/analytics')
  const payload = data.data

  return {
    totalOrders: toNumber(payload.totalOrders),
    totalWarehouses: toNumber(payload.totalWarehouses),
    totalProducts: toNumber(payload.totalProducts),
    inventoryUtilization: toNumber(payload.inventoryUtilization),
    warehouseUtilization: toNumber(payload.warehouseUtilization),
    averageShippingCost: toNumber(payload.averageShippingCost),
    averageETA: toNumber(payload.averageETA),
    totalSplitShipments: toNumber(payload.totalSplitShipments),
  }
}

export async function fetchWarehouseUtilization(): Promise<WarehouseUtilization> {
  const { data } = await api.get<ApiResponse<Record<string, unknown>>>('/warehouse-utilization')
  const payload = data.data
  const warehouses = Array.isArray(payload.warehouses) ? payload.warehouses : []

  return {
    averageUtilizationPercentage: toNumber(payload.averageUtilizationPercentage),
    warehouses: warehouses.map((warehouse) => {
      const item = warehouse as Record<string, unknown>
      return {
        warehouseId: String(item.warehouseId ?? ''),
        warehouseName: String(item.warehouseName ?? 'Unknown'),
        city: String(item.city ?? ''),
        capacity: toNumber(item.capacity),
        currentLoad: toNumber(item.currentLoad),
        utilizationPercentage: toNumber(item.utilizationPercentage),
      }
    }),
  }
}

export async function fetchInventoryStatus(): Promise<InventoryStatus> {
  const { data } = await api.get<ApiResponse<Record<string, unknown>>>('/inventory-status')
  const payload = data.data

  return {
    totalAvailableQuantity: toNumber(payload.totalAvailableQuantity),
    totalReservedQuantity: toNumber(payload.totalReservedQuantity),
    totalQuantity: toNumber(payload.totalQuantity),
    inventoryRecordCount: toNumber(payload.inventoryRecordCount),
    outOfStockCount: toNumber(payload.outOfStockCount),
    lowStockCount: toNumber(payload.lowStockCount),
  }
}

export async function fetchShippingCostAnalysis(): Promise<ShippingCostAnalysis> {
  const { data } = await api.get<ApiResponse<Record<string, unknown>>>('/shipping-cost-analysis')
  const payload = data.data

  return {
    totalAllocations: toNumber(payload.totalAllocations),
    averageShippingCost: toNumber(payload.averageShippingCost),
    minimumShippingCost: toNumber(payload.minimumShippingCost),
    maximumShippingCost: toNumber(payload.maximumShippingCost),
    totalShippingCost: toNumber(payload.totalShippingCost),
    averageEstimatedDeliveryHours: toNumber(payload.averageEstimatedDeliveryHours),
  }
}

export async function fetchOrdersByStatus(): Promise<OrdersByStatus> {
  const { data } = await api.get<ApiResponse<OrdersByStatus>>('/analytics/orders-by-status')
  return unwrap(data)
}

export async function fetchShippingCostTrend(): Promise<ShippingCostTrend> {
  const { data } = await api.get<ApiResponse<ShippingCostTrend>>('/analytics/shipping-cost-trend')
  const trend = data.data.trend ?? []

  return {
    trend: trend.map((point) => ({
      date: point.date,
      averageShippingCost: toNumber(point.averageShippingCost),
      allocationCount: toNumber(point.allocationCount),
    })),
  }
}
