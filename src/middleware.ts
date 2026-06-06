import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'lips-admin-secret-key-2025-siin'
)

const COOKIE_NAME = 'lips-admin-session'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only protect /admin routes (but not /admin/login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = request.cookies.get(COOKIE_NAME)?.value

    if (!token) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    try {
      await jwtVerify(token, SECRET_KEY)
      return NextResponse.next()
    } catch {
      // Token invalid or expired
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      const response = NextResponse.redirect(loginUrl)
      response.cookies.delete(COOKIE_NAME)
      return response
    }
  }

  // If already logged in and trying to access login page, redirect to dashboard
  if (pathname === '/admin/login') {
    const token = request.cookies.get(COOKIE_NAME)?.value
    if (token) {
      try {
        await jwtVerify(token, SECRET_KEY)
        return NextResponse.redirect(new URL('/admin', request.url))
      } catch {
        // Token expired, let them access login
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
