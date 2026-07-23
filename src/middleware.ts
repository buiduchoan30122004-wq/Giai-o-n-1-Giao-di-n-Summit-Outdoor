import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  
  // Bảo vệ đường dẫn /admin và /api/admin/*
  if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/api/admin')) {
    const basicAuth = req.headers.get('authorization');
    
    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1];
      const [user, pwd] = atob(authValue).split(':');
      
      // Lấy cấu hình từ biến môi trường (mặc định là admin / summit2026)
      const adminUser = process.env.ADMIN_USER || 'admin';
      const adminPass = process.env.ADMIN_PASS || 'summit2026';
      
      if (user === adminUser && pwd === adminPass) {
        return NextResponse.next();
      }
    }
    
    return new NextResponse('Authentication required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"',
      },
    });
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
