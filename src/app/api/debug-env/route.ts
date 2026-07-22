import { NextResponse } from 'next/server';

export async function GET() {
  let sqliteError = null;
  try {
    const sqlite3 = await import('sqlite3');
  } catch (error: any) {
    sqliteError = {
      message: error.message,
      code: error.code,
      stack: error.stack
    };
  }

  return NextResponse.json({
    nodeVersion: process.version,
    env: process.env.NODE_ENV,
    platform: process.platform,
    arch: process.arch,
    sqliteError
  });
}
