import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { WishlistProvider, useWishlist } from '@/context/WishlistContext';

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('WishlistContext', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <WishlistProvider>{children}</WishlistProvider>
  );

  beforeEach(() => {
    mockLocalStorage.clear();
  });

  it('provides initial empty wishlist', () => {
    const { result } = renderHook(() => useWishlist(), { wrapper });

    expect(result.current.items).toEqual([]);
    expect(result.current.getItemCount()).toBe(0);
  });

  it('adds items to wishlist', () => {
    const { result } = renderHook(() => useWishlist(), { wrapper });
    const productId = 1;

    act(() => {
      result.current.toggleItem(productId);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]).toBe(productId);
    expect(result.current.getItemCount()).toBe(1);
  });

  it('removes items from wishlist', () => {
    const { result } = renderHook(() => useWishlist(), { wrapper });
    const productId = 1;

    // Add item to wishlist
    act(() => {
      result.current.toggleItem(productId);
    });

    expect(result.current.items).toHaveLength(1);

    // Remove item from wishlist
    act(() => {
      result.current.toggleItem(productId);
    });

    expect(result.current.items).toHaveLength(0);
  });

  it('checks if item is in wishlist', () => {
    const { result } = renderHook(() => useWishlist(), { wrapper });
    const productId = 1;

    expect(result.current.isInWishlist(productId)).toBe(false);

    act(() => {
      result.current.toggleItem(productId);
    });

    expect(result.current.isInWishlist(productId)).toBe(true);

    act(() => {
      result.current.toggleItem(productId);
    });

    expect(result.current.isInWishlist(productId)).toBe(false);
  });

  it('persists wishlist to localStorage', () => {
    const { result } = renderHook(() => useWishlist(), { wrapper });
    const productId = 1;

    act(() => {
      result.current.toggleItem(productId);
    });

    const storedWishlist = localStorage.getItem('luxejewel-wishlist');
    expect(storedWishlist).not.toBeNull();

    const parsedWishlist = JSON.parse(storedWishlist!);
    expect(parsedWishlist).toEqual([productId]);
  });

  it('loads wishlist from localStorage on initialization', () => {
    const productId = 1;
    const wishlistData = [productId];
    localStorage.setItem('luxejewel-wishlist', JSON.stringify(wishlistData));

    const { result } = renderHook(() => useWishlist(), { wrapper });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]).toBe(productId);
  });

  it('handles multiple items in wishlist', () => {
    const { result } = renderHook(() => useWishlist(), { wrapper });
    const productId1 = 1;
    const productId2 = 2;
    const productId3 = 3;

    // Add multiple items
    act(() => {
      result.current.toggleItem(productId1);
      result.current.toggleItem(productId2);
      result.current.toggleItem(productId3);
    });

    expect(result.current.items).toHaveLength(3);
    expect(result.current.getItemCount()).toBe(3);
    expect(result.current.items).toContain(productId1);
    expect(result.current.items).toContain(productId2);
    expect(result.current.items).toContain(productId3);

    // Remove one item
    act(() => {
      result.current.toggleItem(productId2);
    });

    expect(result.current.items).toHaveLength(2);
    expect(result.current.getItemCount()).toBe(2);
    expect(result.current.items).toContain(productId1);
    expect(result.current.items).not.toContain(productId2);
    expect(result.current.items).toContain(productId3);
  });
});