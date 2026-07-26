import { api } from '../services/api'
import type { ApiResponse, Customer, CustomerQueryParams, PageResponse } from '../types/customer'

function toNumber(value: unknown, fallback = 0): number {
  if (value == null) {
    return fallback
  }

  const parsed = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function mapCustomer(payload: Record<string, unknown>): Customer {
  return {
    id: String(payload.id ?? ''),
    name: String(payload.name ?? ''),
    city: String(payload.city ?? ''),
    latitude: toNumber(payload.latitude),
    longitude: toNumber(payload.longitude),
    createdAt: String(payload.createdAt ?? ''),
    updatedAt: String(payload.updatedAt ?? ''),
  }
}

export async function fetchCustomers(
  params: CustomerQueryParams,
): Promise<PageResponse<Customer>> {
  const { data } = await api.get<ApiResponse<PageResponse<Record<string, unknown>>>>('/customers', {
    params: {
      page: params.page,
      size: params.size,
      ...(params.sort ? { sort: params.sort } : {}),
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
    content: (page.content ?? []).map((item) => mapCustomer(item as Record<string, unknown>)),
  }
}

export async function fetchCustomerById(id: string): Promise<Customer> {
  const { data } = await api.get<ApiResponse<Record<string, unknown>>>(`/customers/${id}`)
  return mapCustomer(data.data)
}
