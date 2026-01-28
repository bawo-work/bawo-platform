/**
 * API endpoint for worker withdrawals
 * POST /api/v1/earnings/withdraw
 */

import { NextRequest, NextResponse } from 'next/server'
import { withdrawToWallet, validateWithdrawal } from '@/lib/api/withdraw'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { workerId, amount } = body

    // Validate required fields
    if (!workerId || !amount) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_REQUEST',
            message: 'Missing required fields: workerId, amount',
          },
        },
        { status: 400 }
      )
    }

    // Parse amount
    const amountUSD = parseFloat(amount)
    if (isNaN(amountUSD)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_AMOUNT',
            message: 'Invalid amount format',
          },
        },
        { status: 400 }
      )
    }

    // Validate withdrawal
    const validation = await validateWithdrawal({ workerId, amountUSD })
    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_FAILED',
            message: validation.errors.join(', '),
            errors: validation.errors,
          },
        },
        { status: 400 }
      )
    }

    // Process withdrawal
    const result = await withdrawToWallet({ workerId, amountUSD })

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'WITHDRAWAL_FAILED',
            message: result.message,
          },
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        txHash: result.txHash,
        amountSent: result.amountSent,
        fee: result.fee,
        message: result.message,
      },
    })
  } catch (error: any) {
    console.error('Withdrawal API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message || 'Internal server error',
        },
      },
      { status: 500 }
    )
  }
}
