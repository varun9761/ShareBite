import { useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer, Polyline } from 'react-leaflet'
import { MapController } from './MapController'
import {
  foodMarkerIcon,
  ngoMarkerIcon,
  restaurantMarkerIcon,
  userLocationIcon,
  generateWhatsAppShareUrl,
  getGoogleMapsDirectionsUrl,
} from '../../api/client'
import { Navigation, Phone, Utensils, MessageCircle, ExternalLink, Route } from 'lucide-react'

export function EnhancedListingMap({
  userLocation,
  listings = [],
  ngos = [],
  donors = [],
  mapFilter = 'all',
  setMapFilter,
  onClaim,
  onConnectNGO,
}) {
  const [activeRoute, setActiveRoute] = useState(null)

  const center = [userLocation.lat, userLocation.lng]

  function showRouteTo(destinationCoords, title) {
    setActiveRoute({
      path: [
        [userLocation.lat, userLocation.lng],
        [destinationCoords.lat, destinationCoords.lng],
      ],
      title,
    })
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200 shadow-xl dark:border-slate-850">
      {/* Floating Filter Controls on Map */}
      <div className="absolute left-2.5 top-2.5 right-2.5 sm:right-auto sm:left-4 sm:top-4 z-[1000] flex items-center gap-1.5 rounded-2xl bg-white/95 p-1.5 shadow-xl backdrop-blur-md dark:bg-[#0E1420]/95 overflow-x-auto scrollbar-none">
        <button
          className={`shrink-0 rounded-xl px-2.5 sm:px-3 py-1.5 text-xs font-black transition ${
            mapFilter === 'all'
              ? 'bg-slate-900 text-white dark:bg-emerald-600'
              : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
          }`}
          onClick={() => setMapFilter('all')}
        >
          All ({listings.length + ngos.length + donors.length})
        </button>
        <button
          className={`shrink-0 rounded-xl px-2.5 sm:px-3 py-1.5 text-xs font-black transition ${
            mapFilter === 'food'
              ? 'bg-amber-600 text-white'
              : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
          }`}
          onClick={() => setMapFilter('food')}
        >
          🍲 Food ({listings.length})
        </button>
        <button
          className={`shrink-0 rounded-xl px-2.5 sm:px-3 py-1.5 text-xs font-black transition ${
            mapFilter === 'donors'
              ? 'bg-emerald-600 text-white'
              : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
          }`}
          onClick={() => setMapFilter('donors')}
        >
          🍽️ Venues ({donors.length})
        </button>
        <button
          className={`shrink-0 rounded-xl px-2.5 sm:px-3 py-1.5 text-xs font-black transition ${
            mapFilter === 'ngo'
              ? 'bg-blue-600 text-white'
              : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
          }`}
          onClick={() => setMapFilter('ngo')}
        >
          🏢 NGOs ({ngos.length})
        </button>
      </div>

      {/* Active Route Banner */}
      {activeRoute && (
        <div className="absolute bottom-4 left-4 right-4 z-[1000] flex items-center justify-between gap-3 rounded-2xl bg-slate-900/95 px-4 py-2.5 text-xs font-bold text-white shadow-2xl backdrop-blur-md sm:left-auto sm:right-4 sm:w-auto">
          <div className="flex items-center gap-2">
            <Route size={16} className="text-emerald-400" />
            <span>Direct Vector to: <strong>{activeRoute.title}</strong></span>
          </div>
          <button
            onClick={() => setActiveRoute(null)}
            className="rounded-lg bg-white/20 px-2 py-0.5 text-[10px] hover:bg-white/30 transition"
          >
            Clear Route
          </button>
        </div>
      )}

      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={false}
        className="h-[420px] sm:h-[560px] w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController center={center} zoom={13} />

        {/* User Location Radar Marker */}
        <Marker position={center} icon={userLocationIcon}>
          <Popup>
            <div className="p-1 text-xs">
              <strong className="block text-sm font-black text-blue-600">📍 You Are Here</strong>
              <p className="mt-1 text-slate-700 font-medium">{userLocation.address}</p>
              {userLocation.isLiveGPS && (
                <span className="mt-1 inline-block rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-blue-700">
                  ✓ Precise GPS Active
                </span>
              )}
            </div>
          </Popup>
        </Marker>

        {/* Route Line if active */}
        {activeRoute && (
          <Polyline
            positions={activeRoute.path}
            pathOptions={{ color: '#10B981', weight: 4, dashArray: '8, 8', opacity: 0.9 }}
          />
        )}

        {/* Surplus Food Listings Pins */}
        {(mapFilter === 'all' || mapFilter === 'food') &&
          listings.map((l) => (
            <Marker key={l.id} position={[l.coordinates.lat, l.coordinates.lng]} icon={foodMarkerIcon}>
              <Popup>
                <div className="space-y-1.5 p-1 text-xs">
                  <div className="font-bold text-amber-700">🍲 Surplus Food Available</div>
                  <strong className="block text-sm font-black text-slate-900">{l.foodType}</strong>
                  <p className="text-slate-700 font-medium">{l.quantity} {l.quantityUnit} · {l.foodCategory}</p>
                  <p className="text-slate-600">📍 {l.address} ({l.distanceKm} km away)</p>

                  <button
                    onClick={() => showRouteTo(l.coordinates, l.foodType)}
                    className="flex w-full items-center justify-center gap-1 rounded-lg border border-slate-200 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-50 transition"
                  >
                    <Route size={12} /> Draw Route Line
                  </button>

                  {l.status === 'pending' && (
                    <button
                      className="mt-1.5 w-full rounded-lg bg-amber-600 py-1.5 font-bold text-white shadow-sm hover:bg-amber-700"
                      onClick={() => onClaim(l.id)}
                    >
                      Claim this Batch
                    </button>
                  )}

                  <div className="mt-1.5 flex gap-1">
                    <a
                      href={generateWhatsAppShareUrl(l)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 rounded-lg bg-emerald-600 py-1 text-center text-[10px] font-bold text-white hover:bg-emerald-700"
                    >
                      WhatsApp
                    </a>
                    <a
                      href={getGoogleMapsDirectionsUrl(l)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 rounded-lg bg-blue-600 py-1 text-center text-[10px] font-bold text-white hover:bg-blue-700"
                    >
                      Directions
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

        {/* Real Restaurants Pins */}
        {(mapFilter === 'all' || mapFilter === 'donors') &&
          donors.map((d) => (
            <Marker key={d.id} position={[d.coordinates.lat, d.coordinates.lng]} icon={restaurantMarkerIcon}>
              <Popup>
                <div className="space-y-1 p-1 text-xs">
                  <div className="font-bold text-emerald-700">🍽️ Real Restaurant / Eatery</div>
                  <strong className="block text-sm font-black text-slate-900">{d.name}</strong>
                  <p className="text-slate-700 font-medium">{d.cuisine || d.type}</p>
                  <p className="text-slate-600">📍 {d.address} ({d.distanceKm} km away)</p>
                  {d.phone && <p className="font-bold text-slate-800">📞 {d.phone}</p>}

                  <div className="mt-2 flex gap-1">
                    <button
                      onClick={() => showRouteTo(d.coordinates, d.name)}
                      className="flex-1 rounded-lg border border-slate-200 py-1 text-center text-[10px] font-bold text-slate-700 hover:bg-slate-50 transition"
                    >
                      Route Line
                    </button>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${d.coordinates.lat},${d.coordinates.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 rounded-lg bg-emerald-600 py-1 text-center text-[10px] font-bold text-white hover:bg-emerald-700"
                    >
                      Directions
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

        {/* NGOs & Charities Pins */}
        {(mapFilter === 'all' || mapFilter === 'ngo') &&
          ngos.map((n) => (
            <Marker key={n.id} position={[n.coordinates.lat, n.coordinates.lng]} icon={ngoMarkerIcon}>
              <Popup>
                <div className="space-y-1.5 p-1 text-xs">
                  <div className="font-bold text-blue-700">🏢 NGO / Relief Center</div>
                  <strong className="block text-sm font-black text-slate-900">{n.name}</strong>
                  <p className="text-slate-700 font-medium">{n.cause}</p>
                  <p className="text-slate-600">📍 {n.address} ({n.distanceKm} km away)</p>
                  {n.contactPhone && <p className="font-bold text-slate-800">📞 {n.contactPhone}</p>}

                  <button
                    className="mt-2 w-full rounded-lg bg-blue-600 py-1.5 font-bold text-white shadow-sm hover:bg-blue-700"
                    onClick={() => onConnectNGO(n)}
                  >
                    Offer Food to this NGO
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  )
}
