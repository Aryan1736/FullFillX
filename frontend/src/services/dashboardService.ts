import {
  fetchAnalyticsSummary,
  fetchInventoryStatus,
  fetchOrdersByStatus,
  fetchShippingCostTrend,
  fetchWarehouseUtilization,
} from '../api/dashboardApi'
import type {
  DashboardData,
  InventoryDistributionSlice,
  OrderStatusCount,
} from '../types/dashboard'

const INVENTORY_COLORS = {
  inStock: '#10b981',
  lowStock: '#f59e0b',
  outOfStock: '#ef4444',
} as const

const STATUS_COLORS: Record<string, string> = {
  PENDING: '#6366f1',
  ALLOCATED: '#0ea5e9',
  FULFILLING: '#8b5cf6',
  SHIPPED: '#f59e0b',
  DELIVERED: '#10b981',
  CANCELLED: '#ef4444',
}

const MOCK_DASHBOARD_DATA: DashboardData = {
  kpis: {
    totalWarehouses: 5,
    totalProducts: 20,
    totalOrders: 30,
    inventoryUtilization: 62.5,
    warehouseUtilization: 58.3,
    averageShippingCost: 312.4,
    averageETA: 42,
  },
  warehouseUtilization: [
    {
      warehouseId: '1',
      warehouseName: 'Kolkata Fulfillment Center',
      city: 'Kolkata',
      capacity: 12000,
      currentLoad: 4200,
      utilizationPercentage: 35,
    },
    {
      warehouseId: '2',
      warehouseName: 'Mumbai Hub',
      city: 'Mumbai',
      capacity: 15000,
      currentLoad: 9300,
      utilizationPercentage: 62,
    },
    {
      warehouseId: '3',
      warehouseName: 'Delhi Distribution',
      city: 'Delhi',
      capacity: 10000,
      currentLoad: 7800,
      utilizationPercentage: 78,
    },
  ],
  inventoryDistribution: [
    { name: 'In Stock', value: 82, color: INVENTORY_COLORS.inStock },
    { name: 'Low Stock', value: 12, color: INVENTORY_COLORS.lowStock },
    { name: 'Out of Stock', value: 6, color: INVENTORY_COLORS.outOfStock },
  ],
  shippingCostTrend: [
    { date: '2026-07-20', averageShippingCost: 280.5, allocationCount: 4 },
    { date: '2026-07-21', averageShippingCost: 295.2, allocationCount: 6 },
    { date: '2026-07-22', averageShippingCost: 310.8, allocationCount: 5 },
    { date: '2026-07-23', averageShippingCost: 305.1, allocationCount: 7 },
    { date: '2026-07-24', averageShippingCost: 318.6, allocationCount: 4 },
    { date: '2026-07-25', averageShippingCost: 322.4, allocationCount: 3 },
    { date: '2026-07-26', averageShippingCost: 312.4, allocationCount: 1 },
  ],
  ordersByStatus: [
    { status: 'PENDING', count: 8 },
    { status: 'ALLOCATED', count: 6 },
    { status: 'FULFILLING', count: 5 },
    { status: 'SHIPPED', count: 4 },
    { status: 'DELIVERED', count: 5 },
    { status: 'CANCELLED', count: 2 },
  ],
}

function buildInventoryDistribution(
  inventoryRecordCount: number,
  lowStockCount: number,
  outOfStockCount: number,
): InventoryDistributionSlice[] {
  const inStockCount = Math.max(inventoryRecordCount - lowStockCount - outOfStockCount, 0)

  return [
    { name: 'In Stock', value: inStockCount, color: INVENTORY_COLORS.inStock },
    { name: 'Low Stock', value: lowStockCount, color: INVENTORY_COLORS.lowStock },
    { name: 'Out of Stock', value: outOfStockCount, color: INVENTORY_COLORS.outOfStock },
  ].filter((slice) => slice.value > 0)
}

function withStatusColors(statuses: OrderStatusCount[]): OrderStatusCount[] {
  return statuses.filter((item) => item.count > 0)
}

export type DashboardLoadResult = {
  data: DashboardData
  isMock: boolean
}

function buildDashboardData(
  analytics: Awaited<ReturnType<typeof fetchAnalyticsSummary>>,
  warehouseUtilization: Awaited<ReturnType<typeof fetchWarehouseUtilization>>,
  inventoryStatus: Awaited<ReturnType<typeof fetchInventoryStatus>>,
  ordersByStatus: Awaited<ReturnType<typeof fetchOrdersByStatus>>,
  shippingCostTrend: Awaited<ReturnType<typeof fetchShippingCostTrend>>,
): DashboardData {
  return {
    kpis: {
      totalWarehouses: analytics.totalWarehouses,
      totalProducts: analytics.totalProducts,
      totalOrders: analytics.totalOrders,
      inventoryUtilization: analytics.inventoryUtilization,
      warehouseUtilization: analytics.warehouseUtilization,
      averageShippingCost: analytics.averageShippingCost,
      averageETA: analytics.averageETA,
    },
    warehouseUtilization: warehouseUtilization.warehouses,
    inventoryDistribution: buildInventoryDistribution(
      inventoryStatus.inventoryRecordCount,
      inventoryStatus.lowStockCount,
      inventoryStatus.outOfStockCount,
    ),
    shippingCostTrend: shippingCostTrend.trend,
    ordersByStatus: withStatusColors(ordersByStatus.statuses),
  }
}

export class DashboardService {
  async fetchDashboard(): Promise<DashboardData> {
    const [analytics, warehouseUtilization, inventoryStatus, ordersByStatus, shippingCostTrend] =
      await Promise.all([
        fetchAnalyticsSummary(),
        fetchWarehouseUtilization(),
        fetchInventoryStatus(),
        fetchOrdersByStatus(),
        fetchShippingCostTrend(),
      ])

    return buildDashboardData(
      analytics,
      warehouseUtilization,
      inventoryStatus,
      ordersByStatus,
      shippingCostTrend,
    )
  }

  getMockDashboard(): DashboardData {
    return MOCK_DASHBOARD_DATA
  }

  async loadDashboard(): Promise<DashboardLoadResult> {
    try {
      return {
        isMock: false,
        data: await this.fetchDashboard(),
      }
    } catch {
      return {
        isMock: true,
        data: this.getMockDashboard(),
      }
    }
  }
}

export const dashboardService = new DashboardService()

export function getStatusColor(status: string): string {
  return STATUS_COLORS[status] ?? '#64748b'
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`
}

export function formatHours(value: number): string {
  return `${value.toFixed(1)} hrs`
}

export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat('en-IN').format(value)
}

export function formatChartDate(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
}

export function isDashboardEmpty(data: DashboardData): boolean {
  const hasKpiActivity =
    data.kpis.totalOrders > 0 ||
    data.kpis.totalProducts > 0 ||
    data.kpis.totalWarehouses > 0

  const hasChartData =
    data.warehouseUtilization.length > 0 ||
    data.inventoryDistribution.length > 0 ||
    data.shippingCostTrend.length > 0 ||
    data.ordersByStatus.length > 0

  return !hasKpiActivity && !hasChartData
}
