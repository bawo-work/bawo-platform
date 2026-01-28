import { createServerClient } from '@/lib/supabase'
import Papa from 'papaparse'

export interface ResultRow {
  task_id: string
  text: string
  label: string
  confidence: number
  consensus: boolean
  worker_count: number
  completed_at: string
}

/**
 * Export project results as CSV
 */
export async function exportProjectResults(projectId: string): Promise<string> {
  const supabase = createServerClient()

  // Fetch project
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single()

  if (projectError || !project) {
    throw new Error('Project not found')
  }

  // Fetch tasks with responses
  const { data: tasks, error: tasksError } = await supabase
    .from('tasks')
    .select(`
      id,
      content,
      consensus_label,
      consensus_confidence,
      completed_at,
      task_responses (
        response
      )
    `)
    .eq('project_id', projectId)
    .eq('status', 'completed')

  if (tasksError) {
    throw new Error(`Failed to fetch results: ${tasksError.message}`)
  }

  if (!tasks || tasks.length === 0) {
    throw new Error('No completed tasks found')
  }

  // Format results
  const results: ResultRow[] = tasks.map((task: any) => {
    const responses = task.task_responses || []
    const workerCount = responses.length

    // Calculate consensus
    const responseCounts: Record<string, number> = {}
    responses.forEach((r: any) => {
      responseCounts[r.response] = (responseCounts[r.response] || 0) + 1
    })

    const maxCount = Math.max(...Object.values(responseCounts))
    const consensus = workerCount >= 2 && maxCount >= 2

    return {
      task_id: task.id,
      text: task.content,
      label: task.consensus_label || '',
      confidence: task.consensus_confidence || 0,
      consensus: consensus ? 'yes' : 'no',
      worker_count: workerCount,
      completed_at: task.completed_at || '',
    }
  })

  // Convert to CSV
  const csv = Papa.unparse(results, {
    header: true,
    columns: [
      'task_id',
      'text',
      'label',
      'confidence',
      'consensus',
      'worker_count',
      'completed_at',
    ],
  })

  return csv
}
