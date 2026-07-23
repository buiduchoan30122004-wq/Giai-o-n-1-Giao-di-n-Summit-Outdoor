const { createClient } = require('@libsql/client');
const path = require('path');

const dbPath = path.join(__dirname, 'brain.db');
const client = createClient({
  url: 'file:' + dbPath,
});

async function run() {
  try {
    console.log('Running database migrations...');
    await client.execute("ALTER TABLE orders ADD COLUMN payment_method TEXT;");
    console.log('Added payment_method column.');
  } catch (e) { console.log('payment_method column:', e.message); }
}
run();
