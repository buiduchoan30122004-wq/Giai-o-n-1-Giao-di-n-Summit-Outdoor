import { NextResponse } from 'next/server';
import { queryAll, queryRun } from '@/lib/db';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const dbPath = path.join(process.cwd(), 'brain.db');
  const diagnostics: any = {
    dbPath,
    exists: fs.existsSync(dbPath),
  };

  if (diagnostics.exists) {
    try {
      const stats = fs.statSync(dbPath);
      diagnostics.permissions = stats.mode.toString(8);
      diagnostics.owner = stats.uid + ':' + stats.gid;
    } catch (e: any) {
      diagnostics.statError = e.message;
    }
  }

  try {
    // Thử truy vấn đọc danh sách bảng
    const tables = await queryAll("SELECT name FROM sqlite_master WHERE type='table'");
    diagnostics.tables = tables;

    // Thử thực hiện một ghi chép nháp
    const testWrite = await queryRun("CREATE TABLE IF NOT EXISTS _test_debug (id INTEGER PRIMARY KEY, val TEXT)");
    diagnostics.writeResult = testWrite;
  } catch (error: any) {
    diagnostics.dbError = {
      message: error.message,
      stack: error.stack,
    };
  }

  return NextResponse.json(diagnostics);
}
