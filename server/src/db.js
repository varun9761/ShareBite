const { Pool } = require('pg');
const crypto = require('node:crypto');

let pool = null;
let usePostgres = false;

// In-memory fallback dataset for seamless offline / zero-config development
const now = Date.now();
const fallbackStore = {
  users: [
    {
      id: 'user-donor-1',
      name: 'Green Bowl Kitchen',
      email: 'donor@sharebite.test',
      password_hash: '$2b$10$epRkZgqEw9dJ53g4qg0C7.d0VbA2zEa4hV9Z6dO3bV3u3B4v6mCke', // pass: donor123
      role: 'donor',
      verified: true,
      address: 'Koramangala 5th Block, Bengaluru',
      lat: 12.9352,
      lng: 77.6245,
      phone: '+91 98450 12345',
      created_at: new Date(now - 86400000).toISOString(),
    },
    {
      id: 'user-donor-2',
      name: 'Sunrise Caterers',
      email: 'sunrise@sharebite.test',
      password_hash: '$2b$10$epRkZgqEw9dJ53g4qg0C7.d0VbA2zEa4hV9Z6dO3bV3u3B4v6mCke',
      role: 'donor',
      verified: true,
      address: 'Indiranagar 100 Feet Road, Bengaluru',
      lat: 12.9719,
      lng: 77.6412,
      phone: '+91 98450 67890',
      created_at: new Date(now - 86400000).toISOString(),
    },
    {
      id: 'user-ngo-1',
      name: 'Hope Meals Network',
      email: 'ngo@sharebite.test',
      password_hash: '$2b$10$epRkZgqEw9dJ53g4qg0C7.d0VbA2zEa4hV9Z6dO3bV3u3B4v6mCke',
      role: 'claimer',
      verified: true,
      address: 'Domlur, Bengaluru',
      lat: 12.9611,
      lng: 77.6387,
      phone: '+91 80252 09876',
      created_at: new Date(now - 86400000).toISOString(),
    },
    {
      id: 'user-admin-1',
      name: 'ShareBite Admin',
      email: 'admin@sharebite.test',
      password_hash: '$2b$10$epRkZgqEw9dJ53g4qg0C7.d0VbA2zEa4hV9Z6dO3bV3u3B4v6mCke',
      role: 'admin',
      verified: true,
      address: 'Bengaluru Central',
      lat: 12.9716,
      lng: 77.5946,
      phone: '+91 80000 00001',
      created_at: new Date(now - 86400000).toISOString(),
    }
  ],
  listings: [
    {
      id: 'listing-1',
      donor_id: 'user-donor-1',
      donor_name: 'Green Bowl Kitchen',
      donor_phone: '+91 98450 12345',
      food_type: 'Vegetarian meals (Rice, Dal, Paneer Gravy)',
      food_category: 'veg',
      quantity: 45,
      quantity_unit: 'servings',
      prepared_at: new Date(now - 45 * 60 * 1000).toISOString(),
      expires_at: new Date(now + 2.5 * 60 * 60 * 1000).toISOString(),
      status: 'pending',
      address: 'Koramangala 5th Block, Bengaluru',
      lat: 12.9352,
      lng: 77.6245,
      claimed_by: null,
      claimed_by_id: null,
      otp: null,
      claimed_at: null,
      picked_up_at: null,
      expired_at: null,
      created_at: new Date(now - 35 * 60 * 1000).toISOString(),
    },
    {
      id: 'listing-2',
      donor_id: 'user-donor-1',
      donor_name: 'Green Bowl Kitchen',
      donor_phone: '+91 98450 12345',
      food_type: 'Assorted Artisan Bakery & Croissants',
      food_category: 'veg',
      quantity: 18,
      quantity_unit: 'kg',
      prepared_at: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
      expires_at: new Date(now + 50 * 60 * 1000).toISOString(),
      status: 'claimed',
      address: 'Koramangala 5th Block, Bengaluru',
      lat: 12.9352,
      lng: 77.6245,
      claimed_by: 'Hope Meals Network',
      claimed_by_id: 'user-ngo-1',
      otp: '582914',
      claimed_at: new Date(now - 20 * 60 * 1000).toISOString(),
      picked_up_at: null,
      expired_at: null,
      created_at: new Date(now - 90 * 60 * 1000).toISOString(),
    },
    {
      id: 'listing-3',
      donor_id: 'user-donor-2',
      donor_name: 'Sunrise Caterers & Banquet',
      donor_phone: '+91 98450 67890',
      food_type: 'Chicken Biryani & Raita (Buffet Surplus)',
      food_category: 'non-veg',
      quantity: 32,
      quantity_unit: 'servings',
      prepared_at: new Date(now - 25 * 60 * 1000).toISOString(),
      expires_at: new Date(now + 3.8 * 60 * 60 * 1000).toISOString(),
      status: 'pending',
      address: 'Indiranagar 100 Feet Road, Bengaluru',
      lat: 12.9719,
      lng: 77.6412,
      claimed_by: null,
      claimed_by_id: null,
      otp: null,
      claimed_at: null,
      picked_up_at: null,
      expired_at: null,
      created_at: new Date(now - 20 * 60 * 1000).toISOString(),
    },
    {
      id: 'listing-4',
      donor_id: 'user-donor-1',
      donor_name: 'The French Loaf Bakery',
      donor_phone: '+91 80412 34567',
      food_type: 'Fresh Sourdough Bread & Muffins',
      food_category: 'veg',
      quantity: 24,
      quantity_unit: 'boxes',
      prepared_at: new Date(now - 80 * 60 * 1000).toISOString(),
      expires_at: new Date(now + 1.2 * 60 * 60 * 1000).toISOString(),
      status: 'pending',
      address: 'Domlur Intermediate Ring Rd, Bengaluru',
      lat: 12.9634,
      lng: 77.6401,
      claimed_by: null,
      claimed_by_id: null,
      otp: null,
      claimed_at: null,
      picked_up_at: null,
      expired_at: null,
      created_at: new Date(now - 60 * 60 * 1000).toISOString(),
    },
  ],
  ngos: [
    {
      id: 'ngo-1',
      name: 'Robin Hood Army - Bengaluru Chapter',
      cause: 'Surplus Food Redistribution & Community Kitchens',
      address: 'Indiranagar / Domlur, Bengaluru',
      lat: 12.9716,
      lng: 77.6413,
      contact_phone: '+91 80252 11223',
      contact_email: 'robinhood.blr@gmail.com',
      verified: true,
      capacity: 850,
      operating_hours: '07:00 - 23:00',
      website: 'https://robinhoodarmy.com',
      created_at: new Date(now - 864000000).toISOString(),
    },
    {
      id: 'ngo-2',
      name: 'Akshaya Patra Food Aid Hub',
      cause: 'Zero-Hunger Child & Shelter Feeding',
      address: 'Rajajinagar / West Bengaluru',
      lat: 13.0035,
      lng: 77.5518,
      contact_phone: '+91 80234 56789',
      contact_email: 'blr.feed@akshayapatra.org',
      verified: true,
      capacity: 2500,
      operating_hours: '06:00 - 21:00',
      website: 'https://www.akshayapatra.org',
      created_at: new Date(now - 864000000).toISOString(),
    },
    {
      id: 'ngo-3',
      name: 'Hope Meals Network & Shelter',
      cause: 'Slum Children and Daily Wager Food Relief',
      address: 'Domlur Layout, Bengaluru',
      lat: 12.9611,
      lng: 77.6387,
      contact_phone: '+91 80252 09876',
      contact_email: 'contact@hopemeals.org',
      verified: true,
      capacity: 600,
      operating_hours: '24 Hours Open',
      website: 'https://hopemeals.org',
      created_at: new Date(now - 864000000).toISOString(),
    },
    {
      id: 'ngo-4',
      name: 'Feed India Food Rescue Trust',
      cause: 'Nighttime Restaurant Surplus Collection',
      address: 'Koramangala 4th Block, Bengaluru',
      lat: 12.9341,
      lng: 77.6322,
      contact_phone: '+91 99887 76655',
      contact_email: 'rescue@feedindia.org',
      verified: true,
      capacity: 1200,
      operating_hours: '10:00 - 02:00',
      website: 'https://feedindia.org',
      created_at: new Date(now - 864000000).toISOString(),
    },
    {
      id: 'ngo-5',
      name: 'Delhi Food Banking Network',
      cause: 'Direct Relief for Homeless & Migrants',
      address: 'Connaught Place, New Delhi',
      lat: 28.6328,
      lng: 77.2197,
      contact_phone: '+91 11234 11223',
      contact_email: 'delhi@foodbanking.org',
      verified: true,
      capacity: 1800,
      operating_hours: '08:00 - 22:00',
      website: 'https://indiafoodbanking.org',
      created_at: new Date(now - 864000000).toISOString(),
    },
    {
      id: 'ngo-6',
      name: 'Roti Bank Mumbai Foundation',
      cause: 'Free Food Van & Emergency Nutrition',
      address: 'Bandra West, Mumbai',
      lat: 19.0596,
      lng: 72.8295,
      contact_phone: '+91 22264 54321',
      contact_email: 'rotibankmumbai@gmail.com',
      verified: true,
      capacity: 2200,
      operating_hours: '08:00 - 23:00',
      website: 'https://rotibankmumbai.org',
      created_at: new Date(now - 864000000).toISOString(),
    }
  ],
  donors: [
    {
      id: 'donor-place-1',
      user_id: 'user-donor-1',
      name: 'Green Bowl Kitchen',
      type: 'Organic Healthy Bowls & Salads',
      address: 'Koramangala 5th Block, Bengaluru',
      lat: 12.9352,
      lng: 77.6245,
      phone: '+91 98450 12345',
      email: 'donor@sharebite.test',
      verified: true,
      total_donations: 142,
      rating: '4.9 ★',
      created_at: new Date(now - 864000000).toISOString(),
    },
    {
      id: 'donor-place-2',
      user_id: 'user-donor-2',
      name: 'Sunrise Caterers & Banquet',
      type: 'Event Catering & Banquet Hall',
      address: 'Indiranagar 100 Feet Road, Bengaluru',
      lat: 12.9719,
      lng: 77.6412,
      phone: '+91 98450 67890',
      email: 'sunrise@sharebite.test',
      verified: true,
      total_donations: 89,
      rating: '4.8 ★',
      created_at: new Date(now - 864000000).toISOString(),
    },
    {
      id: 'donor-place-3',
      user_id: null,
      name: 'The French Loaf Bakery',
      type: 'Artisan Bakery & Confectionery',
      address: 'Domlur Intermediate Ring Rd, Bengaluru',
      lat: 12.9634,
      lng: 77.6401,
      phone: '+91 80412 34567',
      email: 'domlur@frenchloaf.test',
      verified: true,
      total_donations: 56,
      rating: '4.9 ★',
      created_at: new Date(now - 864000000).toISOString(),
    },
    {
      id: 'donor-place-4',
      user_id: null,
      name: 'Royal Spice Grand Buffet',
      type: 'Multi-Cuisine Buffet Restaurant',
      address: 'MG Road, Bengaluru',
      lat: 12.9754,
      lng: 77.6067,
      phone: '+91 80255 88990',
      email: 'manager@royalspice.test',
      verified: true,
      total_donations: 110,
      rating: '4.7 ★',
      created_at: new Date(now - 864000000).toISOString(),
    }
  ]
};

