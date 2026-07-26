import { MapContainer, TileLayer } from 'react-leaflet'
import { useMemo } from 'react'

import type { WarehouseMapLocation } from '../../../types/warehouseMap'
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from '../../../utils/warehouseMapStyles'
import { MapBoundsFitter } from './MapBoundsFitter'
import { WarehouseMapMarker } from './WarehouseMapMarker'

import 'leaflet/dist/leaflet.css'

type WarehouseMapViewProps = {
  locations: WarehouseMapLocation[]
  selectedWarehouseId: string | null
  relatedWarehouseIds: Set<string>
  onSelectWarehouse: (warehouseId: string) => void
}

export function WarehouseMapView({
  locations,
  selectedWarehouseId,
  relatedWarehouseIds,
  onSelectWarehouse,
}: WarehouseMapViewProps) {
  const positions = useMemo(
    () => locations.map((location) => [location.latitude, location.longitude] as [number, number]),
    [locations],
  )

  return (
    <MapContainer
      center={DEFAULT_MAP_CENTER}
      zoom={DEFAULT_MAP_ZOOM}
      className="h-full min-h-[320px] w-full rounded-xl"
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapBoundsFitter positions={positions} />
      {locations.map((location) => (
        <WarehouseMapMarker
          key={location.id}
          location={location}
          selected={selectedWarehouseId === location.id}
          related={relatedWarehouseIds.has(location.id)}
          onSelect={onSelectWarehouse}
        />
      ))}
    </MapContainer>
  )
}
