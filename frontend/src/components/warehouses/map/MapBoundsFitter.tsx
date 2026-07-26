import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'

type MapBoundsFitterProps = {
  positions: [number, number][]
}

export function MapBoundsFitter({ positions }: MapBoundsFitterProps) {
  const map = useMap()

  useEffect(() => {
    if (positions.length === 0) {
      return
    }

    if (positions.length === 1) {
      map.setView(positions[0], 10)
      return
    }

    map.fitBounds(L.latLngBounds(positions), {
      padding: [48, 48],
      maxZoom: 12,
    })
  }, [map, positions])

  return null
}
