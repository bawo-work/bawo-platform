// Verification Badge Component

'use client';

import { VerificationLevel } from '@/lib/identity/types';
import type { VerificationBadge as BadgeType } from '@/lib/identity/types';

interface VerificationBadgeProps {
  level: number;
  className?: string;
  showLabel?: boolean;
}

/**
 * Returns badge configuration for verification level
 */
function getBadgeConfig(level: number): BadgeType {
  switch (level) {
    case VerificationLevel.LANGUAGE_VERIFIED:
      return {
        level: 3,
        label: 'Language Expert',
        color: 'bg-money-gold text-warm-black',
        icon: 'star'
      };
    case VerificationLevel.SELF_PROTOCOL:
      return {
        level: 2,
        label: 'Verified',
        color: 'bg-success text-white',
        icon: 'passport'
      };
    case VerificationLevel.PHONE:
      return {
        level: 1,
        label: 'Phone Verified',
        color: 'bg-teal-600 text-white',
        icon: 'phone'
      };
    default:
      return {
        level: 0,
        label: 'Not Verified',
        color: 'bg-warm-gray-600 text-white',
        icon: 'check'
      };
  }
}

/**
 * Icon component for badge
 */
function BadgeIcon({ icon, className }: { icon: string; className?: string }) {
  const iconClass = className || 'w-4 h-4';

  switch (icon) {
    case 'star':
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    case 'passport':
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      );
    case 'phone':
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      );
    default:
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
  }
}

/**
 * Displays verification badge with appropriate styling
 */
export function VerificationBadge({
  level,
  className = '',
  showLabel = true
}: VerificationBadgeProps) {
  const badge = getBadgeConfig(level);

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${badge.color} ${className}`}
    >
      <BadgeIcon icon={badge.icon} />
      {showLabel && <span>{badge.label}</span>}
    </div>
  );
}

/**
 * Larger version for onboarding/profile screens
 */
export function VerificationBadgeLarge({ level }: { level: number }) {
  const badge = getBadgeConfig(level);

  return (
    <div
      className={`inline-flex flex-col items-center gap-2 px-6 py-4 rounded-lg ${badge.color}`}
    >
      <BadgeIcon icon={badge.icon} className="w-8 h-8" />
      <span className="text-sm font-semibold">{badge.label}</span>
    </div>
  );
}
