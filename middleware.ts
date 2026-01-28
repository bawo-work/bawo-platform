import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only protect client routes
  if (!pathname.startsWith('/client/')) {
    return NextResponse.next()
  }

  // Allow public client routes
  const publicRoutes = ['/client/login', '/client/signup']
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Check for session
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  // Get session from cookies
  const sessionToken = request.cookies.get('sb-access-token')?.value
  const refreshToken = request.cookies.get('sb-refresh-token')?.value

  if (!sessionToken && !refreshToken) {
    // No session, redirect to login
    const loginUrl = new URL('/client/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  try {
    // Verify session with Supabase
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error || !session) {
      // Invalid session, redirect to login
      const loginUrl = new URL('/client/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Verify this is a client account
    const { data: clientData, error: clientError } = await supabase
      .from('clients')
      .select('id')
      .eq('auth_user_id', session.user.id)
      .single()

    if (clientError || !clientData) {
      // Not a client account, redirect to login
      const loginUrl = new URL('/client/login', request.url)
      loginUrl.searchParams.set('error', 'not_client')
      return NextResponse.redirect(loginUrl)
    }

    // Valid client session, allow request
    return NextResponse.next()
  } catch (error) {
    console.error('Middleware error:', error)
    const loginUrl = new URL('/client/login', request.url)
    return NextResponse.redirect(loginUrl)
  }
}

export const config = {
  matcher: [
    '/client/dashboard/:path*',
    '/client/projects/:path*',
    '/client/deposit/:path*',
    '/client/settings/:path*',
  ],
}
