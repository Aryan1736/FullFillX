export { api } from '../services/api'
export { fetchAllocationById, fetchAllocations } from './allocationApi'
export { fetchCustomerById, fetchCustomers } from './customerApi'
export { fetchCustomerOrderById, fetchCustomerOrders } from './customerOrderApi'
export { runOptimization } from './optimizationApi'
export { fetchProducts } from './productApi'
export {
  fetchAnalyticsSummary,
  fetchInventoryStatus,
  fetchOrdersByStatus,
  fetchShippingCostAnalysis,
  fetchShippingCostTrend,
  fetchWarehouseUtilization,
} from './dashboardApi'
export { fetchInventory } from './inventoryApi'
export { fetchWarehouseById, fetchWarehouses } from './warehouseApi'
