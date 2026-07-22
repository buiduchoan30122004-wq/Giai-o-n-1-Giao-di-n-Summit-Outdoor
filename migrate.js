const { createClient } = require('@libsql/client');
const path = require('path');

const dbPath = path.join(__dirname, 'brain.db');
const client = createClient({
  url: 'file:' + dbPath,
});

async function run() {
  try {
    console.log('Running database migrations...');
    await client.execute("ALTER TABLE orders ADD COLUMN address TEXT;");
    console.log('Added address column.');
  } catch (e) { console.log('address column:', e.message); }

  try {
    await client.execute("ALTER TABLE orders ADD COLUMN notes TEXT;");
    console.log('Added notes column.');
  } catch (e) { console.log('notes column:', e.message); }

  try {
    await client.execute("ALTER TABLE orders ADD COLUMN transaction_id TEXT;");
    console.log('Added transaction_id column.');
  } catch (e) { console.log('transaction_id column:', e.message); }

  try {
    await client.execute("ALTER TABLE orders ADD COLUMN payment_amount REAL;");
    console.log('Added payment_amount column.');
  } catch (e) { console.log('payment_amount column:', e.message); }

  try {
    await client.execute("ALTER TABLE orders ADD COLUMN payment_date TEXT;");
    console.log('Added payment_date column.');
  } catch (e) { console.log('payment_date column:', e.message); }
}
run();
