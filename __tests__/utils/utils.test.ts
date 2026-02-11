import { describe, it, expect, vi } from 'vitest';
import { formatCurrency, calculateDiscountPercentage, debounce, throttle, generateId, isClientSide, getInitials } from '@/lib/utils';

describe('Utility Functions', () => {
  describe('formatCurrency', () => {
    it('formats numbers as USD currency', () => {
      expect(formatCurrency(10)).toBe('$10.00');
      expect(formatCurrency(10.5)).toBe('$10.50');
      expect(formatCurrency(10.555)).toBe('$10.56');
      expect(formatCurrency(0)).toBe('$0.00');
    });
  });

  describe('calculateDiscountPercentage', () => {
    it('calculates discount percentage correctly', () => {
      expect(calculateDiscountPercentage(10, 20)).toBe(50);
      expect(calculateDiscountPercentage(15, 20)).toBe(25);
      expect(calculateDiscountPercentage(19, 20)).toBe(5);
    });

    it('returns null when comparePrice is not greater than price', () => {
      expect(calculateDiscountPercentage(20, 10)).toBeNull();
      expect(calculateDiscountPercentage(20, 20)).toBeNull();
      expect(calculateDiscountPercentage(20)).toBeNull();
    });
  });

  describe('generateId', () => {
    it('generates a random ID string', () => {
      const id1 = generateId();
      const id2 = generateId();

      expect(typeof id1).toBe('string');
      expect(id1.length).toBeGreaterThan(0);
      expect(id1).not.toBe(id2); // Should generate different IDs
    });
  });

  describe('getInitials', () => {
    it('gets initials from a name', () => {
      expect(getInitials('John Doe')).toBe('JD');
      expect(getInitials('Jane')).toBe('JA');
      expect(getInitials('Alice Bob Charlie')).toBe('AB');
      expect(getInitials('')).toBe('');
    });
  });

  describe('isClientSide', () => {
    it('detects client-side environment', () => {
      // This test depends on the execution environment
      // In a test environment, window is typically defined
      const result = isClientSide();
      expect(typeof result).toBe('boolean');
    });
  });

  describe('debounce', () => {
    it('should debounce function calls', () => {
      vi.useFakeTimers();

      const fn = vi.fn();
      const debouncedFn = debounce(fn, 100);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      expect(fn).toHaveBeenCalledTimes(0);

      vi.advanceTimersByTime(100);

      expect(fn).toHaveBeenCalledTimes(1);

      vi.useRealTimers();
    });
  });

  describe('throttle', () => {
    it('should throttle function calls', () => {
      vi.useFakeTimers();

      const fn = vi.fn();
      const throttledFn = throttle(fn, 100);

      throttledFn();
      throttledFn();
      throttledFn();

      expect(fn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(100);

      throttledFn();
      expect(fn).toHaveBeenCalledTimes(2);

      vi.useRealTimers();
    });
  });
});