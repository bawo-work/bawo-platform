import { NextRequest, NextResponse } from 'next/server'
import { signInClient } from '@/lib/auth/client'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const result = await signInClient(email, password)

    return NextResponse.json({
      success: true,
      user: {
        id: result.user.id,
        email: result.user.email,
      },
      session: {
        accessToken: result.session.access_token,
        expiresAt: result.session.expires_at,
      },
    })
  } catch (error) {
    console.error('Login error:', error)

    const message = error instanceof Error ? error.message : 'Login failed'

    // Handle invalid credentials
    if (message.includes('Invalid') || message.includes('credentials')) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Handle non-client accounts
    if (message.includes('Not a valid client account')) {
      return NextResponse.json(
        { error: 'Not a client account. Please use the worker app.' },
        { status: 403 }
      )
    }

    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
