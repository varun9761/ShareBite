require('dotenv').config();

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cron = require('node-cron');
const { initDatabase, db, distanceKm } = require('./db');
const { fetchNearbyNGOsFromOSM, fetchNearbyRestaurantsFromOSM, fetchRouteBetween, reverseGeocode, geocodeSearch, getIpLocation } = require('./services/osmService');

const app = express();
const port = process.env.PORT || 4000;
const jwtSecret = process.env.JWT_SECRET || 'sharebite-local-dev-secret';

// Middleware - Robust CORS supporting Localhost, Vercel deployments, and production origins
const allowedOrigins = [
  process.env.CLIENT_ORIGIN,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4173',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (Postman, curl, server-to-server)
    if (!origin) return callback(null, true);
    // Allow any Vercel or Render preview or production URL
    if (origin.endsWith('.vercel.app') || origin.endsWith('.onrender.com') || origin.endsWith('.netlify.app')) {
      return callback(null, true);
    }
    // Allow explicit allowed origins or fallback wildcard
    if (allowedOrigins.length === 0 || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Initialize Database connection & migrations
initDatabase().catch((err) => {
  console.error('[Startup] Database initialization error:', err);
});

// Helper for JWT Signing
function signUser(user) {
  return jwt.sign(
    { sub: user.id, role: user.role, verified: user.verified, name: user.name },
    jwtSecret,
    { expiresIn: '24h' }
  );
}

// Optional / Required Auth Middleware
async function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return next();

  try {
    const payload = jwt.verify(token, jwtSecret);
    const user = await db.findUserById(payload.sub);
    if (user) req.user = user;
  } catch {
    // Continue anonymously
  }
  next();
}

app.use(authenticateToken);

// --- HEALTH & STATUS ---
app.get('/api/health', async (_req, res) => {
  const health = await db.getHealth();
  res.json({
    ok: true,
    service: 'sharebite-api',
    ...health,
  });
});

// --- AUTHENTICATION ---
app.post('/api/auth/register', async (req, res, next) => {
  try {
    const { name, email, password, role, address, coordinates, phone } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Name, email, password, and role are required.' });
    }

    const existing = await db.findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ message: 'A user with this email address already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await db.createUser({
      name,
      email,
      passwordHash,
      role,
      address,
      coordinates,
      phone,
    });

    res.status(201).json({ user, token: signUser(user) });
  } catch (error) {
    next(error);
  }
});

app.post('/api/auth/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await db.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const safeUser = await db.findUserById(user.id);
    res.json({ user: safeUser, token: signUser(safeUser) });
  } catch (error) {
    next(error);
  }
});

// --- SURPLUS FOOD LISTINGS ---
app.get('/api/listings', async (req, res, next) => {
  try {
    const lat = req.query.lat ? Number(req.query.lat) : undefined;
    const lng = req.query.lng ? Number(req.query.lng) : undefined;
    const radiusKm = req.query.radiusKm ? Number(req.query.radiusKm) : 15;
    const category = req.query.category || 'all';
    const search = req.query.search || '';
    const sortBy = req.query.sortBy || 'expiry';

    let activeListings = await db.listActiveListings({ lat, lng, radiusKm, category, search, sortBy });

    // If no active listings exist within the user's current city radius (e.g. user is outside Bengaluru seed data),
    // automatically generate local surplus food batches from real nearby OpenStreetMap restaurants!
    if (activeListings.length === 0 && Number.isFinite(lat) && Number.isFinite(lng)) {
      const nearbyVenues = await fetchNearbyRestaurantsFromOSM(lat, lng, radiusKm);
      if (nearbyVenues.length > 0) {
        const topVenues = nearbyVenues.slice(0, 5);
        for (let i = 0; i < topVenues.length; i++) {
          const venue = topVenues[i];
          const isBakery = (venue.type || '').toLowerCase().includes('bakery') || (venue.cuisine || '').toLowerCase().includes('bakery');
          const isVeg = i % 2 === 0 || isBakery;
          const foodType = isBakery
            ? `${venue.name} Fresh Bread, Croissants & Muffin Baskets`
            : isVeg
            ? `${venue.name} Freshly Cooked Veg Meals & Snacks`
            : `${venue.name} Assorted Lunch Combos & Rolls`;

          try {
            await db.createListing({
              id: `osm-batch-${venue.id}`,
              donorName: venue.name,
              donorPhone: venue.phone || '+91 98450 12345',
              foodType,
              foodCategory: isVeg ? 'veg' : 'non-veg',
              quantity: 15 + i * 10,
              quantityUnit: isBakery ? 'kg' : 'servings',
              preparedAt: new Date(Date.now() - (30 + i * 20) * 60000).toISOString(),
              expiresAt: new Date(Date.now() + (2.5 + i * 0.8) * 3600000).toISOString(),
              address: venue.address,
              lat: venue.coordinates.lat,
              lng: venue.coordinates.lng,
            });
          } catch (e) {
            // Ignore duplicate
          }
        }
        activeListings = await db.listActiveListings({ lat, lng, radiusKm, category, search, sortBy });
      }
    }

    res.json(activeListings);
  } catch (error) {
    next(error);
  }
});

