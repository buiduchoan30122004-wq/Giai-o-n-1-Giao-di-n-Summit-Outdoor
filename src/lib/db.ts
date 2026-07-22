import { createClient } from '@libsql/client';
import path from 'path';

const dbPath = path.join(process.cwd(), 'brain.db');

// Khởi tạo client libsql với giao thức file cho database SQLite cục bộ
const client = createClient({
  url: `file:${dbPath}`,
});

export function getDb() {
  return client;
}

export async function queryAll<T>(sql: string, params: any[] = []): Promise<T[]> {
  const res = await client.execute({ sql, args: params });
  return res.rows as unknown as T[];
}

export async function queryGet<T>(sql: string, params: any[] = []): Promise<T | undefined> {
  const res = await client.execute({ sql, args: params });
  if (res.rows.length === 0) return undefined;
  return res.rows[0] as unknown as T;
}

export async function queryRun(sql: string, params: any[] = []): Promise<{ lastID: number; changes: number }> {
  const res = await client.execute({ sql, args: params });
  const lastID = res.lastInsertRowid ? Number(res.lastInsertRowid) : 0;
  const changes = res.rowsAffected || 0;
  return { lastID, changes };
}

export async function transaction(actions: (db: any) => Promise<void>): Promise<void> {
  const tx = await client.transaction("write");
  try {
    // Mock interface tương thích ngược với callbacks của sqlite3
    const dbMock = {
      run: (sql: string, params: any[] = [], callback?: (this: any, err: any) => void) => {
        tx.execute({ sql, args: params })
          .then((res) => {
            if (callback) {
              const lastID = res.lastInsertRowid ? Number(res.lastInsertRowid) : 0;
              const changes = res.rowsAffected || 0;
              callback.call({ lastID, changes }, null);
            }
          })
          .catch((err) => {
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
