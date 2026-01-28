/**
 * Task types and interfaces for Bawo platform
 */

export type TaskType = 'sentiment' | 'classification';
export type TaskStatus = 'pending' | 'assigned' | 'completed' | 'expired';
export type Sentiment = 'positive' | 'negative' | 'neutral';

export interface Task {
  id: string;
  projectId: string;
  type: TaskType;
  content: string;
  options?: string[]; // For classification tasks
  timeLimit: number; // Seconds (default 45)
  payAmount: number; // USD
  status: TaskStatus;
  assignedTo?: string[]; // Worker IDs (for consensus)
  responses?: TaskResponse[];
  finalLabel?: string;
  consensusReached: boolean;
  isGoldenTask: boolean;
  goldenAnswer?: string; // Only set if golden task
  createdAt: string;
}

export interface TaskResponse {
  id: string;
  taskId: string;
  workerId: string;
  response: string;
  responseTimeSeconds: number;
  isCorrect?: boolean; // null if not golden, true/false if golden
  submittedAt: string;
}

export interface TaskSubmissionResult {
  success: boolean;
  isGolden: boolean;
  correct?: boolean;
  earned: number;
  nextTaskId?: string;
}

export interface WorkerStats {
  tasksCompleted: number;
  accuracy: number; // 0-100
  tier: 'newcomer' | 'bronze' | 'silver' | 'gold' | 'expert';
  earningsLifetime: number;
}
