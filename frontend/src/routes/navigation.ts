import {
  BarChart3,
  History,
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

export type NavigationSection = {
  title: string
  items: NavigationItem[]
}

export const navigationItems: NavigationItem[] = [
  { label: 'Dashboard', path: paths.dashboard, icon: LayoutDashboard },
  { label: 'Warehouses', path: paths.warehouses, icon: Warehouse },
  { label: 'Inventory', path: paths.inventory, icon: Package },
  { label: 'Orders', path: paths.orders, icon: ShoppingCart },
  { label: 'Allocations', path: paths.allocations, icon: History },
  { label: 'Optimization', path: paths.optimization, icon: Sparkles },
  { label: 'Analytics', path: paths.analytics, icon: BarChart3 },
]

export const navigationGroups: NavigationSection[] = [
  {
    title: 'Operations',
    items: [
      { label: 'Dashboard', path: paths.dashboard, icon: LayoutDashboard },
      { label: 'Orders Queue', path: paths.orders, icon: ShoppingCart },
      { label: 'Allocation History', path: paths.allocations, icon: History },
    ],
  },
  {
    title: 'Network & Inventory',
    items: [
      { label: 'Warehouses', path: paths.warehouses, icon: Warehouse },
      { label: 'Network Map', path: paths.warehouseMap, icon: Warehouse },
      { label: 'Inventory', path: paths.inventory, icon: Package },
    ],
  },
  {
    title: 'Intelligence',
    items: [
      { label: 'Optimization Decision', path: paths.optimization, icon: Sparkles },
      { label: 'Analytics', path: paths.analytics, icon: BarChart3 },
    ],
  },
]
