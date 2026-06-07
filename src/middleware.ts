import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const MEMBER_SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'lips-member-secret-key-2025-siin'
)
const MEMBER_COOKIE_NAME = 'lips-member-session'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // --- Admin route protection (via Supabase Auth) ---
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    let supabaseResponse = NextResponse.next({ request })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            )
            supabaseResponse = NextResponse.next({ request })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    return supabaseResponse
  }

  // If already logged in as admin and trying to access login page, redirect to dashboard
  if (pathname === '/admin/login') {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            )
            cookiesToSet.forEach(({ name, value, options }) =>
              request.cookies.set(name, value)
            )
          },
        },
      }
    )

    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  // --- Member route protection (existing JWT system) ---
  if (pathname.startsWith('/espace-membre') && pathname !== '/espace-membre/login') {
    const token = request.cookies.get(MEMBER_COOKIE_NAME)?.value

    if (!token) {
      const loginUrl = new URL('/espace-membre/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    try {
      const { jwtVerify } = await import('jose')
      await jwtVerify(token, MEMBER_SECRET_KEY)
      return NextResponse.next()
    } catch {
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
        const { jwtVerify } = await import('jose')
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
