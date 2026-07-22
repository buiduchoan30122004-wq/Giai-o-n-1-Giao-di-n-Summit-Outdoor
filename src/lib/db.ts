import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'brain.db');

export function getDb() {
  const db = new sqlite3.Database(dbPath);
  return db;
}

export function queryAll<T>(sql: string, params: any[] = []): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const db = getDb();
    db.all(sql, params, (err, rows) => {
      db.close();
      if (err) reject(err);
      else resolve(rows as T[]);
    });
  });
}

export function queryGet<T>(sql: string, params: any[] = []): Promise<T | undefined> {
  return new Promise((resolve, reject) => {
    const db = getDb();
    db.get(sql, params, (err, row) => {
      db.close();
      if (err) reject(err);
      else resolve(row as T | undefined);
    });
  });
}

export function queryRun(sql: string, params: any[] = []): Promise<{ lastID: number; changes: number }> {
  return new Promise((resolve, reject) => {
    const db = getDb();
    db.run(sql, params, function (err) {
      db.close();
      if (err) {
        reject(err);
      } else {
        resolve({ lastID: this.lastID, changes: this.changes });
      }
    });
  });
}

export function transaction(actions: (db: sqlite3.Database) => Promise<void>): Promise<void> {
  return new Promise((resolve, reject) => {
    const db = getDb();
    db.serialize(async () => {
      try {
        db.run('BEGIN TRANSACTION');
        await actions(db);
        db.run('COMMIT', (err) => {
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
