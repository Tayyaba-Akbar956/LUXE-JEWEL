import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from '@/context/CartContext';
import { Product, products } from '@/data/products';

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

describe('CartContext', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <CartProvider>{children}</CartProvider>
  );

  beforeEach(() => {
    mockLocalStorage.clear();
  });

  it('provides initial empty cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    expect(result.current.items).toEqual([]);
    expect(result.current.getItemCount()).toBe(0);
    expect(result.current.getSubtotal()).toBe(0);
  });

  it('adds items to cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    const productId = 1;
    const product = products.find(p => p.id === productId);

    act(() => {
      result.current.addItem(productId);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]).toEqual({
      productId,
      quantity: 1,
      product
    });
    expect(result.current.getItemCount()).toBe(1);
  });

  it('updates item quantity', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    const productId = 1;

    act(() => {
      result.current.addItem(productId, 2);
    });

    expect(result.current.items[0].quantity).toBe(2);

    act(() => {
      result.current.updateQuantity(productId, 5);
    });

    expect(result.current.items[0].quantity).toBe(5);
  });

  it('removes items from cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    const productId = 1;

    act(() => {
      result.current.addItem(productId);
    });

    expect(result.current.items).toHaveLength(1);

    act(() => {
      result.current.removeItem(productId);
    });

    expect(result.current.items).toHaveLength(0);
  });

  it('clears the entire cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    const productId1 = 1;
    const productId2 = 2;

    act(() => {
      result.current.addItem(productId1);
      result.current.addItem(productId2);
    });

    expect(result.current.items).toHaveLength(2);

    act(() => {
      result.current.clearCart();
    });

    expect(result.current.items).toHaveLength(0);
  });

  it('calculates subtotal correctly', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    const productId = 1;
    const product = products.find(p => p.id === productId)!;

    act(() => {
      result.current.addItem(productId, 2);
    });

    const expectedSubtotal = product.price * 2;
    expect(result.current.getSubtotal()).toBe(expectedSubtotal);
  });

  it('checks if item is in cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    const productId = 1;

    expect(result.current.isInCart(productId)).toBe(false);

    act(() => {
      result.current.addItem(productId);
    });

    expect(result.current.isInCart(productId)).toBe(true);
  });

  it('persists cart to localStorage', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    const productId = 1;

    act(() => {
      result.current.addItem(productId, 3);
    });

    const storedCart = localStorage.getItem('luxejewel-cart');
    expect(storedCart).not.toBeNull();

    const parsedCart = JSON.parse(storedCart!);
    expect(parsedCart).toEqual([{ productId, quantity: 3 }]);
  });

  it('loads cart from localStorage on initialization', () => {
    const productId = 1;
    const cartData = [{ productId, quantity: 2 }];
    localStorage.setItem('luxejewel-cart', JSON.stringify(cartData));

    const { result } = renderHook(() => useCart(), { wrapper });

    // Wait for the useEffect to load the cart
    act(() => {
      // Simulate the useEffect running
      vi.runAllTimers();
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].productId).toBe(productId);
    expect(result.current.items[0].quantity).toBe(2);
  });
});