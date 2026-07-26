import type { ApiResponse, PageResponse } from './warehouse'

export type { ApiResponse, PageResponse }

export type Product = {
  id: string
  name: string
  category: string
  weight: number
  createdAt: string
  updatedAt: string
}

export type ProductQueryParams = {
  page: number
  size: number
  sort?: string
}
