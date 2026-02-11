'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/data/products';

interface WishlistItem {
    id: number;
    product?: Product;
}

interface WishlistContextType {
    items: number[];
    addItem: (product: Product) => void;
    removeItem: (productId: number) => void;
    toggleItem: (product: Product) => void;
    isInWishlist: (productId: number) => boolean;
    getWishlistProducts: () => Product[];
    getItemCount: () => number;
    clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = 'luxejewel-wishlist';

export function WishlistProvider({ children }: { children: ReactNode }) {
    const [ids, setIds] = useState<number[]>([]);
    const [products, setProducts] = useState<Record<number, Product>>({});
    const [isLoaded, setIsLoaded] = useState(false);

    // Load wishlist from localStorage on mount
    useEffect(() => {
        try {
            const storedIds = localStorage.getItem(WISHLIST_STORAGE_KEY);
            const storedProducts = localStorage.getItem(WISHLIST_STORAGE_KEY + '_products');

            if (storedIds) {
                setIds(JSON.parse(storedIds));
            }
            if (storedProducts) {
                setProducts(JSON.parse(storedProducts));
            }
        } catch (error) {
            console.error('Error loading wishlist:', error);
        }
        setIsLoaded(true);
    }, []);

    // Save wishlist to localStorage when items change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(ids));
            localStorage.setItem(WISHLIST_STORAGE_KEY + '_products', JSON.stringify(products));
        }
    }, [ids, products, isLoaded]);

    const addItem = (product: any) => {
        if (!product || !product.id) return;

        // Normalization: Ensure camelCase properties for consistent UI rendering
        const normalizedProduct: Product = {
            ...product,
            featuredImage: product.featuredImage || product.featured_image || '',
            comparePrice: product.comparePrice || product.compare_price || 0,
            shortDescription: product.shortDescription || product.short_description || product.description || '',
            ratingAverage: product.ratingAverage || product.rating_average || 0,
            ratingCount: product.ratingCount || product.rating_count || 0,
            inStock: product.inStock ?? product.in_stock ?? true,
        };

        setIds(prev => {
            if (prev.includes(product.id)) return prev;
            return [...prev, product.id];
        });

        setProducts(prev => ({
            ...prev,
            [product.id]: normalizedProduct
        }));
    };

    const removeItem = (productId: number) => {
        setIds(prev => prev.filter(id => id !== productId));
        // We keep the product in the products cache for performance/offline but it's not in the 'list'
    };

    const toggleItem = (product: Product) => {
        if (ids.includes(product.id)) {
            removeItem(product.id);
        } else {
            addItem(product);
        }
    };

    const isInWishlist = (productId: number) => {
        return ids.includes(productId);
    };

    const getWishlistProducts = () => {
        return ids
            .map(id => products[id])
            .filter((p): p is Product => p !== undefined);
    };

    const getItemCount = () => {
        return getWishlistProducts().length;
    };

    const clearWishlist = () => {
        setIds([]);
        setProducts({});
    };

    return (
        <WishlistContext.Provider
            value={{
                items: ids,
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
