import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware - UI Only Version (Mockup)
 * In UI-only mode, middleware just allows all requests through
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function middleware(_request: NextRequest) {
  // Mockup: Allow all requests in UI-only mode
  // No actual authentication check needed
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|assets).*)',
  ],
};

