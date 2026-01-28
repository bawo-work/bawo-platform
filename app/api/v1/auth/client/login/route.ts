import { NextResponse } from 'next/server'

/**
 * Client Authentication - Email/Password Login (Skeleton)
 *
 * Sprint 1: Returns mock response
 * Sprint 5: Will integrate actual Supabase Auth
 *
 * Reference: SDD Section 1.4 - Client Authentication
 */
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        {
          error: {
            code: 'MISSING_FIELDS',
            message: 'Email and password are required'
          }
        },
        { status: 400 }
      )
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_EMAIL',
            message: 'Invalid email format'
          }
        },
        { status: 400 }
      )
    }

    // TODO Sprint 5: Implement actual Supabase Auth
    // const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    // Mock response for Sprint 1
    // In production, would check against actual database
    if (password.length < 8) {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid email or password'
          }
        },
        { status: 401 }
      )
    }

    const mockToken = `mock_client_jwt_${email.split('@')[0]}`
    const mockClientId = `client_${email.split('@')[0]}`

    return NextResponse.json({
      data: {
        token: mockToken,
        userId: mockClientId,
        email,
        message: 'Login successful (mock response for Sprint 1)'
      }
    })

  } catch (error) {
    console.error('Client login error:', error)
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to login'
        }
      },
      { status: 500 }
    )
  }
}
