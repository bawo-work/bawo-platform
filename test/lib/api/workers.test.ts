// Worker API Tests

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { calculateWorkerTier } from '@/lib/api/workers';

describe('Worker API', () => {
  describe('calculateWorkerTier', () => {
    it('should return newcomer for new workers', () => {
      const tier = calculateWorkerTier(5, 80);

      expect(tier).toBe('newcomer');
    });

    it('should return bronze for 10+ tasks with 75%+ accuracy', () => {
      const tier = calculateWorkerTier(15, 80);

      expect(tier).toBe('bronze');
    });

    it('should return silver for 100+ tasks with 85%+ accuracy', () => {
      const tier = calculateWorkerTier(150, 88);

      expect(tier).toBe('silver');
    });

    it('should return gold for 500+ tasks with 90%+ accuracy', () => {
      const tier = calculateWorkerTier(600, 92);

      expect(tier).toBe('gold');
    });

    it('should return expert for 1000+ tasks with 95%+ accuracy', () => {
      const tier = calculateWorkerTier(1200, 96);

      expect(tier).toBe('expert');
    });

    it('should not upgrade if accuracy too low', () => {
      const tier = calculateWorkerTier(1000, 70); // Tasks high but accuracy low

      expect(tier).toBe('newcomer'); // Below 75% threshold
    });

    it('should not upgrade if tasks too low', () => {
      const tier = calculateWorkerTier(50, 98); // Accuracy high but tasks low

      expect(tier).toBe('bronze'); // Max bronze with 50 tasks
    });
  });
});