async function initDatabase() {
  const connectionString = process.env.DATABASE_URL || (
    process.env.PGHOST && process.env.PGUSER
      ? `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD || ''}@${process.env.PGHOST}:${process.env.PGPORT || 5432}/${process.env.PGDATABASE || 'sharebite'}`
      : null
  );

  if (connectionString) {
    try {
      pool = new Pool({
        connectionString,
        ssl: process.env.DATABASE_SSL === 'true' || connectionString.includes('sslmode=require')
          ? { rejectUnauthorized: false }
          : false,
        connectionTimeoutMillis: 5000,
      });

      const res = await pool.query('SELECT NOW() as current_time;');
      usePostgres = true;
      console.log(`[Database] Connected to PostgreSQL successfully at ${res.rows[0].current_time}`);
      await runMigrations();
    } catch (err) {
      console.warn(`[Database] PostgreSQL connection failed: ${err.message}`);
      console.warn('[Database] Running with high-fidelity in-memory database store.');
      usePostgres = false;
    }
  } else {
    console.log('[Database] No DATABASE_URL provided. Running with high-fidelity in-memory store.');
    usePostgres = false;
  }
}

async function runMigrations() {
  if (!usePostgres || !pool) return;

  const createTablesSQL = `
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(64) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role VARCHAR(32) NOT NULL,
      verified BOOLEAN DEFAULT false,
      address TEXT,
      lat DOUBLE PRECISION,
      lng DOUBLE PRECISION,
      phone VARCHAR(32),
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS listings (
      id VARCHAR(64) PRIMARY KEY,
      donor_id VARCHAR(64) NOT NULL,
      donor_name VARCHAR(255) NOT NULL,
      donor_phone VARCHAR(64),
      food_type VARCHAR(255) NOT NULL,
      food_category VARCHAR(32) DEFAULT 'veg',
      quantity NUMERIC NOT NULL,
      quantity_unit VARCHAR(32) DEFAULT 'servings',
      prepared_at TIMESTAMPTZ NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL,
      status VARCHAR(32) DEFAULT 'pending',
      address TEXT NOT NULL,
      lat DOUBLE PRECISION NOT NULL,
      lng DOUBLE PRECISION NOT NULL,
      claimed_by VARCHAR(255),
      claimed_by_id VARCHAR(64),
      otp VARCHAR(16),
      claimed_at TIMESTAMPTZ,
      picked_up_at TIMESTAMPTZ,
      expired_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS ngos (
      id VARCHAR(64) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      cause VARCHAR(255),
      address TEXT NOT NULL,
      lat DOUBLE PRECISION NOT NULL,
      lng DOUBLE PRECISION NOT NULL,
      contact_phone VARCHAR(64),
      contact_email VARCHAR(255),
      verified BOOLEAN DEFAULT true,
      capacity NUMERIC DEFAULT 500,
      operating_hours VARCHAR(128) DEFAULT '08:00 - 22:00',
      website TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS donors (
      id VARCHAR(64) PRIMARY KEY,
      user_id VARCHAR(64),
      name VARCHAR(255) NOT NULL,
      type VARCHAR(64) DEFAULT 'Restaurant',
      address TEXT NOT NULL,
      lat DOUBLE PRECISION NOT NULL,
      lng DOUBLE PRECISION NOT NULL,
      phone VARCHAR(64),
      email VARCHAR(255),
      verified BOOLEAN DEFAULT true,
      total_donations NUMERIC DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  try {
    await pool.query(createTablesSQL);
    console.log('[Database] PostgreSQL schemas verified / migrated successfully.');
    await seedPostgresData();
  } catch (err) {
    console.error(`[Database] Migration failed: ${err.message}`);
  }
}

async function seedPostgresData() {
  if (!usePostgres || !pool) return;

  const countRes = await pool.query('SELECT COUNT(*) FROM users;');
  if (parseInt(countRes.rows[0].count, 10) === 0) {
    console.log('[Database] Seeding initial data into PostgreSQL...');

    for (const u of fallbackStore.users) {
      await pool.query(
        `INSERT INTO users (id, name, email, password_hash, role, verified, address, lat, lng, phone, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         ON CONFLICT (id) DO NOTHING;`,
        [u.id, u.name, u.email, u.password_hash, u.role, u.verified, u.address, u.lat, u.lng, u.phone, u.created_at]
      );
    }

    for (const l of fallbackStore.listings) {
      await pool.query(
        `INSERT INTO listings (id, donor_id, donor_name, donor_phone, food_type, food_category, quantity, quantity_unit, prepared_at, expires_at, status, address, lat, lng, claimed_by, claimed_by_id, otp, claimed_at, picked_up_at, expired_at, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
         ON CONFLICT (id) DO NOTHING;`,
        [l.id, l.donor_id, l.donor_name, l.donor_phone, l.food_type, l.food_category, l.quantity, l.quantity_unit, l.prepared_at, l.expires_at, l.status, l.address, l.lat, l.lng, l.claimed_by, l.claimed_by_id, l.otp, l.claimed_at, l.picked_up_at, l.expired_at, l.created_at]
      );
    }

    for (const ngo of fallbackStore.ngos) {
      await pool.query(
        `INSERT INTO ngos (id, name, cause, address, lat, lng, contact_phone, contact_email, verified, capacity, operating_hours, website, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
         ON CONFLICT (id) DO NOTHING;`,
        [ngo.id, ngo.name, ngo.cause, ngo.address, ngo.lat, ngo.lng, ngo.contact_phone, ngo.contact_email, ngo.verified, ngo.capacity, ngo.operating_hours, ngo.website, ngo.created_at]
      );
    }

    for (const d of fallbackStore.donors) {
      await pool.query(
        `INSERT INTO donors (id, user_id, name, type, address, lat, lng, phone, email, verified, total_donations, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         ON CONFLICT (id) DO NOTHING;`,
        [d.id, d.user_id, d.name, d.type, d.address, d.lat, d.lng, d.phone, d.email, d.verified, d.total_donations, d.created_at]
      );
    }

    console.log('[Database] Initial PostgreSQL seed completed successfully.');
  }
}

// Distance Calculation (Haversine formula in Kilometers)
function distanceKm(lat1, lon1, lat2, lon2) {
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

// Helper to format listing DB rows into rich camelCase listing objects
function formatListing(row, userLat, userLng) {
  const expiresAtMs = new Date(row.expires_at).getTime();
  const nowMs = Date.now();
  const msRemaining = Math.max(0, expiresAtMs - nowMs);
  const hoursRemaining = msRemaining / (1000 * 60 * 60);

  let urgency = 'normal';
  if (hoursRemaining < 1) urgency = 'critical';
  else if (hoursRemaining < 2.5) urgency = 'urgent';

  const listing = {
    id: row.id,
    donorId: row.donor_id,
    donorName: row.donor_name,
    donorPhone: row.donor_phone || '',
    foodType: row.food_type,
    foodCategory: row.food_category || 'veg',
    quantity: Number(row.quantity),
    quantityUnit: row.quantity_unit || 'servings',
    preparedAt: new Date(row.prepared_at).toISOString(),
    expiresAt: new Date(row.expires_at).toISOString(),
    status: row.status,
    address: row.address,
    coordinates: {
      lat: Number(row.lat),
      lng: Number(row.lng),
    },
    claimedBy: row.claimed_by,
    claimedById: row.claimed_by_id,
    otp: row.otp,
    claimedAt: row.claimed_at ? new Date(row.claimed_at).toISOString() : null,
    pickedUpAt: row.picked_up_at ? new Date(row.picked_up_at).toISOString() : null,
    expiredAt: row.expired_at ? new Date(row.expired_at).toISOString() : null,
    createdAt: new Date(row.created_at).toISOString(),
    urgency,
    co2AvoidedKg: Number((Number(row.quantity) * (row.quantity_unit === 'kg' ? 2.5 : 0.8)).toFixed(1)),
  };

  if (Number.isFinite(userLat) && Number.isFinite(userLng)) {
    listing.distanceKm = distanceKm(userLat, userLng, listing.coordinates.lat, listing.coordinates.lng);
    listing.estimatedTransitMins = Math.max(3, Math.round(listing.distanceKm * 2.5));
  } else {
    listing.distanceKm = 0;
    listing.estimatedTransitMins = 5;
  }

  return listing;
}

// Helper to format user DB rows
function formatUser(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    verified: Boolean(row.verified),
    address: row.address,
    coordinates: Number.isFinite(Number(row.lat)) && Number.isFinite(Number(row.lng))
      ? { lat: Number(row.lat), lng: Number(row.lng) }
      : null,
    phone: row.phone || '',
    createdAt: row.created_at,
  };
}

// Repository / Model APIs
const db = {
  isPostgres() {
    return usePostgres;
  },

  async getHealth() {
    return {
      database: usePostgres ? 'postgresql' : 'in-memory-fallback',
      status: 'healthy',
      connected: true,
      timestamp: new Date().toISOString(),
    };
  },

  // USERS
  async findUserByEmail(email) {
    if (usePostgres) {
      const res = await pool.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1);', [email]);
      return res.rows[0] || null;
    }
    return fallbackStore.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async findUserById(id) {
    if (usePostgres) {
      const res = await pool.query('SELECT * FROM users WHERE id = $1;', [id]);
      return res.rows[0] ? formatUser(res.rows[0]) : null;
    }
    const user = fallbackStore.users.find((u) => u.id === id);
    return user ? formatUser(user) : null;
  },

  async createUser(userData) {
    const id = userData.id || `user-${crypto.randomUUID().slice(0, 8)}`;
    const lat = userData.coordinates?.lat || userData.lat || null;
    const lng = userData.coordinates?.lng || userData.lng || null;

    if (usePostgres) {
      const res = await pool.query(
        `INSERT INTO users (id, name, email, password_hash, role, verified, address, lat, lng, phone)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING *;`,
        [id, userData.name, userData.email, userData.passwordHash, userData.role, false, userData.address, lat, lng, userData.phone || '']
      );
      return formatUser(res.rows[0]);
    }

    const newUser = {
      id,
      name: userData.name,
      email: userData.email,
      password_hash: userData.passwordHash,
      role: userData.role,
      verified: false,
      address: userData.address,
      lat,
      lng,
      phone: userData.phone || '',
      created_at: new Date().toISOString(),
    };
    fallbackStore.users.push(newUser);
    return formatUser(newUser);
  },

  async listUsers() {
    if (usePostgres) {
      const res = await pool.query('SELECT * FROM users ORDER BY created_at DESC;');
      return res.rows.map(formatUser);
    }
    return fallbackStore.users.map(formatUser);
  },

  async verifyUser(id) {
    if (usePostgres) {
      const res = await pool.query('UPDATE users SET verified = true WHERE id = $1 RETURNING *;', [id]);
      return res.rows[0] ? formatUser(res.rows[0]) : null;
    }
    const user = fallbackStore.users.find((u) => u.id === id);
    if (user) user.verified = true;
    return user ? formatUser(user) : null;
  },

  // LISTINGS
  async listActiveListings({ lat, lng, radiusKm = 15, category, search, sortBy = 'expiry' } = {}) {
    await this.expireUnsafeListings();

    let listings = [];
    if (usePostgres) {
      let queryText = `SELECT * FROM listings WHERE status IN ('pending', 'claimed')`;
      const params = [];
      if (category && category !== 'all') {
        params.push(category);
        queryText += ` AND food_category = $${params.length}`;
      }
      queryText += ` ORDER BY expires_at ASC;`;
      const res = await pool.query(queryText, params);
      listings = res.rows.map((row) => formatListing(row, lat, lng));
    } else {
      listings = fallbackStore.listings
        .filter((l) => ['pending', 'claimed'].includes(l.status))
        .filter((l) => (!category || category === 'all' || l.food_category === category))
        .map((row) => formatListing(row, lat, lng));
    }

    // Keyword Search filter
    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      listings = listings.filter((l) =>
        l.foodType.toLowerCase().includes(q) ||
        l.donorName.toLowerCase().includes(q) ||
        l.address.toLowerCase().includes(q)
      );
    }

    // Distance Radius filter: Show listings within radius, or nearest available if outside radius
    if (Number.isFinite(lat) && Number.isFinite(lng) && radiusKm) {
      const withinRadius = listings.filter((l) => l.distanceKm <= radiusKm);
      if (withinRadius.length > 0) {
        listings = withinRadius;
      }
      // If none strictly within radiusKm, keep all real listings so user postings are never hidden!
    }

    // Sorting
    if (sortBy === 'distance') {
      listings.sort((a, b) => a.distanceKm - b.distanceKm);
    } else if (sortBy === 'quantity') {
      listings.sort((a, b) => b.quantity - a.quantity);
    } else {
      // Default: earliest expiration first
      listings.sort((a, b) => new Date(a.expiresAt) - new Date(b.expiresAt));
    }

    return listings;
  },

  async listDonorListings(donorId) {
    await this.expireUnsafeListings();
    if (usePostgres) {
      const res = await pool.query(
        donorId
          ? 'SELECT * FROM listings WHERE donor_id = $1 ORDER BY created_at DESC;'
          : 'SELECT * FROM listings ORDER BY created_at DESC;',
        donorId ? [donorId] : []
      );
      return res.rows.map((row) => formatListing(row));
    }

    return fallbackStore.listings
      .filter((l) => !donorId || l.donor_id === donorId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .map((row) => formatListing(row));
  },

  async createListing(payload, donor = null) {
    const id = payload.id || `listing-${crypto.randomUUID().slice(0, 8)}`;
    const donorId = donor?.id || payload.donorId || 'user-donor-1';
    const donorName = donor?.name || payload.donorName || 'Green Bowl Kitchen';
    const donorPhone = donor?.phone || payload.donorPhone || '';

    const lat = Number(payload.lat) || (payload.coordinates ? Number(payload.coordinates.lat) : 12.9352);
    const lng = Number(payload.lng) || (payload.coordinates ? Number(payload.coordinates.lng) : 77.6245);
    const address = payload.address || 'Koramangala, Bengaluru';
    const foodType = payload.foodType;
    const foodCategory = payload.foodCategory || 'veg';
    const quantity = Number(payload.quantity) || 10;
    const quantityUnit = payload.quantityUnit || 'servings';
    const preparedAt = new Date(payload.preparedAt || Date.now()).toISOString();
    const expiresAt = new Date(payload.expiresAt || (Date.now() + 4 * 3600000)).toISOString();
    const createdAt = new Date().toISOString();

    if (usePostgres) {
      const res = await pool.query(
        `INSERT INTO listings (id, donor_id, donor_name, donor_phone, food_type, food_category, quantity, quantity_unit, prepared_at, expires_at, status, address, lat, lng, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'pending', $11, $12, $13, $14)
         ON CONFLICT (id) DO UPDATE SET quantity = EXCLUDED.quantity
         RETURNING *;`,
        [id, donorId, donorName, donorPhone, foodType, foodCategory, quantity, quantityUnit, preparedAt, expiresAt, address, lat, lng, createdAt]
      );
      return formatListing(res.rows[0]);
    }

    const newListing = {
      id,
      donor_id: donorId,
      donor_name: donorName,
      donor_phone: donorPhone,
      food_type: foodType,
      food_category: foodCategory,
      quantity,
      quantity_unit: quantityUnit,
      prepared_at: preparedAt,
      expires_at: expiresAt,
      status: 'pending',
      address,
      lat,
      lng,
      claimed_by: null,
      claimed_by_id: null,
      otp: null,
      claimed_at: null,
      picked_up_at: null,
      expired_at: null,
      created_at: createdAt,
    };
    fallbackStore.listings.unshift(newListing);
    return formatListing(newListing);
  },

  async claimListing(id, claimer = null) {
    const claimerName = claimer?.name || 'Hope Meals Network';
    const claimerId = claimer?.id || 'user-ngo-1';
    const otp = crypto.randomInt(100000, 999999).toString();
    const claimedAt = new Date().toISOString();

    if (usePostgres) {
      const existing = await pool.query('SELECT * FROM listings WHERE id = $1;', [id]);
      if (!existing.rows[0]) return null;
      if (existing.rows[0].status !== 'pending') {
        const error = new Error('Listing is no longer available.');
        error.status = 409;
        throw error;
      }

      const res = await pool.query(
        `UPDATE listings
         SET status = 'claimed', claimed_by = $1, claimed_by_id = $2, otp = $3, claimed_at = $4
         WHERE id = $5
         RETURNING *;`,
        [claimerName, claimerId, otp, claimedAt, id]
      );
      return formatListing(res.rows[0]);
    }

    const listing = fallbackStore.listings.find((l) => l.id === id);
    if (!listing) return null;
    if (listing.status !== 'pending') {
      const error = new Error('Listing is no longer available.');
      error.status = 409;
      throw error;
    }

    listing.status = 'claimed';
    listing.claimed_by = claimerName;
    listing.claimed_by_id = claimerId;
    listing.otp = otp;
    listing.claimed_at = claimedAt;
    return formatListing(listing);
  },

  async verifyPickup(id, otp) {
    const pickedUpAt = new Date().toISOString();

    if (usePostgres) {
      const existing = await pool.query('SELECT * FROM listings WHERE id = $1;', [id]);
      const row = existing.rows[0];
      if (!row) return null;
      if (row.status !== 'claimed' || row.otp !== String(otp).trim()) {
        const error = new Error('OTP does not match this claimed pickup.');
        error.status = 400;
        throw error;
      }

      const res = await pool.query(
        `UPDATE listings SET status = 'picked_up', picked_up_at = $1 WHERE id = $2 RETURNING *;`,
        [pickedUpAt, id]
      );
      return formatListing(res.rows[0]);
    }

    const listing = fallbackStore.listings.find((l) => l.id === id);
    if (!listing) return null;
    if (listing.status !== 'claimed' || listing.otp !== String(otp).trim()) {
      const error = new Error('OTP does not match this claimed pickup.');
      error.status = 400;
      throw error;
    }

    listing.status = 'picked_up';
    listing.picked_up_at = pickedUpAt;
    return formatListing(listing);
  },

  async expireUnsafeListings(referenceDate = new Date()) {
    const refIso = referenceDate.toISOString();

    if (usePostgres) {
      await pool.query(
        `UPDATE listings
         SET status = 'expired', expired_at = $1
         WHERE status IN ('pending', 'claimed') AND expires_at <= $2;`,
        [refIso, refIso]
      );
      return;
    }

    fallbackStore.listings.forEach((l) => {
      if (['pending', 'claimed'].includes(l.status) && new Date(l.expires_at) <= referenceDate) {
        l.status = 'expired';
        l.expired_at = refIso;
      }
    });
  },

  // NGOS & CHARITIES
  async listNGOs({ lat, lng, radiusKm = 25 } = {}) {
    let list = [];
    if (usePostgres) {
      const res = await pool.query('SELECT * FROM ngos ORDER BY verified DESC, name ASC;');
      list = res.rows.map((row) => ({
        id: row.id,
        name: row.name,
        cause: row.cause,
        address: row.address,
        coordinates: { lat: Number(row.lat), lng: Number(row.lng) },
        contactPhone: row.contact_phone,
        contactEmail: row.contact_email,
        verified: Boolean(row.verified),
        capacity: Number(row.capacity),
        operatingHours: row.operating_hours,
        website: row.website,
        statusTag: '🟢 Accepting Food Now',
      }));
    } else {
      list = fallbackStore.ngos.map((row) => ({
        id: row.id,
        name: row.name,
        cause: row.cause,
        address: row.address,
        coordinates: { lat: Number(row.lat), lng: Number(row.lng) },
        contactPhone: row.contact_phone,
        contactEmail: row.contact_email,
        verified: Boolean(row.verified),
        capacity: Number(row.capacity),
        operatingHours: row.operating_hours,
        website: row.website,
        statusTag: '🟢 Accepting Food Now',
      }));
    }

    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      list = list.map((ngo) => ({
        ...ngo,
        distanceKm: distanceKm(lat, lng, ngo.coordinates.lat, ngo.coordinates.lng),
        estimatedTransitMins: Math.max(3, Math.round(distanceKm(lat, lng, ngo.coordinates.lat, ngo.coordinates.lng) * 2.5)),
      }));
      if (radiusKm) {
        list = list.filter((ngo) => ngo.distanceKm <= radiusKm);
      }
      list.sort((a, b) => a.distanceKm - b.distanceKm);
    }

    return list;
  },

  async registerNGO(data) {
    const id = `ngo-${crypto.randomUUID().slice(0, 8)}`;
    const lat = Number(data.lat) || (data.coordinates ? Number(data.coordinates.lat) : 12.9716);
    const lng = Number(data.lng) || (data.coordinates ? Number(data.coordinates.lng) : 77.6413);

    if (usePostgres) {
      const res = await pool.query(
        `INSERT INTO ngos (id, name, cause, address, lat, lng, contact_phone, contact_email, verified, capacity, operating_hours, website)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true, $9, $10, $11)
         RETURNING *;`,
        [id, data.name, data.cause, data.address, lat, lng, data.contactPhone, data.contactEmail, Number(data.capacity) || 500, data.operatingHours || '08:00 - 22:00', data.website || '']
      );
      return res.rows[0];
    }

    const newNgo = {
      id,
      name: data.name,
      cause: data.cause,
      address: data.address,
      lat,
      lng,
      contact_phone: data.contactPhone,
      contact_email: data.contactEmail,
      verified: true,
      capacity: Number(data.capacity) || 500,
      operating_hours: data.operatingHours || '08:00 - 22:00',
      website: data.website || '',
      created_at: new Date().toISOString(),
    };
    fallbackStore.ngos.push(newNgo);
    return newNgo;
  },

  // DONATING RESTAURANTS / PLACES
  async listDonors({ lat, lng, radiusKm = 25 } = {}) {
    let list = [];
    if (usePostgres) {
      const res = await pool.query('SELECT * FROM donors ORDER BY verified DESC, total_donations DESC;');
      list = res.rows.map((row) => ({
        id: row.id,
        name: row.name,
        type: row.type,
        address: row.address,
        coordinates: { lat: Number(row.lat), lng: Number(row.lng) },
        phone: row.phone,
        email: row.email,
        verified: Boolean(row.verified),
        totalDonations: Number(row.total_donations),
        rating: '4.9 ★',
      }));
    } else {
      list = fallbackStore.donors.map((row) => ({
        id: row.id,
        name: row.name,
        type: row.type,
        address: row.address,
        coordinates: { lat: Number(row.lat), lng: Number(row.lng) },
        phone: row.phone,
        email: row.email,
        verified: Boolean(row.verified),
        totalDonations: Number(row.total_donations),
        rating: row.rating || '4.9 ★',
      }));
    }

    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      list = list.map((d) => ({
        ...d,
        distanceKm: distanceKm(lat, lng, d.coordinates.lat, d.coordinates.lng),
      }));
      if (radiusKm) {
        list = list.filter((d) => d.distanceKm <= radiusKm);
      }
      list.sort((a, b) => a.distanceKm - b.distanceKm);
    }

    return list;
  },

  // METRICS
  async getMetrics() {
    await this.expireUnsafeListings();

    if (usePostgres) {
      const rescuedRes = await pool.query(`SELECT quantity, quantity_unit FROM listings WHERE status = 'picked_up';`);
      const liveRes = await pool.query(`SELECT COUNT(*) FROM listings WHERE status IN ('pending', 'claimed');`);
      const verifiedRes = await pool.query(`SELECT COUNT(*) FROM users WHERE verified = true;`);
      const ngoCountRes = await pool.query(`SELECT COUNT(*) FROM ngos WHERE verified = true;`);

      const totalMeals = rescuedRes.rows.reduce((sum, r) => {
        const qty = Number(r.quantity);
        return sum + (r.quantity_unit === 'servings' ? qty : qty * 3);
      }, 1450);

      const kgRescued = rescuedRes.rows.reduce((sum, r) => {
        const qty = Number(r.quantity);
        return sum + (r.quantity_unit === 'kg' ? qty : Math.round(qty * 0.35));
      }, 438);

      const co2AvoidedKg = Math.round(kgRescued * 2.5 + totalMeals * 0.45);

      return {
        totalMealsSaved: totalMeals,
        kgRescued,
        co2AvoidedKg,
        activeListings: parseInt(liveRes.rows[0].count, 10),
        verifiedPartners: parseInt(verifiedRes.rows[0].count, 10),
        connectedNGOs: parseInt(ngoCountRes.rows[0].count, 10),
        databaseEngine: 'PostgreSQL',
      };
    }

    const rescued = fallbackStore.listings.filter((l) => l.status === 'picked_up');
    const live = fallbackStore.listings.filter((l) => ['pending', 'claimed'].includes(l.status));

    const totalMealsSaved = rescued.reduce((sum, l) => {
      return sum + (l.quantity_unit === 'servings' ? l.quantity : l.quantity * 3);
    }, 1450);

    const kgRescued = rescued.reduce((sum, l) => {
      return sum + (l.quantity_unit === 'kg' ? l.quantity : Math.round(l.quantity * 0.35));
    }, 438);

    const co2AvoidedKg = Math.round(kgRescued * 2.5 + totalMealsSaved * 0.45);

    return {
      totalMealsSaved,
      kgRescued,
      co2AvoidedKg,
      activeListings: live.length,
      verifiedPartners: fallbackStore.users.filter((u) => u.verified).length,
      connectedNGOs: fallbackStore.ngos.filter((n) => n.verified).length,
      databaseEngine: 'In-Memory State Engine',
    };
  }
};

module.exports = {
  initDatabase,
  db,
  distanceKm,
};
