// Self Protocol SDK Integration (MOCK for Sprint 2)

import type { SelfVerificationResult } from './types';
import { VerificationLevel } from './types';

/**
 * MOCK IMPLEMENTATION - Replace with actual Self Protocol SDK when available
 *
 * Self Protocol provides ZK-proof based identity verification using NFC passport scanning.
 * This mock simulates the verification flow with a 2-second delay to mimic NFC scan time.
 *
 * TODO: Replace with @selfprotocol/sdk when SDK is publicly available
 * TODO: Implement actual NFC passport scanning
 * TODO: Implement actual ZK proof generation
 *
 * Real implementation would:
 * 1. Open Self Protocol mobile app via deep link
 * 2. User scans passport NFC chip
 * 3. Generate ZK proof (no PII transmitted)
 * 4. Return DID and verification status
 */

/**
 * Initiates Self Protocol verification flow
 *
 * @param walletAddress - User's wallet address to link verification to
 * @returns Promise<SelfVerificationResult>
 */
export async function verifySelfProtocol(
  walletAddress: string
): Promise<SelfVerificationResult> {
  // MOCK: Validate wallet address format
  if (!walletAddress || !/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
    return {
      did: '',
      verified: false,
      level: VerificationLevel.NONE,
      timestamp: Date.now(),
      error: 'Invalid wallet address'
    };
  }

  // MOCK: Simulate NFC scan and ZK proof generation
  // Real implementation would open Self app and wait for callback
  return new Promise((resolve) => {
    setTimeout(() => {
      // MOCK: Generate fake DID
      const mockDid = `did:self:mock:${Date.now()}:${walletAddress.slice(2, 8)}`;

      resolve({
        did: mockDid,
        verified: true,
        level: VerificationLevel.SELF_PROTOCOL,
        timestamp: Date.now()
      });
    }, 2000); // Simulate 2-second verification time
  });
}

/**
 * Checks if Self Protocol app is installed on device
 * @returns Promise<boolean>
 */
export async function checkSelfProtocolAvailability(): Promise<boolean> {
  // MOCK: Always return true for development
  // Real implementation would check for Self app installation
  // TODO: Implement actual app detection via deep link check
  return Promise.resolve(true);
}

/**
 * Opens Self Protocol app for verification
 * @param redirectUrl - URL to redirect back to after verification
 */
export function openSelfProtocolApp(redirectUrl: string): void {
  // MOCK: Log the deep link that would be used
  // Real implementation would open Self app with deep link
  // TODO: Implement actual deep link navigation
  console.log('[MOCK] Would open Self Protocol app with redirect:', redirectUrl);

  // In real implementation:
  // window.location.href = `self://verify?redirect=${encodeURIComponent(redirectUrl)}`;
}

/**
 * Validates a Self Protocol DID format
 * @param did - DID to validate
 * @returns boolean
 */
export function isValidSelfDid(did: string): boolean {
  // MOCK: Accept mock DIDs and real format
  // Real DID format: did:self:<network>:<identifier>
  return /^did:self:(mock:|[a-z]+:)[a-zA-Z0-9-]+$/.test(did);
}

/**
 * Retrieves verification metadata from DID (if publicly available)
 * @param did - Self Protocol DID
 * @returns Promise<{ verified: boolean, timestamp?: number }>
 */
export async function getVerificationMetadata(did: string): Promise<{
  verified: boolean;
  timestamp?: number;
}> {
  // MOCK: Return verified for any valid DID
  // Real implementation would query Self Protocol network
  // TODO: Implement actual DID resolution
  if (!isValidSelfDid(did)) {
    return { verified: false };
  }

  return Promise.resolve({
    verified: true,
    timestamp: Date.now()
  });
}

/**
 * Estimated time for verification flow
 */
export const SELF_VERIFICATION_TIMEOUT = 60000; // 60 seconds max
export const SELF_VERIFICATION_TYPICAL_TIME = 10000; // 10 seconds typical
