/**
 * Task assignment algorithm
 * Simplified FIFO queue for Sprint 3
 * Full Redis-based algorithm in Sprint 4
 */

import { createServerClient } from '@/lib/supabase';
import type { Task, TaskType } from './types';
import { shouldInjectGoldenTask, getGoldenTask } from './golden';

const REQUIRED_WORKERS_PER_TASK = 3; // For consensus

/**
 * Get next task for a worker
 * Handles golden task injection and assignment logic
 */
export async function getNextTask(
  workerId: string,
  preferredTaskType?: TaskType
): Promise<Task | null> {
  const serverClient = createServerClient();

  // 1. Check for golden task injection (10% rate)
  const shouldInjectGolden = shouldInjectGoldenTask();

  if (shouldInjectGolden) {
    const taskType = preferredTaskType || 'sentiment';
    const goldenTask = await getGoldenTask(taskType);
    if (goldenTask) {
      // Assign golden task to this worker
      await assignTaskToWorker(goldenTask.id, workerId);
      return goldenTask;
    }
  }

  // 2. Get next pending task not already assigned to this worker
  const query = serverClient
    .from('tasks')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })
    .limit(10);

  // Filter by task type if specified
  if (preferredTaskType) {
    query.eq('task_type', preferredTaskType);
  }

  const { data: tasks, error } = await query;

  if (error) {
    console.error('Error fetching tasks:', error);
    return null;
  }

  if (!tasks || tasks.length === 0) {
    return null; // No tasks available
  }

  // Find first task not assigned to this worker
  for (const task of tasks) {
    const assignedTo = task.assigned_to || [];
    if (!assignedTo.includes(workerId) && assignedTo.length < REQUIRED_WORKERS_PER_TASK) {
      // Assign this task to the worker
      await assignTaskToWorker(task.id, workerId);
      return task as Task;
    }
  }

  return null; // No suitable tasks found
}

/**
 * Assign a task to a worker
 */
export async function assignTaskToWorker(
  taskId: string,
  workerId: string
): Promise<boolean> {
  const serverClient = createServerClient();

  try {
    // Fetch current task
    const { data: task, error: fetchError } = await serverClient
      .from('tasks')
      .select('assigned_to, status')
      .eq('id', taskId)
      .single();

    if (fetchError || !task) {
      console.error('Error fetching task for assignment:', fetchError);
      return false;
    }

    const assignedTo = task.assigned_to || [];

    // Check if already assigned
    if (assignedTo.includes(workerId)) {
      return true; // Already assigned
    }

    // Check if task is full (3 workers assigned)
    if (assignedTo.length >= REQUIRED_WORKERS_PER_TASK) {
      return false; // Task is full
    }

    // Add worker to assigned list
    const newAssignedTo = [...assignedTo, workerId];

    const { error: updateError } = await serverClient
      .from('tasks')
      .update({
        status: 'assigned',
        assigned_to: newAssignedTo,
      })
      .eq('id', taskId);

    if (updateError) {
      console.error('Error updating task assignment:', updateError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in assignTaskToWorker:', error);
    return false;
  }
}

/**
 * Return a task to the queue (worker skipped or timed out)
 */
export async function returnTaskToQueue(
  taskId: string,
  workerId: string
): Promise<boolean> {
  const serverClient = createServerClient();

  try {
    const { data: task, error: fetchError } = await serverClient
      .from('tasks')
      .select('assigned_to')
      .eq('id', taskId)
      .single();

    if (fetchError || !task) {
      return false;
    }

    const assignedTo = task.assigned_to || [];
    const newAssignedTo = assignedTo.filter((id: string) => id !== workerId);

    // If no workers left, set status back to pending
    const newStatus = newAssignedTo.length === 0 ? 'pending' : 'assigned';

    const { error: updateError } = await serverClient
      .from('tasks')
      .update({
        status: newStatus,
        assigned_to: newAssignedTo,
      })
      .eq('id', taskId);

    return !updateError;
  } catch (error) {
    console.error('Error returning task to queue:', error);
    return false;
  }
}

/**
 * Check if consensus is reached for a task
 * Returns consensus label if 2+ out of 3 workers agree
 */
export async function checkTaskConsensus(taskId: string): Promise<{
  reached: boolean;
  label?: string;
  confidence?: number;
}> {
  const serverClient = createServerClient();

  const { data: responses, error } = await serverClient
    .from('task_responses')
    .select('response')
    .eq('task_id', taskId);

  if (error || !responses || responses.length < REQUIRED_WORKERS_PER_TASK) {
    return { reached: false };
  }

  // Count responses
  const counts: Record<string, number> = {};
  responses.forEach((r) => {
    counts[r.response] = (counts[r.response] || 0) + 1;
  });

  // Find majority
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const [topLabel, topCount] = entries[0];
  const confidence = topCount / responses.length;

  // Consensus reached if 2+ workers agree (66%+)
  const reached = confidence >= 0.66;

  if (reached) {
    // Update task with consensus
    await serverClient
      .from('tasks')
      .update({
        status: 'completed',
        consensus_label: topLabel,
        consensus_confidence: confidence,
        consensus_reached: true,
      })
      .eq('id', taskId);
  }

  return {
    reached,
    label: topLabel,
    confidence,
  };
}

/**
 * Get task assignment statistics for monitoring
 */
export async function getTaskAssignmentStats(): Promise<{
  pending: number;
  assigned: number;
  completed: number;
}> {
  const serverClient = createServerClient();

  const { count: pendingCount } = await serverClient
    .from('tasks')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  const { count: assignedCount } = await serverClient
    .from('tasks')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'assigned');

  const { count: completedCount } = await serverClient
    .from('tasks')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'completed');

  return {
    pending: pendingCount || 0,
    assigned: assignedCount || 0,
    completed: completedCount || 0,
  };
}
