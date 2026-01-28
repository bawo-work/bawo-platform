// Identity Verification Types

export interface SelfVerificationResult {
  did: string;
  verified: boolean;
  level: number; // 0-3: 0=none, 1=phone, 2=Self, 3=language
  timestamp: number;
  error?: string;
}

export interface PhoneVerificationResult {
  verified: boolean;
  level: number; // Always 1 for phone-only
  phoneNumber: string;
  timestamp: number;
  error?: string;
}

export interface VerificationBadge {
  level: number;
  label: string;
  color: string;
  icon: 'check' | 'phone' | 'passport' | 'star';
}

export interface WorkerVerificationStatus {
  verificationLevel: number;
  selfDid: string | null;
  phoneNumber: string | null;
  verifiedAt: number | null;
  canUpgrade: boolean;
}

// Verification levels
export enum VerificationLevel {
  NONE = 0,
  PHONE = 1,
  SELF_PROTOCOL = 2,
  LANGUAGE_VERIFIED = 3
}

export const VERIFICATION_LIMITS = {
  [VerificationLevel.NONE]: {
    dailyLimit: 0,
    taskTypes: []
  },
  [VerificationLevel.PHONE]: {
    dailyLimit: 10, // $10/day limit
    taskTypes: ['sentiment', 'classification']
  },
  [VerificationLevel.SELF_PROTOCOL]: {
    dailyLimit: 50, // $50/day limit
    taskTypes: ['sentiment', 'classification', 'rlhf']
  },
  [VerificationLevel.LANGUAGE_VERIFIED]: {
    dailyLimit: 200, // $200/day limit
    taskTypes: ['sentiment', 'classification', 'rlhf', 'translation', 'voice']
  }
} as const;
