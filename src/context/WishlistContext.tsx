'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, getProductById } from '@/data/products';

interface WishlistContextType {
    items: number[];
    addItem: (productId: number) => void;
    removeItem: (productId: number) => void;
    toggleItem: (productId: number) => void;
    isInWishlist: (productId: number) => boolean;
    getWishlistProducts: () => Product[];
    getItemCount: () => number;
    clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = 'luxejewel-wishlist';

export function WishlistProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<number[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load wishlist from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                // Validate that products exist
                const validItems = parsed.filter((id: number) => getProductById(id));
                setItems(validItems);
            }
        } catch (error) {
            console.error('Error loading wishlist:', error);
        }
        setIsLoaded(true);
    }, []);

    // Save wishlist to localStorage when items change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
        }
    }, [items, isLoaded]);

    const addItem = (productId: number) => {
        if (!getProductById(productId)) return;
        setItems(prev => {
            if (prev.includes(productId)) return prev;
            return [...prev, productId];
        });
    };

    const removeItem = (productId: number) => {
        setItems(prev => prev.filter(id => id !== productId));
    };

    const toggleItem = (productId: number) => {
        if (items.includes(productId)) {
            removeItem(productId);
        } else {
            addItem(productId);
        }
    };

    const isInWishlist = (productId: number) => {
        return items.includes(productId);
    };

    const getWishlistProducts = () => {
        return items
            .map(id => getProductById(id))
            .filter((p): p is Product => p !== undefined);
    };

    const getItemCount = () => {
        return items.length;
    };

    const clearWishlist = () => {
        setItems([]);
    };

    return (
        <WishlistContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                toggleItem,
                isInWishlist,
                getWishlistProducts,
                getItemCount,
                clearWishlist,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
}