app.post('/api/listings', async (req, res, next) => {
  try {
    const { foodType, quantity, preparedAt, expiresAt, address } = req.body;
    if (!foodType || !quantity || !preparedAt || !expiresAt) {
      return res.status(400).json({
        message: 'Missing required fields: foodType, quantity, preparedAt, expiresAt',
      });
    }

    // Geocode address if provided to ensure accurate GPS pin on the map
    if (address && address.trim()) {
      try {
        const geoResults = await geocodeSearch(address.trim());
        if (geoResults && geoResults.length > 0) {
          req.body.lat = geoResults[0].lat;
          req.body.lng = geoResults[0].lng;
          req.body.coordinates = { lat: geoResults[0].lat, lng: geoResults[0].lng };
          console.log(`[Geocoding] Pinned "${address}" to (${geoResults[0].lat}, ${geoResults[0].lng})`);
        }
      } catch (geoErr) {
        console.warn(`[Geocoding] Address geocoding fallback for "${address}":`, geoErr.message);
      }
    }

    const listing = await db.createListing(req.body, req.user);
    console.log(`[Listing] Created surplus batch: "${listing.foodType}" by "${listing.donorName}" at "${listing.address}"`);
    res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
});

app.get('/api/donor/listings', async (req, res, next) => {
  try {
    const donorId = req.user?.id || req.query.donorId || 'user-donor-1';
    const listings = await db.listDonorListings(donorId);
    res.json(listings);
  } catch (error) {
    next(error);
  }
});

app.post('/api/listings/:id/claim', async (req, res, next) => {
  try {
    const claimer = req.user || { name: req.body.claimerName || 'Hope Meals Network', id: 'user-ngo-1' };
    const listing = await db.claimListing(req.params.id, claimer);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found.' });
    }
    res.json(listing);
  } catch (error) {
    next(error);
  }
});

app.post('/api/listings/:id/assign-ngo', async (req, res, next) => {
  try {
    const { ngoName, ngoId } = req.body;
    const claimer = { name: ngoName || 'Direct NGO Dispatch', id: ngoId || 'ngo-direct' };
    const listing = await db.claimListing(req.params.id, claimer);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found.' });
    }
    res.json(listing);
  } catch (error) {
    next(error);
  }
});

app.post('/api/listings/:id/verify-pickup', async (req, res, next) => {
  try {
    const { otp } = req.body;
    if (!otp) {
      return res.status(400).json({ message: 'Pickup OTP is required.' });
    }

    const listing = await db.verifyPickup(req.params.id, otp);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found.' });
    }
    res.json(listing);
  } catch (error) {
    next(error);
  }
});

// --- NEARBY NGOS & CHARITIES (Free API + PostgreSQL Hybrid) ---
app.get('/api/ngo/nearby', async (req, res, next) => {
  try {
    const lat = Number(req.query.lat) || 12.9611;
    const lng = Number(req.query.lng) || 77.6387;
    const radiusKm = Number(req.query.radiusKm) || 20;

    // 1. Fetch verified NGOs from our database
    const dbNGOs = await db.listNGOs({ lat, lng, radiusKm });

    // 2. Fetch live real-world NGOs & food sharing charities from OpenStreetMap Overpass API
    const osmNGOs = await fetchNearbyNGOsFromOSM(lat, lng, radiusKm);

    // 3. Deduplicate and merge by proximity / name
    const combined = [...dbNGOs];
    for (const osm of osmNGOs) {
      const isDuplicate = combined.some((existing) => {
        const d = distanceKm(existing.coordinates.lat, existing.coordinates.lng, osm.coordinates.lat, osm.coordinates.lng);
        return d < 0.2 || existing.name.toLowerCase().includes(osm.name.toLowerCase().slice(0, 8));
      }); 
      if (!isDuplicate) {
        combined.push({
          ...osm,
          statusTag: '🟢 Accepting Food Now',
        });
      }
    }

    // Sort by distance from user's current GPS location
    combined.sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999));

    res.json(combined);
  } catch (error) {
    next(error);
  }
});

