// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/pdf/')) {
    return NextResponse.next(); // allow PDF access
  }

  // your normal logic
  return NextResponse.next();
}

export const config = {
  matcher: '/((?!pdf/).*)', // ignore pdf folder
};
