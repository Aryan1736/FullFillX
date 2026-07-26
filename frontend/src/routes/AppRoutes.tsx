import { Navigate, Route, Routes } from 'react-router-dom'

import { AppLayout } from '../layouts/AppLayout'
import { AnalyticsPage } from '../pages/AnalyticsPage'
import { DashboardPage } from '../pages/DashboardPage'
import { InventoryPage } from '../pages/InventoryPage'
import { OptimizationPage } from '../pages/OptimizationPage'
import { OrdersPage } from '../pages/OrdersPage'
import { WarehousesPage } from '../pages/WarehousesPage'
import { paths } from './paths'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="warehouses" element={<WarehousesPage />} />
        <Route path="inventory" element={<InventoryPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="optimization" element={<OptimizationPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
      </Route>
      <Route path="*" element={<Navigate to={paths.dashboard} replace />} />
    </Routes>
  )
}
