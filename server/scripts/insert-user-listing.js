require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function insertUserListing() {
  const query = `
    INSERT INTO listings (
      id, donor_id, donor_name, donor_phone, food_type, food_category,
      quantity, quantity_unit, prepared_at, expires_at, status, address, lat, lng, created_at
    ) VALUES (
      'listing-varun-kitchen-1',
      'user-donor-1',
      'varun''s kitchen',
      '+91 98450 12345',
      'veg pulao, curd, salad',
      'veg',
      30,
      'servings',
      NOW() - INTERVAL '30 minutes',
      NOW() + INTERVAL '3.5 hours',
      'pending',
      'Dadri Road, Dadri, Uttar Pradesh, 203207',
      28.5387,
      77.5372,
      NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      donor_name = EXCLUDED.donor_name,
      food_type = EXCLUDED.food_type,
      address = EXCLUDED.address,
      lat = EXCLUDED.lat,
      lng = EXCLUDED.lng,
      status = 'pending'
    RETURNING *;
  `;

  try {
    const res = await pool.query(query);
    console.log('✅ Successfully inserted user listing into Neon PostgreSQL:');
    console.log(res.rows[0]);
  } catch (err) {
    console.error('❌ Insert failed:', err.message);
  } finally {
    await pool.end();
  }
}

insertUserListing();
