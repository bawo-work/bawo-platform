// MiniPay Wallet Detection Tests

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  detectMiniPayWallet,
  formatWalletAddress,
  isValidEthereumAddress,
  isMiniPayBrowser
} from '@/lib/wallet/minipay';

describe('MiniPay Wallet Detection', () => {
  beforeEach(() => {
    // Reset window.ethereum before each test
    if (global.window) {
      delete (global.window as any).ethereum;
    }
  });

  describe('detectMiniPayWallet', () => {
    it('should return null address on server-side', async () => {
      // @ts-ignore - simulate server-side
      delete global.window;

      const result = await detectMiniPayWallet();

      expect(result.address).toBeNull();
      expect(result.isMiniPay).toBe(false);
      expect(result.error).toBe('Not in browser environment');
    });

    it('should return null when no ethereum provider', async () => {
      // Mock window without ethereum
      global.window = {} as any;

      const result = await detectMiniPayWallet();

      expect(result.address).toBeNull();
      expect(result.isMiniPay).toBe(false);
      expect(result.error).toBe('No Ethereum provider detected');
    });

    it('should return null when not MiniPay', async () => {
      // Mock ethereum provider without isMiniPay flag
      global.window = {
        ethereum: {
          request: vi.fn(),
          isMiniPay: false
        }
      } as any;

      const result = await detectMiniPayWallet();

      expect(result.address).toBeNull();
      expect(result.isMiniPay).toBe(false);
      expect(result.error).toBe('Not MiniPay browser');
    });

    it('should detect MiniPay wallet and return address', async () => {
      const mockAddress = '0x1234567890abcdef1234567890abcdef12345678';

      // Mock MiniPay provider
      global.window = {
        ethereum: {
          isMiniPay: true,
          request: vi.fn().mockResolvedValue([mockAddress])
        }
      } as any;

      const result = await detectMiniPayWallet();

      expect(result.address).toBe(mockAddress);
      expect(result.isMiniPay).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should handle empty accounts array', async () => {
      // Mock MiniPay provider with no accounts
      global.window = {
        ethereum: {
          isMiniPay: true,
          request: vi.fn()
            .mockResolvedValueOnce([]) // eth_accounts returns empty
            .mockResolvedValueOnce(['0x123']) // eth_requestAccounts returns address
        }
      } as any;

      const result = await detectMiniPayWallet();

      expect(result.address).toBe('0x123');
      expect(result.isMiniPay).toBe(true);
    });
  });

  describe('formatWalletAddress', () => {
    it('should format full address to show last 6 chars', () => {
      const address = '0x1234567890abcdef1234567890abcdef12345678';
      const formatted = formatWalletAddress(address);

      expect(formatted).toBe('0x...345678');
    });

    it('should return address unchanged if too short', () => {
      const shortAddress = '0x123';
      const formatted = formatWalletAddress(shortAddress);

      expect(formatted).toBe(shortAddress);
    });
  });

  describe('isValidEthereumAddress', () => {
    it('should validate correct Ethereum address', () => {
      const validAddress = '0x1234567890abcdef1234567890abcdef12345678';

      expect(isValidEthereumAddress(validAddress)).toBe(true);
    });

    it('should reject address without 0x prefix', () => {
      const invalidAddress = '1234567890abcdef1234567890abcdef12345678';

      expect(isValidEthereumAddress(invalidAddress)).toBe(false);
    });

    it('should reject address with wrong length', () => {
      const invalidAddress = '0x1234567890abcdef';

      expect(isValidEthereumAddress(invalidAddress)).toBe(false);
    });

    it('should reject address with invalid characters', () => {
      const invalidAddress = '0x1234567890abcdef1234567890abcdef1234567g';

      expect(isValidEthereumAddress(invalidAddress)).toBe(false);
    });
  });

  describe('isMiniPayBrowser', () => {
    it('should return true when MiniPay detected', () => {
      global.window = {
        ethereum: { isMiniPay: true }
      } as any;

      expect(isMiniPayBrowser()).toBe(true);
    });

    it('should return false when not MiniPay', () => {
      global.window = {
        ethereum: { isMiniPay: false }
      } as any;

      expect(isMiniPayBrowser()).toBe(false);
    });

    it('should return false on server-side', () => {
      // @ts-ignore
      delete global.window;

      expect(isMiniPayBrowser()).toBe(false);
    });
  });
});
