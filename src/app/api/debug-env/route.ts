import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    nodeVersion: process.version,
    env: process.env.NODE_ENV,
    platform: process.platform,
    arch: process.arch
  });
}
