import {
  BarChart3,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Sparkles,
  Warehouse,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { paths } from './paths'

export type NavigationItem = {
  label: string
  path: string
  icon: LucideIcon
}

export const navigationItems: NavigationItem[] = [
  { label: 'Dashboard', path: paths.dashboard, icon: LayoutDashboard },
  { label: 'Warehouses', path: paths.warehouses, icon: Warehouse },
  { label: 'Inventory', path: paths.inventory, icon: Package },
  { label: 'Orders', path: paths.orders, icon: ShoppingCart },
  { label: 'Optimization', path: paths.optimization, icon: Sparkles },
  { label: 'Analytics', path: paths.analytics, icon: BarChart3 },
]
