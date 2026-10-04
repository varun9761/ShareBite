const { Client } = require('pg');

async function createDatabaseIfNotExists() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '1234',
    database: 'postgres',
  });

  try {
    await client.connect();
    const res = await client.query("SELECT 1 FROM pg_database WHERE datname='sharebite'");
    if (res.rows.length === 0) {
      await client.query('CREATE DATABASE sharebite');
      console.log('✅ PostgreSQL database "sharebite" created successfully!');
    } else {
      console.log('ℹ️ PostgreSQL database "sharebite" already exists.');
    }
  } catch (err) {
    console.error('❌ Database creation error:', err.message);
  } finally {
    await client.end();
  }
}

createDatabaseIfNotExists();
