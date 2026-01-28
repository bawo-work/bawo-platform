/**
 * Task submission API and task-related operations
 */

import { supabase, createServerClient } from '@/lib/supabase';
import type { Task, TaskSubmissionResult } from '@/lib/tasks/types';
import { updateWorkerAccuracy } from '@/lib/workers/accuracy';

interface SubmitTaskResponseParams {
  taskId: string;
  workerId: string;
  response: string;
  responseTimeSeconds: number;
}

/**
 * Submit a task response and handle golden task validation
 */
export async function submitTaskResponse({
  taskId,
  workerId,
  response,
  responseTimeSeconds,
}: SubmitTaskResponseParams): Promise<TaskSubmissionResult> {
  const serverClient = createServerClient();

  try {
    // 1. Save response to task_responses table
    const { data: responseData, error: responseError } = await serverClient
      .from('task_responses')
      .insert({
        task_id: taskId,
        worker_id: workerId,
        response,
        response_time_seconds: responseTimeSeconds,
        submitted_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (responseError) {
      console.error('Error saving task response:', responseError);
      throw new Error('Failed to submit task response');
    }

    // 2. Fetch task details to check if golden
    const { data: task, error: taskError } = await serverClient
      .from('tasks')
      .select('is_golden, golden_answer, pay_amount, task_type')
      .eq('id', taskId)
      .single();

    if (taskError) {
      console.error('Error fetching task:', taskError);
      throw new Error('Failed to fetch task details');
    }

    // 3. Handle golden task validation
    if (task?.is_golden) {
      const correct = response === task.golden_answer;

      // Update response record with correctness
      await serverClient
        .from('task_responses')
        .update({ is_correct: correct })
        .eq('id', responseData.id);

      // Update worker accuracy
      await updateWorkerAccuracy(workerId, correct);

      // Update task status to completed
      await serverClient
        .from('tasks')
        .update({
          status: 'completed',
          consensus_label: task.golden_answer,
          consensus_confidence: 1.0,
        })
        .eq('id', taskId);

      return {
        success: true,
        isGolden: true,
        correct,
        earned: correct ? task.pay_amount : 0,
      };
    }

    // 4. Regular task - queue for consensus
    // Update task status to show response received
    await serverClient
      .from('tasks')
      .update({ status: 'assigned' })
      .eq('id', taskId);

    return {
      success: true,
      isGolden: false,
      earned: 0, // Payment after consensus
    };
  } catch (error) {
    console.error('Task submission error:', error);
    return {
      success: false,
      isGolden: false,
      earned: 0,
    };
  }
}

/**
 * Get available tasks for a worker
 */
export async function getAvailableTasks(
  workerId: string,
  limit: number = 10
): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('status', 'pending')
    .not('assigned_to', 'cs', `{${workerId}}`) // Not already assigned to this worker
    .order('created_at', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }

  return data as Task[];
}

/**
 * Get a specific task by ID
 */
export async function getTaskById(taskId: string): Promise<Task | null> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', taskId)
    .single();

  if (error) {
    console.error('Error fetching task:', error);
    return null;
  }

  return data as Task;
}

/**
 * Mark task as assigned to a worker
 */
export async function assignTaskToWorker(
  taskId: string,
  workerId: string
): Promise<boolean> {
  const serverClient = createServerClient();

  const { data: task } = await serverClient
    .from('tasks')
    .select('assigned_to')
    .eq('id', taskId)
    .single();

  if (!task) return false;

  const assignedTo = task.assigned_to || [];
  if (assignedTo.includes(workerId)) {
    return true; // Already assigned
  }

  const { error } = await serverClient
    .from('tasks')
    .update({
      status: 'assigned',
      assigned_to: [...assignedTo, workerId],
    })
    .eq('id', taskId);

  return !error;
}
