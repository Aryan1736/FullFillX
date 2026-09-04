import L from 'leaflet'

import type { UtilizationTone } from './warehouseMapStyles'

const MARKER_COLORS: Record<UtilizationTone | 'selected' | 'related', string> = {
  low: '#3FA66B',
  medium: '#D08A35',
  high: '#C95555',
  selected: '#C4622D',
  related: '#71717A',
}

export function createWarehouseMarkerIcon(options: {
  tone: UtilizationTone
  selected: boolean
  related: boolean
}): L.DivIcon {
  const size = options.selected ? 24 : options.related ? 20 : 18
  const color = options.selected
    ? MARKER_COLORS.selected
    : options.related
      ? MARKER_COLORS.related
      : MARKER_COLORS[options.tone]

  const shadow = options.selected
    ? 'box-shadow: 0 0 0 5px rgba(196, 98, 45, 0.35), 0 4px 12px rgba(0,0,0,0.45);'
    : options.related
      ? 'box-shadow: 0 0 0 4px rgba(113, 113, 122, 0.3), 0 3px 8px rgba(0,0,0,0.3);'
      : 'box-shadow: 0 2px 6px rgba(0,0,0,0.3);'

  const innerDot = options.selected
    ? '<div style="width:8px;height:8px;border-radius:9999px;background:#ffffff;margin:auto;"></div>'
    : ''

  return L.divIcon({
    className: '',
    html: `<div style="display:flex;align-items:center;justify-content:center;width:${size}px;height:${size}px;border-radius:9999px;background:${color};border:2px solid #17171B;${shadow};transition:transform 0.15s ease;">${innerDot}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2 + 6)],
  })
}
