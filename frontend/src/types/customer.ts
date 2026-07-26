import type { ApiResponse, PageResponse } from './warehouse'

export type { ApiResponse, PageResponse }

export type Customer = {
  id: string
  name: string
  city: string
  latitude: number
  longitude: number
  createdAt: string
  updatedAt: string
}

export type CustomerQueryParams = {
  page: number
  size: number
  sort?: string
}
