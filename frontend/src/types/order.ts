import type { PageResponse } from './warehouse'

export type OrderStatus =
  | 'PENDING'
  | 'ALLOCATED'
  | 'FULFILLING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'

export type OrderItem = {
  productId: string
  quantity: number
}

export type CustomerOrder = {
  id: string
  customerId: string
  status: OrderStatus
  totalItems: number
  orderItems: OrderItem[]
  createdAt: string
  updatedAt: string
}

export type CustomerOrderQueryParams = {
  page: number
  size: number
}

export type { PageResponse }
