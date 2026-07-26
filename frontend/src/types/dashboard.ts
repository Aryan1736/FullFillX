export type ApiResponse<T> = {
  success: boolean
  message?: string
  data: T
  timestamp: string
}

export type OrderStatus =
  | 'PENDING'
  | 'ALLOCATED'
  | 'FULFILLING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'

export type AnalyticsSummary = {
  totalOrders: number
  totalWarehouses: number
  totalProducts: number
  inventoryUtilization: number
  warehouseUtilization: number
  averageShippingCost: number
  averageETA: number
  totalSplitShipments: number
}

export type WarehouseUtilizationItem = {
  warehouseId: string
  warehouseName: string
  city: string
  capacity: number
  currentLoad: number
  utilizationPercentage: number
}

export type WarehouseUtilization = {
  averageUtilizationPercentage: number
  warehouses: WarehouseUtilizationItem[]
}

export type InventoryStatus = {
  totalAvailableQuantity: number
  totalReservedQuantity: number
  totalQuantity: number
  inventoryRecordCount: number
  outOfStockCount: number
  lowStockCount: number
}

export type ShippingCostAnalysis = {
  totalAllocations: number
  averageShippingCost: number
  minimumShippingCost: number
  maximumShippingCost: number
  totalShippingCost: number
  averageEstimatedDeliveryHours: number
}

export type OrderStatusCount = {
  status: OrderStatus
  count: number
}

export type OrdersByStatus = {
  totalOrders: number
  statuses: OrderStatusCount[]
}

export type ShippingCostTrendPoint = {
  date: string
  averageShippingCost: number
  allocationCount: number
}

export type ShippingCostTrend = {
  trend: ShippingCostTrendPoint[]
}

export type DashboardKpis = {
  totalWarehouses: number
  totalProducts: number
  totalOrders: number
  inventoryUtilization: number
  warehouseUtilization: number
  averageShippingCost: number
  averageETA: number
}

export type InventoryDistributionSlice = {
  name: string
  value: number
  color: string
}

export type DashboardData = {
  kpis: DashboardKpis
  warehouseUtilization: WarehouseUtilizationItem[]
  inventoryDistribution: InventoryDistributionSlice[]
  shippingCostTrend: ShippingCostTrendPoint[]
  ordersByStatus: OrderStatusCount[]
}
