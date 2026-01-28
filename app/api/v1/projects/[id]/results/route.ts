import { NextRequest, NextResponse } from 'next/server'
import { exportProjectResults } from '@/lib/api/results'
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

    // Verify project ownership
    const project = await getProject(params.id, client.id)
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found or access denied' },
        { status: 404 }
      )
    }

    // Check if project has completed tasks
    if (project.completed_tasks === 0) {
      return NextResponse.json(
        { error: 'No completed tasks yet' },
        { status: 400 }
      )
    }

    // Export results as CSV
    const csv = await exportProjectResults(params.id)

    // Return CSV file
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${project.name.replace(/\s+/g, '-')}-results.csv"`,
      },
    })
  } catch (error) {
    console.error('Export results error:', error)

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to export results' },
      { status: 500 }
    )
  }
}
