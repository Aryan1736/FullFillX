import { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'

import { NotFoundPage } from '../components/common/ErrorPage'
import { AppLayout } from '../layouts/AppLayout'

const DashboardPage = lazy(() =>
  import('../pages/DashboardPage').then((module) => ({ default: module.DashboardPage })),
)
const WarehousesPage = lazy(() =>
  import('../pages/WarehousesPage').then((module) => ({ default: module.WarehousesPage })),
)
const WarehouseMapPage = lazy(() =>
  import('../pages/WarehouseMapPage').then((module) => ({ default: module.WarehouseMapPage })),
)
const InventoryPage = lazy(() =>
  import('../pages/InventoryPage').then((module) => ({ default: module.InventoryPage })),
)
const OrdersPage = lazy(() =>
  import('../pages/OrdersPage').then((module) => ({ default: module.OrdersPage })),
)
const AllocationsPage = lazy(() =>
  import('../pages/AllocationsPage').then((module) => ({ default: module.AllocationsPage })),
)
const OptimizationPage = lazy(() =>
  import('../pages/OptimizationPage').then((module) => ({ default: module.OptimizationPage })),
)
const AnalyticsPage = lazy(() =>
  import('../pages/AnalyticsPage').then((module) => ({ default: module.AnalyticsPage })),
)

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="warehouses" element={<WarehousesPage />} />
        <Route path="warehouses/map" element={<WarehouseMapPage />} />
        <Route path="inventory" element={<InventoryPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="allocations" element={<AllocationsPage />} />
        <Route path="optimization" element={<OptimizationPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
