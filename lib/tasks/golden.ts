/**
 * Golden task injection and management logic
 * Golden tasks are pre-labeled quality checks (10% injection rate)
 */

import { createServerClient } from '@/lib/supabase';
import type { Task, TaskType } from './types';

const GOLDEN_TASK_INJECTION_RATE = 0.10; // 10%

/**
 * Determine if next task should be a golden task
 * Uses 10% injection rate
 */
export function shouldInjectGoldenTask(): boolean {
  return Math.random() < GOLDEN_TASK_INJECTION_RATE;
}

/**
 * Get a random golden task from the pool for a specific task type
 */
export async function getGoldenTask(taskType: TaskType): Promise<Task | null> {
  const serverClient = createServerClient();

  const { data, error } = await serverClient
    .from('tasks')
    .select('*')
    .eq('task_type', taskType)
    .eq('is_golden', true)
    .eq('status', 'pending')
    .limit(1)
    .single();

  if (error) {
    console.error('Error fetching golden task:', error);
    return null;
  }

  return data as Task | null;
}

/**
 * Create a new golden task for testing/seeding
 */
export async function createGoldenTask({
  projectId,
  content,
  taskType,
  goldenAnswer,
  payAmount,
  timeLimit = 45,
  classificationOptions,
}: {
  projectId: string;
  content: string;
  taskType: TaskType;
  goldenAnswer: string;
  payAmount: number;
  timeLimit?: number;
  classificationOptions?: string[];
}): Promise<Task | null> {
  const serverClient = createServerClient();

  const { data, error } = await serverClient
    .from('tasks')
    .insert({
      project_id: projectId,
      content,
      task_type: taskType,
      is_golden: true,
      golden_answer: goldenAnswer,
      pay_amount: payAmount,
      time_limit_seconds: timeLimit,
      classification_options: classificationOptions,
      status: 'pending',
      consensus_reached: false,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating golden task:', error);
    return null;
  }

  return data as Task;
}

/**
 * Get pool of golden tasks for a project
 */
export async function getGoldenTaskPool(
  projectId: string
): Promise<{ total: number; used: number; available: number }> {
  const serverClient = createServerClient();

  const { count: totalCount } = await serverClient
    .from('tasks')
    .select('*', { count: 'exact', head: true })
    .eq('project_id', projectId)
    .eq('is_golden', true);

  const { count: usedCount } = await serverClient
    .from('tasks')
    .select('*', { count: 'exact', head: true })
    .eq('project_id', projectId)
    .eq('is_golden', true)
    .eq('status', 'completed');

  const total = totalCount || 0;
  const used = usedCount || 0;

  return {
    total,
    used,
    available: total - used,
  };
}

/**
 * Sample golden tasks for sentiment analysis (for seeding)
 */
export const SAMPLE_SENTIMENT_GOLDEN_TASKS = [
  {
    content: 'This is the best product I have ever used! Absolutely amazing quality and service.',
    goldenAnswer: 'positive',
  },
  {
    content: 'Terrible experience. The product broke after one day and customer service ignored my complaints.',
    goldenAnswer: 'negative',
  },
  {
    content: 'The product arrived on time. It works as described in the specifications.',
    goldenAnswer: 'neutral',
  },
  {
    content: 'I love how easy this is to use. My whole family enjoys it every day!',
    goldenAnswer: 'positive',
  },
  {
    content: 'Complete waste of money. Do not buy this. Save yourself the disappointment.',
    goldenAnswer: 'negative',
  },
];

/**
 * Sample golden tasks for classification (for seeding)
 */
export const SAMPLE_CLASSIFICATION_GOLDEN_TASKS = [
  {
    content: 'Apple announces new iPhone with revolutionary camera technology and faster processor.',
    goldenAnswer: 'Technology',
  },
  {
    content: 'Lakers defeat Warriors in overtime thriller as LeBron scores 40 points.',
    goldenAnswer: 'Sports',
  },
  {
    content: 'President announces new economic policy to address inflation concerns.',
    goldenAnswer: 'Politics',
  },
  {
    content: 'New blockbuster movie breaks box office records in opening weekend.',
    goldenAnswer: 'Entertainment',
  },
  {
    content: 'Stock markets rally as tech companies report strong quarterly earnings.',
    goldenAnswer: 'Business',
  },
];
