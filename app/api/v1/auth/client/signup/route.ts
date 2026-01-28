import { NextRequest, NextResponse } from 'next/server'
import { signUpClient } from '@/lib/auth/client'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password, companyName } = body

    // Validate required fields
    if (!email || !password || !companyName) {
      return NextResponse.json(
        { error: 'Email, password, and company name are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    const result = await signUpClient({ email, password, companyName })

    return NextResponse.json({
      success: true,
      user: {
        id: result.user.id,
        email: result.user.email,
      },
      clientId: result.clientId,
    })
  } catch (error) {
    console.error('Signup error:', error)

    const message = error instanceof Error ? error.message : 'Signup failed'

    // Handle duplicate email
    if (message.includes('duplicate') || message.includes('already exists')) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
