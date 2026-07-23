import path from 'path';
import fs from 'fs';

const isVps = fs.existsSync('/var/www/summit-outdoor');
let dbPath = path.join(process.cwd(), 'brain.db');

if (isVps) {
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

let clientInstance: any = null;

async function runMigrations(client: any) {
  const columns = [
    "ALTER TABLE orders ADD COLUMN order_code TEXT;",
    "ALTER TABLE orders ADD COLUMN address TEXT;",
    "ALTER TABLE orders ADD COLUMN notes TEXT;",
    "ALTER TABLE orders ADD COLUMN transaction_id TEXT;",
    "ALTER TABLE orders ADD COLUMN payment_amount REAL;",
    "ALTER TABLE orders ADD COLUMN payment_date TEXT;",
    "ALTER TABLE orders ADD COLUMN payment_method TEXT;"
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
