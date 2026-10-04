require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function clean() {
  await pool.query("DELETE FROM listings WHERE id IN ('listing-1', 'listing-2', 'listing-3', 'listing-4')");
  const res = await pool.query('SELECT id, donor_name, food_type, address FROM listings');
  console.log('✅ Remaining active listings in Neon Cloud DB:');
  console.log(JSON.stringify(res.rows, null, 2));
  await pool.end();
}

clean();
