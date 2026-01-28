import { NextRequest, NextResponse } from 'next/server'
import { getProject } from '@/lib/api/projects'
import { getClientByAuthUserId } from '@/lib/auth/client'
import { createServerClient } from '@/lib/supabase'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get authenticated user
    const supabase = createServerClient()
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get client record
    const client = await getClientByAuthUserId(session.user.id)
    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      )
    }

    // Get project
    const project = await getProject(params.id, client.id)

    return NextResponse.json({
      success: true,
      project,
    })
  } catch (error) {
    console.error('Get project error:', error)

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch project' },
      { status: 500 }
    )
  }
}
