// API Types

export interface Worker {
  id: string;
  wallet_address: string;
  self_did: string | null;
  phone_number: string | null;
  verification_level: number;
  language_skills: string[];
  reputation_score: number;
  total_tasks_completed: number;
  accuracy_rate: number;
  tier: WorkerTier;
  created_at: string;
  updated_at: string;
}

export type WorkerTier = 'newcomer' | 'bronze' | 'silver' | 'gold' | 'expert';

export interface WorkerProfileInput {
  walletAddress: string;
  selfDid?: string | null;
  phoneNumber?: string | null;
  verificationLevel: number;
}

export interface WorkerStats {
  tasksCompleted: number;
  accuracy: number;
  tier: WorkerTier;
  earningsLifetime: number;
  earningsToday: number;
  streak: number;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}
