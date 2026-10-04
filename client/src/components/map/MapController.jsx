import { useEffect } from 'react'
import { useMap } from 'react-leaflet'

export function MapController({ center, zoom = 13 }) {
  const map = useMap()
  useEffect(() => {
    if (center && Number.isFinite(center[0]) && Number.isFinite(center[1])) {
      map.flyTo(center, zoom, { duration: 1.2 })
    }
  }, [center, zoom, map])
  return null
}
