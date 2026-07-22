const { createClient } = require('@libsql/client');
const path = require('path');

const dbPath = path.join(__dirname, 'brain.db');
const client = createClient({
  url: 'file:' + dbPath,
});

async function run() {
  try {
    console.log('Running database migration on VPS...');
    const res = await client.execute("ALTER TABLE orders ADD COLUMN order_code TEXT;");
    console.log('Migration successful:', res);
  } catch (error) {
    console.log('Migration status/result:', error.message);
  }
}
run();
