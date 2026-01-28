import { NextRequest, NextResponse } from 'next/server'
import { createProject, listProjects } from '@/lib/api/projects'
import { getClientByAuthUserId } from '@/lib/auth/client'
import { createServerClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
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

    // Parse request body
    const body = await req.json()
    const { name, taskType, instructions, pricePerTask, csvData } = body

    // Validate required fields
    if (!name || !taskType || !instructions || !pricePerTask || !csvData) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate task type
    if (!['sentiment', 'classification'].includes(taskType)) {
      return NextResponse.json(
        { error: 'Invalid task type' },
        { status: 400 }
      )
    }

    // Validate price
    const minPrice = taskType === 'sentiment' ? 0.05 : 0.08
    if (pricePerTask < minPrice) {
      return NextResponse.json(
        { error: `Price per task must be at least $${minPrice}` },
        { status: 400 }
      )
    }

    // Validate CSV data
    if (!Array.isArray(csvData) || csvData.length === 0) {
      return NextResponse.json(
        { error: 'CSV data must be a non-empty array' },
        { status: 400 }
      )
    }

    if (csvData.length > 10000) {
      return NextResponse.json(
        { error: 'Maximum 10,000 tasks per project' },
        { status: 400 }
      )
    }

    // Create project
    const result = await createProject(client.id, {
      name,
      taskType,
      instructions,
      pricePerTask,
      csvData,
    })

    return NextResponse.json({
      success: true,
      ...result,
    })
  } catch (error) {
    console.error('Create project error:', error)

    const message = error instanceof Error ? error.message : 'Failed to create project'

    // Handle insufficient balance
    if (message.includes('Insufficient balance')) {
      return NextResponse.json(
        { error: message },
        { status: 402 } // 402 Payment Required
      )
    }

    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
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

    // List projects
    const projects = await listProjects(client.id)

    return NextResponse.json({
      success: true,
      projects,
    })
  } catch (error) {
    console.error('List projects error:', error)

    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}
