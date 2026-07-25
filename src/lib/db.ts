import path from 'path';
import fs from 'fs';

const isVps = fs.existsSync('/var/www/summit-outdoor');
let dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), 'brain.db');

if (isVps && !process.env.DATABASE_PATH) {
  const newPath = '/var/www/brain.db';
  const oldPath = '/var/www/summit-outdoor/brain.db';
  try {
    if (fs.existsSync(oldPath) && !fs.existsSync(newPath)) {
      fs.copyFileSync(oldPath, newPath);
      console.log('Database self-migrated to parent directory successfully.');
    }
  } catch (err) {
    console.error('Error during database migration:', err);
  }
  dbPath = newPath;
}

// Automatic backup helper
function autoBackup() {
  try {
    if (fs.existsSync(dbPath)) {
      const backupPath = dbPath + '.bak';
      fs.copyFileSync(dbPath, backupPath);
      console.log(`Database auto-backup created successfully at: ${backupPath}`);
    }
  } catch (err) {
    console.error('Database auto-backup failed:', err);
  }
}

let clientInstance: any = null;

async function runMigrations(client: any) {
  const columns = [
    "ALTER TABLE orders ADD COLUMN order_code TEXT;",
    "ALTER TABLE orders ADD COLUMN address TEXT;",
    "ALTER TABLE orders ADD COLUMN notes TEXT;",
    "ALTER TABLE orders ADD COLUMN transaction_id TEXT;",
    "ALTER TABLE orders ADD COLUMN payment_amount REAL;",
    "ALTER TABLE orders ADD COLUMN payment_date TEXT;",
    "ALTER TABLE orders ADD COLUMN payment_method TEXT;",
    "ALTER TABLE customers ADD COLUMN updated_at TEXT;",
    "ALTER TABLE orders ADD COLUMN updated_at TEXT;",
    "ALTER TABLE products ADD COLUMN updated_at TEXT;",
    "ALTER TABLE products ADD COLUMN category TEXT;",
    "ALTER TABLE products ADD COLUMN status TEXT;",
    "ALTER TABLE products ADD COLUMN subtitle TEXT;",
    "ALTER TABLE products ADD COLUMN thumbnails TEXT;",
    "ALTER TABLE products ADD COLUMN available_colors TEXT;",
    "ALTER TABLE products ADD COLUMN available_sizes TEXT;",
    "ALTER TABLE products ADD COLUMN specs TEXT;",
    "ALTER TABLE products ADD COLUMN features TEXT;",
    "ALTER TABLE products ADD COLUMN original_price REAL;",
    "ALTER TABLE products ADD COLUMN discount TEXT;",
    "CREATE TABLE IF NOT EXISTS homepage_configs (id INTEGER PRIMARY KEY AUTOINCREMENT, layout_key TEXT UNIQUE, layout_name TEXT, is_active INTEGER DEFAULT 1, display_order INTEGER DEFAULT 0, content_value TEXT, created_at TEXT, updated_at TEXT);",
    "INSERT OR IGNORE INTO homepage_configs (layout_key, layout_name, is_active, display_order, content_value, created_at) VALUES ('hero_banner', 'Banner quảng cáo chính (Hero)', 1, 1, '{\"banners\":[]}', datetime('now'));",
    "INSERT OR IGNORE INTO homepage_configs (layout_key, layout_name, is_active, display_order, content_value, created_at) VALUES ('best_sellers', 'Sản phẩm bán chạy nhất', 1, 2, '{\"product_ids\":[]}', datetime('now'));",
    "INSERT OR IGNORE INTO homepage_configs (layout_key, layout_name, is_active, display_order, content_value, created_at) VALUES ('featured_nutrition', 'Dinh dưỡng nổi bật', 1, 3, '{\"product_ids\":[]}', datetime('now'));",
    "INSERT OR IGNORE INTO homepage_configs (layout_key, layout_name, is_active, display_order, content_value, created_at) VALUES ('special_promotions', 'Chương trình khuyến mãi đặc biệt', 1, 4, '{\"product_ids\":[]}', datetime('now'));",
    "INSERT OR IGNORE INTO homepage_configs (layout_key, layout_name, is_active, display_order, content_value, created_at) VALUES ('accessories_section', 'Phụ kiện Trail running', 1, 5, '{\"product_ids\":[]}', datetime('now'));",
    "CREATE TABLE IF NOT EXISTS email_queue (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, name TEXT, email_type INTEGER, scheduled_time TEXT, sent INTEGER DEFAULT 0, created_at TEXT DEFAULT CURRENT_TIMESTAMP);",
    "CREATE TABLE IF NOT EXISTS marketing_posts (id INTEGER PRIMARY KEY AUTOINCREMENT, topic TEXT, platform TEXT, content TEXT, image_url TEXT, scheduled_time TEXT, posted_at TEXT, status TEXT, main_key TEXT, fb_post_id TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP);"
  ];

  for (const sql of columns) {
    try {
      await client.execute(sql);
      console.log(`Database self-migration query executed: ${sql}`);
    } catch (e: any) {
      // Ignore duplicate column/table errors
      if (!e.message.includes('duplicate column') && !e.message.includes('already exists') && !e.message.includes('duplicate')) {
        console.warn(`Database migration warning for "${sql}":`, e.message);
      }
    }
  }
}

// Lazy load @libsql/client to prevent server crash on startup if native bindings fail in target environment
async function getClient() {
  if (!clientInstance) {
    try {
      // Run auto-backup first
      autoBackup();
      
      const { createClient } = await import('@libsql/client');
      const client = createClient({
        url: `file:${dbPath}`,
      });
      // Run self-healing schema migrations
      await runMigrations(client);
      clientInstance = client;
    } catch (error) {
      console.error('CRITICAL: Failed to load @libsql/client.', error);
      throw new Error('Database client is not available in this environment.');
    }
  }
  return clientInstance;
}

export async function getDb() {
  return await getClient();
}

export async function queryAll<T>(sql: string, params: any[] = []): Promise<T[]> {
  const client = await getClient();
  const res = await client.execute({ sql, args: params });
  return res.rows as unknown as T[];
}

export async function queryGet<T>(sql: string, params: any[] = []): Promise<T | undefined> {
  const client = await getClient();
  const res = await client.execute({ sql, args: params });
  if (res.rows.length === 0) return undefined;
  return res.rows[0] as unknown as T;
}

export async function queryRun(sql: string, params: any[] = []): Promise<{ lastID: number; changes: number }> {
  const client = await getClient();
  const res = await client.execute({ sql, args: params });
  const lastID = res.lastInsertRowid ? Number(res.lastInsertRowid) : 0;
  const changes = res.rowsAffected || 0;
  return { lastID, changes };
}

export async function transaction(actions: (db: any) => Promise<void>): Promise<void> {
  const client = await getClient();
  const tx = await client.transaction("write");
  try {
    const dbMock = {
      run: (sql: string, params: any[] = [], callback?: (this: any, err: any) => void) => {
        tx.execute({ sql, args: params })
          .then((res: any) => {
            if (callback) {
              const lastID = res.lastInsertRowid ? Number(res.lastInsertRowid) : 0;
              const changes = res.rowsAffected || 0;
              callback.call({ lastID, changes }, null);
            }
          })
          .catch((err: any) => {
            if (callback) callback.call({}, err);
          });
      }
    };
    await actions(dbMock);
    await tx.commit();
  } catch (err) {
    await tx.rollback();
    throw err;
  }
}
