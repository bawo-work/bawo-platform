// Phone Verification Implementation

import type { PhoneVerificationResult } from './types';
import { VerificationLevel } from './types';

/**
 * MOCK IMPLEMENTATION for Sprint 2 - Replace with actual SMS verification
 *
 * Real implementation would:
 * 1. Send SMS verification code via Twilio or similar
 * 2. Validate code entered by user
 * 3. Store phone number hash (not plaintext)
 *
 * TODO: Integrate Supabase Auth phone verification
 * TODO: Add rate limiting for SMS sends
 * TODO: Add phone number validation for Kenya/target regions
 */

/**
 * Validates phone number format
 * @param phoneNumber - Phone number with country code
 * @returns boolean - true if valid format
 */
export function isValidPhoneNumber(phoneNumber: string): boolean {
  // Kenyan phone format: +254 7XX XXX XXX or +254 1XX XXX XXX
  // Also accept international format for other countries
  const kenyaRegex = /^\+254[71]\d{8}$/;
  const internationalRegex = /^\+[1-9]\d{1,14}$/;

  return kenyaRegex.test(phoneNumber) || internationalRegex.test(phoneNumber);
}

/**
 * Formats phone number for display
 * @param phoneNumber - Full phone number
 * @returns Formatted number (e.g., "+254 7XX XXX 123")
 */
export function formatPhoneNumber(phoneNumber: string): string {
  if (!phoneNumber) return '';

  // Show only last 3 digits for privacy
  if (phoneNumber.length < 4) return phoneNumber;

  const countryCode = phoneNumber.slice(0, phoneNumber.length - 9);
  const masked = 'X'.repeat(phoneNumber.length - countryCode.length - 3);
  const lastDigits = phoneNumber.slice(-3);

  return `${countryCode} ${masked.slice(0, 3)} ${masked.slice(3, 6)} ${lastDigits}`;
}

/**
 * Sends SMS verification code to phone number
 *
 * @param phoneNumber - Phone number with country code
 * @returns Promise<{ sent: boolean, error?: string }>
 */
export async function sendVerificationCode(phoneNumber: string): Promise<{
  sent: boolean;
  error?: string;
}> {
  // MOCK: Validate phone number
  if (!isValidPhoneNumber(phoneNumber)) {
    return {
      sent: false,
      error: 'Invalid phone number format'
    };
  }

  // MOCK: Simulate SMS send delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // MOCK: Always succeed for Sprint 2
  console.log('[MOCK] Would send SMS code to:', phoneNumber);

  return {
    sent: true
  };

  // Real implementation:
  // const { error } = await supabase.auth.signInWithOtp({
  //   phone: phoneNumber
  // });
  // return { sent: !error, error: error?.message };
}

/**
 * Verifies SMS code entered by user
 *
 * @param phoneNumber - Phone number
 * @param code - 6-digit verification code
 * @returns Promise<PhoneVerificationResult>
 */
export async function verifyPhoneCode(
  phoneNumber: string,
  code: string
): Promise<PhoneVerificationResult> {
  // MOCK: Validate inputs
  if (!isValidPhoneNumber(phoneNumber)) {
    return {
      verified: false,
      level: VerificationLevel.NONE,
      phoneNumber: '',
      timestamp: Date.now(),
      error: 'Invalid phone number'
    };
  }

  if (!/^\d{6}$/.test(code)) {
    return {
      verified: false,
      level: VerificationLevel.NONE,
      phoneNumber: '',
      timestamp: Date.now(),
      error: 'Invalid code format (must be 6 digits)'
    };
  }

  // MOCK: Simulate verification delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // MOCK: Accept any code for Sprint 2
  console.log('[MOCK] Would verify code:', code, 'for phone:', phoneNumber);

  return {
    verified: true,
    level: VerificationLevel.PHONE,
    phoneNumber,
    timestamp: Date.now()
  };

  // Real implementation:
  // const { data, error } = await supabase.auth.verifyOtp({
  //   phone: phoneNumber,
  //   token: code,
  //   type: 'sms'
  // });
  // return {
  //   verified: !error && !!data.session,
  //   level: VerificationLevel.PHONE,
  //   phoneNumber,
  //   timestamp: Date.now(),
  //   error: error?.message
  // };
}

/**
 * Resend verification code
 * @param phoneNumber - Phone number to resend to
 * @returns Promise<{ sent: boolean, error?: string }>
 */
export async function resendVerificationCode(phoneNumber: string): Promise<{
  sent: boolean;
  error?: string;
}> {
  // Rate limit check (prevent spam)
  // TODO: Implement actual rate limiting

  return sendVerificationCode(phoneNumber);
}

/**
 * Phone verification limits and restrictions
 */
export const PHONE_VERIFICATION_CONFIG = {
  codeLength: 6,
  codeExpiryMinutes: 10,
  maxResendAttempts: 3,
  resendCooldownSeconds: 60,
  dailyEarningLimit: 10, // $10/day for Level 1
  allowedTaskTypes: ['sentiment', 'classification']
} as const;
