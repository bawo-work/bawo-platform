/**
 * RLHF Task Type - Preference ranking between AI responses
 * Higher pay rate: $0.15 per task (vs $0.05 for basic tasks)
 */

import { supabase } from '@/lib/supabase/client';

export type RLHFTaskCreate = {
  project_id: string;
  prompt: string;
  response_a: string;
  response_b: string;
  metadata?: Record<string, any>;
};

/**
 * Create RLHF preference task
 */
export async function createRLHFTask(data: RLHFTaskCreate): Promise<string> {
  const { data: task, error } = await supabase
    .from('tasks')
    .insert({
      project_id: data.project_id,
      task_type: 'rlhf_preference',
      content: {
        prompt: data.prompt,
        response_a: data.response_a,
        response_b: data.response_b,
      },
      metadata: data.metadata || {},
      time_limit: 60, // 60 seconds (longer than sentiment/classification)
      price_per_label: 0.15, // Higher pay for RLHF
      labels_required: 3, // 3 workers for consensus
    })
    .select('id')
    .single();

  if (error) {
    console.error('Error creating RLHF task:', error);
    throw new Error('Failed to create RLHF task');
  }

  return task.id;
}

/**
 * Submit RLHF task response
 */
export async function submitRLHFResponse(
  taskId: string,
  workerId: string,
  preferred: 'a' | 'b'
): Promise<void> {
  const { error } = await supabase.from('task_responses').insert({
    task_id: taskId,
    worker_id: workerId,
    response: { preferred },
    submitted_at: new Date().toISOString(),
  });

  if (error) {
    console.error('Error submitting RLHF response:', error);
    throw new Error('Failed to submit RLHF response');
  }
}

/**
 * Calculate RLHF consensus (2/3 agreement on preferred response)
 */
export async function calculateRLHFConsensus(
  taskId: string
): Promise<{ hasConsensus: boolean; preferred?: 'a' | 'b'; confidence: number }> {
  const { data: responses } = await supabase
    .from('task_responses')
    .select('response')
    .eq('task_id', taskId);

  if (!responses || responses.length < 3) {
    return { hasConsensus: false, confidence: 0 };
  }

  // Count votes
  const votes = { a: 0, b: 0 };
  responses.forEach((r) => {
    const preferred = r.response.preferred;
    if (preferred === 'a') votes.a++;
    if (preferred === 'b') votes.b++;
  });

  const total = votes.a + votes.b;
  const majority = Math.max(votes.a, votes.b);
  const confidence = (majority / total) * 100;

  // Consensus requires 2/3 agreement
  const hasConsensus = majority >= 2;
  const preferred = votes.a > votes.b ? 'a' : 'b';

  return { hasConsensus, preferred, confidence };
}
