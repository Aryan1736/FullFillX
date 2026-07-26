import L from 'leaflet'

import type { UtilizationTone } from './warehouseMapStyles'

const MARKER_COLORS: Record<UtilizationTone | 'selected' | 'related', string> = {
  low: '#10b981',
  medium: '#f59e0b',
  high: '#ef4444',
  selected: '#2563eb',
  related: '#8b5cf6',
}

export function createWarehouseMarkerIcon(options: {
  tone: UtilizationTone
  selected: boolean
  related: boolean
}): L.DivIcon {
  const size = options.selected ? 22 : options.related ? 18 : 16
  const color = options.selected
    ? MARKER_COLORS.selected
    : options.related
      ? MARKER_COLORS.related
      : MARKER_COLORS[options.tone]
  const ring = options.selected
    ? 'box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.25);'
    : options.related
      ? 'box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.25);'
      : ''

  return L.divIcon({
    className: '',
    html: `<div style="width:${size}px;height:${size}px;border-radius:9999px;background:${color};border:2px solid #fff;${ring}"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2 + 4)],
  })
}
