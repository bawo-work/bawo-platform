import { NextResponse } from 'next/server'

/**
 * Worker Authentication - Wallet Verification (Skeleton)
 *
 * Sprint 1: Returns mock response
 * Sprint 2: Will integrate actual MiniPay wallet signature verification
 *
 * Reference: SDD Section 1.4 - Identity Service
 */
export async function POST(request: Request) {
  try {
    const { walletAddress, signature, message } = await request.json()

    // Validation
    if (!walletAddress || !signature || !message) {
      return NextResponse.json(
        {
          error: {
            code: 'MISSING_FIELDS',
            message: 'Wallet address, signature, and message are required'
          }
        },
        { status: 400 }
      )
    }

    // TODO Sprint 2: Implement actual signature verification using viem
    // const isValid = await verifyMessage({ address: walletAddress, message, signature })

    // Mock response for Sprint 1
    const mockToken = `mock_jwt_token_${walletAddress.slice(0, 8)}`
    const mockWorkerId = `worker_${walletAddress.slice(0, 8)}`

    return NextResponse.json({
      data: {
        token: mockToken,
        userId: mockWorkerId,
        walletAddress,
        verificationLevel: 0,
        message: 'Wallet verified (mock response for Sprint 1)'
      }
    })

  } catch (error) {
    console.error('Wallet verification error:', error)
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to verify wallet'
        }
      },
      { status: 500 }
    )
  }
}
