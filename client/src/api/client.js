import L from 'leaflet'

export const API_BASE = import.meta.env.VITE_API_BASE || ''

export const locationPresets = [
  { label: 'Bengaluru - Koramangala', address: 'Koramangala 5th Block, Bengaluru', lat: 12.9352, lng: 77.6245 },
  { label: 'Bengaluru - Domlur / Indiranagar', address: 'Domlur & Indiranagar, Bengaluru', lat: 12.9611, lng: 77.6387 },
  { label: 'New Delhi - Connaught Place', address: 'Connaught Place, New Delhi', lat: 28.6315, lng: 77.2167 },
  { label: 'Mumbai - Bandra West', address: 'Bandra West, Mumbai', lat: 19.0607, lng: 72.8362 },
  { label: 'Hyderabad - Hitec City', address: 'Hitec City, Hyderabad', lat: 17.4435, lng: 78.3772 },
  { label: 'Chennai - T Nagar', address: 'T Nagar, Chennai', lat: 13.0418, lng: 80.2341 },
  { label: 'Kolkata - Park Street', address: 'Park Street, Kolkata', lat: 22.5535, lng: 88.3512 },
  { label: 'Pune - Koregaon Park', address: 'Koregaon Park, Pune', lat: 18.5362, lng: 73.8939 },
]

// Custom Leaflet DivIcons
export const foodMarkerIcon = L.divIcon({
  className: '',
  html: '<div class="map-marker"><span></span></div>',
  iconSize: [34, 34],
  iconAnchor: [17, 34],
})

export const ngoMarkerIcon = L.divIcon({
  className: '',
  html: '<div class="map-marker map-marker-ngo"><span></span></div>',
  iconSize: [34, 34],
  iconAnchor: [17, 34],
})

export const restaurantMarkerIcon = L.divIcon({
  className: '',
  html: '<div class="map-marker map-marker-restaurant"><span></span></div>',
  iconSize: [34, 34],
  iconAnchor: [17, 34],
})

export const userLocationIcon = L.divIcon({
  className: '',
  html: '<div class="map-marker-user"></div>',
  iconSize: [22, 22],
  iconAnchor: [11, 11],
})

export const statusBadgeTone = {
  pending: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-700',
  claimed: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-700',
  picked_up: 'bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950/70 dark:text-blue-300 dark:border-blue-700',
  expired: 'bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-700',
}

export async function api(path, options = {}) {
  const url = `${API_BASE}${path}`
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}))
    throw new Error(errorBody.message || `Request failed (${response.status})`)
  }

  return response.json()
}

export function generateWhatsAppShareUrl(listing) {
  const expiryTime = listing.expiresAt
    ? new Date(listing.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : 'Soon'
  const message =
    `🚨 *URGENT SURPLUS FOOD RESCUE ALERT - ShareBite* 🚨\n\n` +
    `🍲 *Food Batch:* ${listing.foodType || 'Surplus Meals'}\n` +
    `📦 *Quantity:* ${listing.quantity} ${listing.quantityUnit || 'servings'}\n` +
    `🏢 *Donor:* ${listing.donorName || 'Local Partner'}\n` +
    `📍 *Pickup Address:* ${listing.address || 'Address provided on ShareBite'}\n` +
    `⏰ *Safe Until:* ${expiryTime}\n` +
    `🌱 *Impact:* Diverts ~${listing.co2AvoidedKg || Math.round((listing.quantity || 1) * 0.8)} kg CO₂\n\n` +
    `👉 *Open ShareBite now to claim and coordinate volunteer pickup!*`
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`
}

export function getGoogleMapsDirectionsUrl(listing, userLocation = null) {
  const destLat = listing?.coordinates?.lat ?? listing?.lat
  const destLng = listing?.coordinates?.lng ?? listing?.lng
  if (destLat && destLng) {
    if (userLocation?.lat && userLocation?.lng) {
      return `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${destLat},${destLng}`
    }
    return `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}`
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(listing?.address || listing?.donorName || 'Food Donor')}`
}

export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (!Number.isFinite(lat1) || !Number.isFinite(lon1) || !Number.isFinite(lat2) || !Number.isFinite(lon2)) {
    return 0;
  }
  const earthRadiusKm = 6371;
  const latDelta = ((lat2 - lat1) * Math.PI) / 180;
  const lngDelta = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(latDelta / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(lngDelta / 2) ** 2;
  return Number((earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1));
}

export function toDatetimeLocal(date) {
  const pad = (n) => String(n).padStart(2, '0')
  const y = date.getFullYear()
  const m = pad(date.getMonth() + 1)
  const d = pad(date.getDate())
  const hh = pad(date.getHours())
  const mm = pad(date.getMinutes())
  return `${y}-${m}-${d}T${hh}:${mm}`
}
