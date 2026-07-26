import type { ApiResponse } from './dashboard'

export type { ApiResponse }

export type Warehouse = {
  id: string
  name: string
  city: string
  latitude: number
  longitude: number
  capacity: number
  currentLoad: number
  active: boolean
  createdAt: string
  updatedAt: string
}

export type PageResponse<T> = {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  first: boolean
  last: boolean
  sort: string
}

export type WarehouseSortField = 'name' | 'city' | 'capacity' | 'currentLoad' | 'active'

export type WarehouseSort = {
  field: WarehouseSortField
  direction: 'asc' | 'desc'
}

export type WarehouseFilters = {
  name?: string
  city?: string
  active?: boolean
}

export type WarehouseQueryParams = WarehouseFilters & {
  page: number
  size: number
  sort?: WarehouseSort
}
