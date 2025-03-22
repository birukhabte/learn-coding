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
2025-03-31T21:35:37 - release version 1.0
2025-03-12T14:30:15 - create dashboard layout
2025-03-21T06:55:43 - create reusable UI components
2025-03-22T15:45:19 - improve code documentation
