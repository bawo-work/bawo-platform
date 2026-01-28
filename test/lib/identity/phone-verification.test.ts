// Phone Verification Tests

import { describe, it, expect } from 'vitest';
import {
  isValidPhoneNumber,
  formatPhoneNumber,
  sendVerificationCode,
  verifyPhoneCode
} from '@/lib/identity/phone-verification';
import { VerificationLevel } from '@/lib/identity/types';

describe('Phone Verification', () => {
  describe('isValidPhoneNumber', () => {
    it('should validate Kenyan phone number', () => {
      const validKenyan = '+254712345678';

      expect(isValidPhoneNumber(validKenyan)).toBe(true);
    });

    it('should validate international phone number', () => {
      const validInternational = '+14155551234';

      expect(isValidPhoneNumber(validInternational)).toBe(true);
    });

    it('should reject phone without country code', () => {
      const invalid = '0712345678';

      expect(isValidPhoneNumber(invalid)).toBe(false);
    });

    it('should reject invalid format', () => {
      const invalid = 'not-a-phone';

      expect(isValidPhoneNumber(invalid)).toBe(false);
    });
  });

  describe('formatPhoneNumber', () => {
    it('should format phone number hiding middle digits', () => {
      const phone = '+254712345678';
      const formatted = formatPhoneNumber(phone);

      expect(formatted).toContain('678'); // Last 3 digits visible
      expect(formatted).toContain('X'); // Middle digits masked
    });

    it('should handle short phone numbers', () => {
      const shortPhone = '+123';
      const formatted = formatPhoneNumber(shortPhone);

      // Empty strings have empty formatting
      expect(formatted).toContain('123');
    });
  });

  describe('sendVerificationCode', () => {
    it('should send code to valid phone number', async () => {
      const phone = '+254712345678';

      const result = await sendVerificationCode(phone);

      expect(result.sent).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject invalid phone number', async () => {
      const invalidPhone = 'invalid';

      const result = await sendVerificationCode(invalidPhone);

      expect(result.sent).toBe(false);
      expect(result.error).toBe('Invalid phone number format');
    });
  });

  describe('verifyPhoneCode', () => {
    it('should verify valid code (mock accepts any code)', async () => {
      const phone = '+254712345678';
      const code = '123456';

      const result = await verifyPhoneCode(phone, code);

      expect(result.verified).toBe(true);
      expect(result.level).toBe(VerificationLevel.PHONE);
      expect(result.phoneNumber).toBe(phone);
    });

    it('should reject invalid phone number', async () => {
      const invalidPhone = 'invalid';
      const code = '123456';

      const result = await verifyPhoneCode(invalidPhone, code);

      expect(result.verified).toBe(false);
      expect(result.error).toBe('Invalid phone number');
    });

    it('should reject invalid code format', async () => {
      const phone = '+254712345678';
      const invalidCode = '12'; // Too short

      const result = await verifyPhoneCode(phone, invalidCode);

      expect(result.verified).toBe(false);
      expect(result.error).toContain('Invalid code format');
    });
  });
});
