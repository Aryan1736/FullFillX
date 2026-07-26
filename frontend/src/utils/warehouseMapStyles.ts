import { getUtilizationTone } from '../services/warehouseService'

export type UtilizationTone = ReturnType<typeof getUtilizationTone>

export function resolveMarkerTone(utilization: number): UtilizationTone {
  return getUtilizationTone(utilization)
}

export const DEFAULT_MAP_CENTER: [number, number] = [20.5937, 78.9629]
export const DEFAULT_MAP_ZOOM = 5
