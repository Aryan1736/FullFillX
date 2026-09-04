import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'

import { fetchShippingCostTrend } from '../api/dashboardApi'
import { dashboardService } from '../services/dashboardService'
import type { ShippingCostTrend } from '../types/dashboard'

export type AnalyticsTimeRange = '7D' | '30D' | '90D'

export function computeDateRange(range: AnalyticsTimeRange): { startDate: string; endDate: string } {
  const now = new Date()
  const days = range === '7D' ? 7 : range === '30D' ? 30 : 90
  const start = new Date(now)
  start.setDate(now.getDate() - (days - 1))

  const toIsoDate = (d: Date) => {
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  return {
    startDate: toIsoDate(start),
    endDate: toIsoDate(now),
  }
}

export function useShippingCostTrend(range: AnalyticsTimeRange) {
  const { startDate, endDate } = useMemo(() => computeDateRange(range), [range])

  const liveQuery = useQuery({
    queryKey: ['analytics', 'shipping-cost-trend', startDate, endDate],
    queryFn: () => fetchShippingCostTrend({ startDate, endDate }),
    retry: 1,
  })

  const mockQuery = useQuery({
    queryKey: ['analytics', 'shipping-cost-trend', 'mock', range],
    queryFn: async (): Promise<ShippingCostTrend> => {
      const mockAll = dashboardService.getMockDashboard().shippingCostTrend
      const count = range === '7D' ? 7 : range === '30D' ? 30 : 90
      return { trend: mockAll.slice(-count) }
    },
    enabled: liveQuery.isError,
  })

  const isLoading = liveQuery.isLoading || (liveQuery.isError && mockQuery.isLoading)
  const isFetching = liveQuery.isFetching
  const isError = liveQuery.isError && mockQuery.isError
  const isMock = liveQuery.isError && mockQuery.isSuccess
  const data = liveQuery.data ?? mockQuery.data

  return {
    data,
    startDate,
    endDate,
    isLoading,
    isFetching,
    isError,
    isMock,
    refetch: liveQuery.refetch,
  }
}
