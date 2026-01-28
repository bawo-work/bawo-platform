import { createServerClient } from '@/lib/supabase'

export interface CreateProjectData {
  name: string
  taskType: 'sentiment' | 'classification'
  instructions: string
  pricePerTask: number
  csvData: string[] // Array of text strings
}

export interface CreateProjectResult {
  projectId: string
  taskCount: number
  totalCost: number
}

/**
 * Create a new project with tasks
 */
export async function createProject(
  clientId: string,
  data: CreateProjectData
): Promise<CreateProjectResult> {
  const { name, taskType, instructions, pricePerTask, csvData } = data
  const supabase = createServerClient()

  // Validate inputs
  if (!name || !taskType || !instructions || !csvData || csvData.length === 0) {
    throw new Error('Missing required fields')
  }

  if (pricePerTask < 0.05) {
    throw new Error('Price per task must be at least $0.05')
  }

  if (csvData.length > 10000) {
    throw new Error('Maximum 10,000 tasks per project')
  }

  // Calculate total cost
  const totalCost = csvData.length * pricePerTask

  // Check client balance
  const { data: client, error: clientError } = await supabase
    .from('clients')
    .select('balance_usd')
    .eq('id', clientId)
    .single()

  if (clientError || !client) {
    throw new Error('Failed to fetch client balance')
  }

  if (client.balance_usd < totalCost) {
    throw new Error(
      `Insufficient balance. You need $${(totalCost - client.balance_usd).toFixed(2)} more to launch this project.`
    )
  }

  // Start transaction: Create project
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .insert({
      client_id: clientId,
      name,
      task_type: taskType,
      instructions,
      price_per_task: pricePerTask,
      total_tasks: csvData.length,
      completed_tasks: 0,
      status: 'active',
    })
    .select()
    .single()

  if (projectError || !project) {
    throw new Error(`Failed to create project: ${projectError?.message || 'Unknown error'}`)
  }

  // Create tasks
  const tasks = csvData.map((text, index) => ({
    project_id: project.id,
    content: text,
    task_type: taskType,
    time_limit_seconds: 45,
    is_golden: index % 10 === 0, // Mark every 10th task as golden (for future QA)
    status: 'pending',
  }))

  const { error: tasksError } = await supabase
    .from('tasks')
    .insert(tasks)

  if (tasksError) {
    // Rollback: Delete project if task creation fails
    await supabase.from('projects').delete().eq('id', project.id)
    throw new Error(`Failed to create tasks: ${tasksError.message}`)
  }

  // Deduct from client balance (escrow)
  const { error: balanceError } = await supabase
    .from('clients')
    .update({ balance_usd: client.balance_usd - totalCost })
    .eq('id', clientId)

  if (balanceError) {
    // Rollback: Delete project and tasks
    await supabase.from('projects').delete().eq('id', project.id)
    throw new Error(`Failed to escrow funds: ${balanceError.message}`)
  }

  return {
    projectId: project.id,
    taskCount: csvData.length,
    totalCost,
  }
}

/**
 * Get project by ID
 */
export async function getProject(projectId: string, clientId: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .eq('client_id', clientId)
    .single()

  if (error) {
    throw new Error(`Failed to fetch project: ${error.message}`)
  }

  return data
}

/**
 * List projects for a client
 */
export async function listProjects(clientId: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch projects: ${error.message}`)
  }

  return data
}

/**
 * Get project progress statistics
 */
export async function getProjectStats(projectId: string) {
  const supabase = createServerClient()

  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single()

  if (projectError || !project) {
    throw new Error('Project not found')
  }

  // Get task status breakdown
  const { data: tasks } = await supabase
    .from('tasks')
    .select('status')
    .eq('project_id', projectId)

  const statusCount = {
    pending: 0,
    assigned: 0,
    completed: 0,
    expired: 0,
  }

  tasks?.forEach((task) => {
    statusCount[task.status as keyof typeof statusCount]++
  })

  return {
    ...project,
    statusCount,
    percentComplete: (project.completed_tasks / project.total_tasks) * 100,
  }
}
