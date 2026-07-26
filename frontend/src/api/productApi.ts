import { api } from '../services/api'
import type { ApiResponse, PageResponse, Product, ProductQueryParams } from '../types/product'

function toNumber(value: unknown, fallback = 0): number {
  if (value == null) {
    return fallback
  }

  const parsed = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function mapProduct(payload: Record<string, unknown>): Product {
  return {
    id: String(payload.id ?? ''),
    name: String(payload.name ?? ''),
    category: String(payload.category ?? ''),
    weight: toNumber(payload.weight),
    createdAt: String(payload.createdAt ?? ''),
    updatedAt: String(payload.updatedAt ?? ''),
  }
}

export async function fetchProducts(params: ProductQueryParams): Promise<PageResponse<Product>> {
  const { data } = await api.get<ApiResponse<PageResponse<Record<string, unknown>>>>('/products', {
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
    content: (page.content ?? []).map((item) => mapProduct(item as Record<string, unknown>)),
  }
}
