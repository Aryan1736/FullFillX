import { Route, Routes } from 'react-router-dom'

import { NotFoundPage } from '../components/common/ErrorPage'
import { AppLayout } from '../layouts/AppLayout'
import { AnalyticsPage } from '../pages/AnalyticsPage'
import { AllocationsPage } from '../pages/AllocationsPage'
import { DashboardPage } from '../pages/DashboardPage'
import { InventoryPage } from '../pages/InventoryPage'
import { OptimizationPage } from '../pages/OptimizationPage'
import { OrdersPage } from '../pages/OrdersPage'
import { WarehouseMapPage } from '../pages/WarehouseMapPage'
import { WarehousesPage } from '../pages/WarehousesPage'

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
