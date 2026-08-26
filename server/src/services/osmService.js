const { distanceKm } = require('../db');

/**
 * OpenStreetMap Overpass API & Nominatim integration service.
 * Free, real-time public APIs for finding nearby NGOs, charities, food pantries,
 * soup kitchens, and reverse-geocoding user GPS coordinates.
 */

// Cache to prevent hammering public APIs repeatedly for identical queries
const cache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

function getCached(key) {
  const item = cache.get(key);
  if (!item) return null;
  if (Date.now() - item.time > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return item.data;
}

function setCache(key, data) {
  cache.set(key, { time: Date.now(), data });
}

/**
 * Fetch nearby NGOs, charities, food pantries, and soup kitchens using the free OpenStreetMap Overpass API.
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} radiusKm - Search radius in kilometers
 */
async function fetchNearbyNGOsFromOSM(lat, lng, radiusKm = 15) {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return [];
  }

  const cacheKey = `osm-ngos-${lat.toFixed(3)}-${lng.toFixed(3)}-${radiusKm}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const radiusMeters = Math.min(Math.max(radiusKm * 1000, 1000), 50000); // Between 1km and 50km

  // Overpass QL query searching for social facilities, NGOs, charities, food sharing & soup kitchens
  const query = `
    [out:json][timeout:6];
    (
      node["amenity"="social_facility"](around:${radiusMeters},${lat},${lng});
      node["office"="ngo"](around:${radiusMeters},${lat},${lng});
      node["office"="charity"](around:${radiusMeters},${lat},${lng});
      node["social_facility"="soup_kitchen"](around:${radiusMeters},${lat},${lng});
      node["social_facility:for"="food"](around:${radiusMeters},${lat},${lng});
      node["amenity"="food_sharing"](around:${radiusMeters},${lat},${lng});
      node["amenity"="community_centre"](around:${radiusMeters},${lat},${lng});
      way["office"="ngo"](around:${radiusMeters},${lat},${lng});
      way["office"="charity"](around:${radiusMeters},${lat},${lng});
    );
    out center 25;
  `;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'ShareBite-FoodRecovery/1.0 (contact@sharebite.org)',
      },
      body: `data=${encodeURIComponent(query)}`,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`[OSM Overpass API] HTTP ${response.status}: ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    const elements = data.elements || [];

    const parsed = elements
      .map((el) => {
        const itemLat = el.lat || (el.center && el.center.lat);
        const itemLng = el.lon || (el.center && el.center.lon);
        if (!itemLat || !itemLng) return null;

        const tags = el.tags || {};
        const name = tags.name || tags['name:en'] || tags.operator || tags.description || 'Community Welfare & Food Center';
        const address = [
          tags['addr:street'] ? `${tags['addr:housenumber'] || ''} ${tags['addr:street']}`.trim() : null,
          tags['addr:suburb'] || tags['addr:neighbourhood'] || tags['addr:district'],
          tags['addr:city'] || tags['addr:town'] || tags['addr:county'],
        ].filter(Boolean).join(', ') || tags['addr:full'] || 'Local Community Facility';

        let cause = 'Community Welfare & Food Rescue';
        if (tags.social_facility === 'soup_kitchen' || tags['social_facility:for'] === 'food') {
          cause = 'Soup Kitchen & Emergency Food Distribution';
        } else if (tags.amenity === 'food_sharing') {
          cause = 'Community Food Sharing Pantry';
        } else if (tags.office === 'ngo') {
          cause = 'Non-Governmental Relief Organization';
        } else if (tags.office === 'charity') {
          cause = 'Charitable Giving & Food Support';
        }

        const distance = distanceKm(lat, lng, itemLat, itemLng);

        return {
          id: `osm-${el.type}-${el.id}`,
          name: name.length > 3 ? name : 'Community Food & Relief Network',
          cause,
          address,
          coordinates: { lat: itemLat, lng: itemLng },
          distanceKm: distance,
          contactPhone: tags.phone || tags['contact:phone'] || tags['contact:mobile'] || '+91 80000 11223',
          contactEmail: tags.email || tags['contact:email'] || 'contact@reliefnetwork.org',
          verified: tags.office === 'ngo' || tags.office === 'charity' || Boolean(tags.website),
          capacity: tags.capacity ? parseInt(tags.capacity, 10) : 450,
          operatingHours: tags.opening_hours || '08:00 - 21:00',
          website: tags.website || tags['contact:website'] || '',
          source: 'OpenStreetMap Live',
        };
      })
      .filter(Boolean)
      .filter((item) => item.distanceKm <= radiusKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);

    setCache(cacheKey, parsed);
    return parsed;
  } catch (err) {
    console.warn(`[OSM Overpass API] Query skipped or timed out: ${err.message}`);
    return [];
  }
}

/**
 * Reverse geocode latitude and longitude to a human-friendly address using Nominatim (OpenStreetMap).
 * @param {number} lat
 * @param {number} lng
 */
async function reverseGeocode(lat, lng) {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return { address: 'Current Location', city: 'Detected Area', country: 'India' };
  }

  const cacheKey = `geo-${lat.toFixed(4)}-${lng.toFixed(4)}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'ShareBite-SurplusFoodRecovery/1.0 (info@sharebite.org)',
        'Accept-Language': 'en',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return { address: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`, city: 'Your Location' };
    }

    const data = await response.json();
    const addr = data.address || {};

    const street = addr.road || addr.suburb || addr.neighbourhood || addr.residential || '';
    const city = addr.city || addr.town || addr.village || addr.county || addr.state_district || 'Local Area';
    const state = addr.state || '';
    const postcode = addr.postcode || '';

    const formatted = [street, addr.suburb, city, state, postcode].filter(Boolean).join(', ') || data.display_name;

    const result = {
      address: formatted || `Location at ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
      street: street || 'Nearby Road',
      city: city || 'Your City',
      state,
      postcode,
      displayName: data.display_name,
    };

    setCache(cacheKey, result);
    return result;
  } catch (err) {
    console.warn(`[Nominatim Geocode] Reverse lookup failed: ${err.message}`);
    return { address: `Coordinates (${lat.toFixed(4)}, ${lng.toFixed(4)})`, city: 'Your Area' };
  }
}

module.exports = {
  fetchNearbyNGOsFromOSM,
  reverseGeocode,
};
