import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

export async function middleware(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get('authjs.session-token')?.value;
  if(!token)
  {
    return NextResponse.redirect(new URL('/api/auth/signin', request.url))
  }
}
 
export const config = {
  matcher: '/profile/:path*',
}