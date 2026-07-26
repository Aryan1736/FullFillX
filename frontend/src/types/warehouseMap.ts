import type { Warehouse } from './warehouse'

export type WarehouseMapLocation = Warehouse & {
  inventoryCount: number
  utilization: number
}

export type WarehouseMapData = {
  locations: WarehouseMapLocation[]
}
