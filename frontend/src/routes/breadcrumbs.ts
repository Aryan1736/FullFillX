import { paths } from './paths'

export type BreadcrumbItem = {
  label: string
  path?: string
}

type BreadcrumbRoute = {
  label: string
  parent?: string
}

const breadcrumbRoutes: Record<string, BreadcrumbRoute> = {
  [paths.dashboard]: { label: 'Dashboard' },
  [paths.warehouses]: { label: 'Warehouses' },
  [paths.warehouseMap]: { label: 'Map', parent: paths.warehouses },
  [paths.inventory]: { label: 'Inventory' },
  [paths.orders]: { label: 'Orders' },
  [paths.allocations]: { label: 'Allocations' },
  [paths.optimization]: { label: 'Optimization' },
  [paths.analytics]: { label: 'Analytics' },
}

export function getBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = []
  let currentPath: string | undefined = pathname

  while (currentPath) {
    const route: BreadcrumbRoute | undefined = breadcrumbRoutes[currentPath]
    if (!route) {
      break
    }

    items.unshift({
      label: route.label,
      path: currentPath === pathname ? undefined : currentPath,
    })

    currentPath = route.parent
  }

  if (items.length === 0) {
    return [{ label: 'Dashboard' }]
  }

  return items
}
