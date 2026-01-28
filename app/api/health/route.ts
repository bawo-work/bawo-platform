import { NextResponse } from 'next/server'

/**
 * Health Check Endpoint
 *
 * Used by monitoring tools (BetterStack) and Vercel to verify deployment
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '0.1.0',
    sprint: 1,
    environment: process.env.NODE_ENV || 'development'
  })
}