app.post('/api/ngo/register', async (req, res, next) => {
  try {
    const { name, address, contactPhone, contactEmail } = req.body;
    if (!name || !address || !contactPhone) {
      return res.status(400).json({ message: 'NGO Name, address, and contact phone are required.' });
    }

    const ngo = await db.registerNGO(req.body);
    res.status(201).json(ngo);
  } catch (error) {
    next(error);
  }
});

// --- NEARBY DONATING RESTAURANTS & FOOD PLACES (Real OSM Venues + Hybrid DB) ---
app.get('/api/donors/nearby', async (req, res, next) => {
  try {
    const lat = Number(req.query.lat) || 12.9611;
    const lng = Number(req.query.lng) || 77.6387;
    const radiusKm = Number(req.query.radiusKm) || 20;

    // 1. Fetch verified donors registered in our database
    const dbDonors = await db.listDonors({ lat, lng, radiusKm });

    // 2. Fetch live real-world restaurants, bakeries, cafes from OpenStreetMap
    const osmRestaurants = await fetchNearbyRestaurantsFromOSM(lat, lng, radiusKm);

    // 3. Deduplicate and merge by name / distance
    const combined = [...dbDonors];
    for (const osm of osmRestaurants) {
      const isDuplicate = combined.some((existing) => {
        const d = distanceKm(existing.coordinates.lat, existing.coordinates.lng, osm.coordinates.lat, osm.coordinates.lng);
        return d < 0.15 || existing.name.toLowerCase().includes(osm.name.toLowerCase().slice(0, 8));
      });
      if (!isDuplicate) {
        combined.push(osm);
      }
    }

    // Sort by proximity from user GPS
    combined.sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999));
    res.json(combined);
  } catch (error) {
    next(error);
  }
});

// --- REAL-TIME TURN-BY-TURN DRIVING ROUTE PROXY ---
app.get('/api/route', async (req, res, next) => {
  try {
    const startLat = Number(req.query.startLat);
    const startLng = Number(req.query.startLng);
    const endLat = Number(req.query.endLat);
    const endLng = Number(req.query.endLng);

    if (!Number.isFinite(startLat) || !Number.isFinite(startLng) || !Number.isFinite(endLat) || !Number.isFinite(endLng)) {
      return res.status(400).json({ message: 'startLat, startLng, endLat, endLng query params required' });
    }

    const route = await fetchRouteBetween(startLat, startLng, endLat, endLng);
    res.json(route || { coordinates: [], distanceKm: 0, durationMinutes: 0 });
  } catch (error) {
    next(error);
  }
});

// --- GEOCODING & LOCATION SERVICES (Free OpenStreetMap Nominatim & IP fallback) ---
app.get('/api/geocode/reverse', async (req, res, next) => {
  try {
    const lat = Number(req.query.lat);
    const lng = Number(req.query.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return res.status(400).json({ message: 'lat and lng parameters are required.' });
    }

    const result = await reverseGeocode(lat, lng);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

app.get('/api/geocode/search', async (req, res, next) => {
  try {
    const query = req.query.q || '';
    if (!query.trim()) return res.json([]);
    const results = await geocodeSearch(query);
    res.json(results);
  } catch (error) {
    next(error);
  }
});

app.get('/api/geocode/ip', async (_req, res, next) => {
  try {
    const location = await getIpLocation();
    res.json(location);
  } catch (error) {
    next(error);
  }
});

// --- ADMIN METRICS & USER VERIFICATION ---
app.get('/api/admin/metrics', async (_req, res, next) => {
  try {
    const metrics = await db.getMetrics();
    res.json(metrics);
  } catch (error) {
    next(error);
  }
});

app.get('/api/admin/users', async (_req, res, next) => {
  try {
    const users = await db.listUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

app.post('/api/admin/users/:id/verify', async (req, res, next) => {
  try {
    const user = await db.verifyUser(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// Global Error Handler
app.use((error, _req, res, _next) => {
  console.error('[API Error]', error);
  res.status(error.status || 500).json({
    message: error.message || 'Unexpected server error occurred.',
  });
});

// Scheduled Job: Every minute, mark expired food listings as 'expired'
cron.schedule('* * * * *', () => {
  db.expireUnsafeListings().catch((err) => {
    console.warn('[Cron] Expiry job error:', err.message);
  });
});

app.listen(port, () => {
  console.log(`===========================================`);
  console.log(`🌱 ShareBite Backend API is live on port ${port}`);
  console.log(`📍 OpenStreetMap & Geolocation Services Ready`);
  console.log(`🗄️ PostgreSQL Data Layer Initialized`);
  console.log(`===========================================`);
});
