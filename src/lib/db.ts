import path from 'path';

const dbPath = path.join(process.cwd(), 'brain.db');
let sqlite3Instance: any = null;

// Lazy load sqlite3 to prevent crash on startup if native bindings fail to compile on target server (e.g. VPS Node.js version mismatch)
async function getSqlite3() {
  if (!sqlite3Instance) {
    try {
      const sqlite3Module = await import('sqlite3');
      sqlite3Instance = sqlite3Module.default || sqlite3Module;
    } catch (error) {
      console.error('CRITICAL: Failed to load sqlite3 native module.', error);
      throw new Error('SQLite3 driver is not available in this environment.');
    }
  }
  return sqlite3Instance;
}

export async function getDb() {
  const sqlite3 = await getSqlite3();
  return new sqlite3.Database(dbPath);
}

export async function queryAll<T>(sql: string, params: any[] = []): Promise<T[]> {
  const db = await getDb();
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err: any, rows: any) => {
      db.close();
      if (err) reject(err);
      else resolve(rows as T[]);
    });
  });
}

export async function queryGet<T>(sql: string, params: any[] = []): Promise<T | undefined> {
  const db = await getDb();
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err: any, row: any) => {
      db.close();
      if (err) reject(err);
      else resolve(row as T | undefined);
    });
  });
}

export async function queryRun(sql: string, params: any[] = []): Promise<{ lastID: number; changes: number }> {
  const db = await getDb();
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (this: any, err: any) {
      db.close();
      if (err) {
        reject(err);
      } else {
        resolve({ lastID: this.lastID, changes: this.changes });
      }
    });
  });
}

export async function transaction(actions: (db: any) => Promise<void>): Promise<void> {
  const db = await getDb();
  return new Promise((resolve, reject) => {
    db.serialize(async () => {
      try {
        db.run('BEGIN TRANSACTION');
        await actions(db);
        db.run('COMMIT', (err: any) => {
          db.close();
          if (err) reject(err);
          else resolve();
        });
      } catch (err) {
        db.run('ROLLBACK', () => {
          db.close();
          reject(err);
        });
      }
    });
  });
}
