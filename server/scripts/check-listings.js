require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  const res = await pool.query('SELECT id, donor_name, food_type, address, lat, lng, created_at FROM listings ORDER BY created_at DESC');
  console.log('Total listings in Neon DB:', res.rows.length);
  console.log(JSON.stringify(res.rows, null, 2));
  await pool.end();
}

run();
