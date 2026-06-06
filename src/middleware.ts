import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const ADMIN_SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'lips-admin-secret-key-2025-siin'
)
const ADMIN_COOKIE_NAME = 'lips-admin-session'

const MEMBER_SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'lips-member-secret-key-2025-siin'
)
const MEMBER_COOKIE_NAME = 'lips-member-session'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // --- Admin route protection ---
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value

    if (!token) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    try {
      await jwtVerify(token, ADMIN_SECRET_KEY)
      return NextResponse.next()
    } catch {
      // Token invalid or expired
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      const response = NextResponse.redirect(loginUrl)
      response.cookies.delete(ADMIN_COOKIE_NAME)
      return response
    }
  }

  // If already logged in as admin and trying to access login page, redirect to dashboard
  if (pathname === '/admin/login') {
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value
    if (token) {
      try {
        await jwtVerify(token, ADMIN_SECRET_KEY)
        return NextResponse.redirect(new URL('/admin', request.url))
      } catch {
        // Token expired, let them access login
      }
    }
  }

  // --- Member route protection ---
  if (pathname.startsWith('/espace-membre') && pathname !== '/espace-membre/login') {
    const token = request.cookies.get(MEMBER_COOKIE_NAME)?.value

    if (!token) {
      const loginUrl = new URL('/espace-membre/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    try {
      await jwtVerify(token, MEMBER_SECRET_KEY)
      return NextResponse.next()
    } catch {
      // Token invalid or expired
      const loginUrl = new URL('/espace-membre/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      const response = NextResponse.redirect(loginUrl)
      response.cookies.delete(MEMBER_COOKIE_NAME)
      return response
    }
  }

  // If already logged in as member and trying to access login page, redirect to dashboard
  if (pathname === '/espace-membre/login') {
    const token = request.cookies.get(MEMBER_COOKIE_NAME)?.value
    if (token) {
      try {
        await jwtVerify(token, MEMBER_SECRET_KEY)
        return NextResponse.redirect(new URL('/espace-membre', request.url))
      } catch {
        // Token expired, let them access login
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/espace-membre/:path*'],
}
