import { Marker, Popup } from 'react-leaflet'
import { useMemo } from 'react'

import type { WarehouseMapLocation } from '../../../types/warehouseMap'
import { createWarehouseMarkerIcon } from '../../../utils/leafletIcons'
import { resolveMarkerTone } from '../../../utils/warehouseMapStyles'
import { WarehouseMarkerPopup } from './WarehouseMarkerPopup'

type WarehouseMapMarkerProps = {
  location: WarehouseMapLocation
  selected: boolean
  related: boolean
  onSelect: (warehouseId: string) => void
}

export function WarehouseMapMarker({
  location,
  selected,
  related,
  onSelect,
}: WarehouseMapMarkerProps) {
  const icon = useMemo(
    () =>
      createWarehouseMarkerIcon({
        tone: resolveMarkerTone(location.utilization),
        selected,
        related,
      }),
    [location.utilization, related, selected],
  )

  return (
    <Marker
      position={[location.latitude, location.longitude]}
      icon={icon}
      eventHandlers={{
        click: () => onSelect(location.id),
      }}
    >
      <Popup>
        <WarehouseMarkerPopup location={location} />
      </Popup>
    </Marker>
  )
}
