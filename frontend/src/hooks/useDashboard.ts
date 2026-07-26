import { useQuery } from '@tanstack/react-query'

import { dashboardService } from '../services/dashboardService'
import type { DashboardData } from '../types/dashboard'

export const dashboardQueryKey = ['dashboard'] as const

export type DashboardQueryResult = {
  data: DashboardData
  isMock: boolean
}

export function useDashboard() {
  const liveQuery = useQuery({
    queryKey: [...dashboardQueryKey, 'live'],
    queryFn: () => dashboardService.fetchDashboard(),
    retry: 1,
  })

  const mockQuery = useQuery({
    queryKey: [...dashboardQueryKey, 'mock'],
    queryFn: () => dashboardService.getMockDashboard(),
    enabled: liveQuery.isError,
  })

  const isLoading = liveQuery.isLoading || (liveQuery.isError && mockQuery.isLoading)
  const isError = liveQuery.isError && mockQuery.isError
  const isMock = liveQuery.isError && mockQuery.isSuccess

  const data = liveQuery.data ?? mockQuery.data

  return {
    data: data ? { data, isMock } satisfies DashboardQueryResult : undefined,
    isLoading,
    isError,
    isMock,
    refetch: liveQuery.refetch,
    error: liveQuery.error ?? mockQuery.error,
  }
}
