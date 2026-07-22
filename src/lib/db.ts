import path from 'path';

const dbPath = path.join(process.cwd(), 'brain.db');
let clientInstance: any = null;

// Lazy load @libsql/client to prevent server crash on startup if native bindings fail in target environment
async function getClient() {
  if (!clientInstance) {
    try {
      const { createClient } = await import('@libsql/client');
      clientInstance = createClient({
        url: `file:${dbPath}`,
      });
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
