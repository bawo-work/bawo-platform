import { NextResponse } from 'next/server'

/**
 * Client Authentication - Sign Up (Skeleton)
 *
 * Sprint 1: Returns mock response
 * Sprint 5: Will integrate actual Supabase Auth
 *
 * Reference: SDD Section 1.4 - Client Authentication
 */
export async function POST(request: Request) {
  try {
    const { email, password, companyName } = await request.json()

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

    // Email format validation
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

    // Password strength validation
    if (password.length < 12) {
      return NextResponse.json(
        {
          error: {
            code: 'WEAK_PASSWORD',
            message: 'Password must be at least 12 characters'
          }
        },
        { status: 400 }
      )
    }

    // TODO Sprint 5: Implement actual Supabase Auth
    // const { data, error } = await supabase.auth.signUp({ email, password })
    // await supabase.from('clients').insert({ id: data.user.id, email, company_name: companyName })

    // Mock response for Sprint 1
    const mockToken = `mock_client_jwt_${email.split('@')[0]}`
    const mockClientId = `client_${email.split('@')[0]}`

    return NextResponse.json({
      data: {
        token: mockToken,
        userId: mockClientId,
        email,
        companyName: companyName || null,
        message: 'Account created successfully (mock response for Sprint 1)'
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Client signup error:', error)
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to create account'
        }
      },
      { status: 500 }
    )
  }
}
