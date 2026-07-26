import { fetchInventory } from '../api/inventoryApi'
import { fetchWarehouses } from '../api/warehouseApi'
import type { Allocation } from '../types/allocation'
import type { PageResponse } from '../types/warehouse'
import type { WarehouseMapData, WarehouseMapLocation } from '../types/warehouseMap'
import { calculateUtilization } from './warehouseService'

async function fetchAllWarehouses() {
  const warehouses = []
  let page = 0
  let last = false

  while (!last) {
    const response = await fetchWarehouses({
      page,
      size: 100,
      sort: { field: 'name', direction: 'asc' },
    })

    warehouses.push(...response.content)
    last = response.last
    page += 1
  }

  return warehouses
}

async function fetchInventoryCountsByWarehouse(): Promise<Record<string, number>> {
  const counts: Record<string, number> = {}
  let page = 0
  let last = false

  while (!last) {
    const response = await fetchInventory({ page, size: 100 })
    for (const item of response.content) {
      counts[item.warehouseId] = (counts[item.warehouseId] ?? 0) + 1
    }

    last = response.last
    page += 1
  }

  return counts
}

function isPlottableWarehouse(
  latitude: number,
  longitude: number,
): boolean {
  return (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180 &&
    !(latitude === 0 && longitude === 0)
  )
}

export class WarehouseMapService {
  async getMapData(): Promise<WarehouseMapData> {
    const [warehouses, inventoryCounts] = await Promise.all([
      fetchAllWarehouses(),
      fetchInventoryCountsByWarehouse(),
    ])

    const locations: WarehouseMapLocation[] = warehouses
      .filter((warehouse) => isPlottableWarehouse(warehouse.latitude, warehouse.longitude))
      .map((warehouse) => ({
        ...warehouse,
        inventoryCount: inventoryCounts[warehouse.id] ?? 0,
        utilization: calculateUtilization(warehouse),
      }))

    return { locations }
  }
}

export const warehouseMapService = new WarehouseMapService()

export function getRelatedWarehouseIds(
  allocations: PageResponse<Allocation> | undefined,
  selectedWarehouseId: string,
): Set<string> {
  const relatedIds = new Set<string>()

  if (!allocations) {
    return relatedIds
  }

  for (const allocation of allocations.content) {
    for (const entry of allocation.warehouses) {
      const warehouseId = entry.warehouse?.id
      if (warehouseId && warehouseId !== selectedWarehouseId) {
        relatedIds.add(warehouseId)
      }
    }
  }

  return relatedIds
}
