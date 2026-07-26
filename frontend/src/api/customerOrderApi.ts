import { api } from '../services/api'
import type { ApiResponse } from '../types/warehouse'
import type { CustomerOrder, CustomerOrderQueryParams, PageResponse } from '../types/order'

function toNumber(value: unknown, fallback = 0): number {
  if (value == null) {
    return fallback
  }

  const parsed = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function mapOrderItem(payload: Record<string, unknown>) {
  return {
    productId: String(payload.productId ?? ''),
    quantity: toNumber(payload.quantity),
  }
}

function mapCustomerOrder(payload: Record<string, unknown>): CustomerOrder {
  return {
    id: String(payload.id ?? ''),
    customerId: String(payload.customerId ?? ''),
    status: String(payload.status ?? 'PENDING') as CustomerOrder['status'],
    totalItems: toNumber(payload.totalItems),
    orderItems: ((payload.orderItems as Record<string, unknown>[]) ?? []).map(mapOrderItem),
    createdAt: String(payload.createdAt ?? ''),
    updatedAt: String(payload.updatedAt ?? ''),
  }
}

export async function fetchCustomerOrders(
  params: CustomerOrderQueryParams,
): Promise<PageResponse<CustomerOrder>> {
  const { data } = await api.get<ApiResponse<PageResponse<Record<string, unknown>>>>('/customer-orders', {
    params: {
      page: params.page,
      size: params.size,
      sort: 'createdAt,desc',
    },
  })

  const page = data.data

  return {
    page: toNumber(page.page),
    size: toNumber(page.size),
    totalElements: toNumber(page.totalElements),
    totalPages: toNumber(page.totalPages),
    first: Boolean(page.first),
    last: Boolean(page.last),
    sort: String(page.sort ?? ''),
    content: (page.content ?? []).map((item) => mapCustomerOrder(item as Record<string, unknown>)),
  }
}

export async function fetchCustomerOrderById(id: string): Promise<CustomerOrder> {
  const { data } = await api.get<ApiResponse<Record<string, unknown>>>(`/customer-orders/${id}`)
  return mapCustomerOrder(data.data)
}
