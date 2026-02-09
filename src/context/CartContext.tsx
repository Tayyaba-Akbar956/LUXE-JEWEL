'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, getProductById } from '@/data/products';

export interface CartItem {
    productId: number;
    quantity: number;
    product?: Product;
}

interface CartContextType {
    items: CartItem[];
    addItem: (productId: number, quantity?: number) => void;
    removeItem: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
    getItemCount: () => number;
    getSubtotal: () => number;
    isInCart: (productId: number) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'luxejewel-cart';

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load cart from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(CART_STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                // Validate and add product data
                const validItems = parsed.map((item: CartItem) => ({
                    ...item,
                    product: getProductById(item.productId),
                })).filter((item: CartItem) => item.product);
                setItems(validItems);
            }
        } catch (error) {
            console.error('Error loading cart:', error);
        }
        setIsLoaded(true);
    }, []);

    // Save cart to localStorage when items change
    useEffect(() => {
        if (isLoaded) {
            const toStore = items.map(({ productId, quantity }) => ({ productId, quantity }));
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(toStore));
        }
    }, [items, isLoaded]);

    const addItem = (productId: number, quantity: number = 1) => {
        const product = getProductById(productId);
        if (!product) return;

        setItems(prev => {
            const existing = prev.find(item => item.productId === productId);
            if (existing) {
                return prev.map(item =>
                    item.productId === productId
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prev, { productId, quantity, product }];
        });
    };

    const removeItem = (productId: number) => {
        setItems(prev => prev.filter(item => item.productId !== productId));
    };

    const updateQuantity = (productId: number, quantity: number) => {
        if (quantity <= 0) {
            removeItem(productId);
            return;
        }
        setItems(prev =>
            prev.map(item =>
                item.productId === productId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    const getItemCount = () => {
        return items.reduce((total, item) => total + item.quantity, 0);
    };

    const getSubtotal = () => {
        return items.reduce((total, item) => {
            const price = item.product?.price || 0;
            return total + price * item.quantity;
        }, 0);
    };

    const isInCart = (productId: number) => {
        return items.some(item => item.productId === productId);
    };

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                getItemCount,
                getSubtotal,
                isInCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
