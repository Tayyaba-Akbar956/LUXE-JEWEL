'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';

export default function WishlistPage() {
    const { getWishlistProducts, clearWishlist, getItemCount } = useWishlist();
    const { user, loading } = useAuth();
    const products = getWishlistProducts();

    if (loading) {
        return (
            <div className="flex min-h-screen flex-col bg-luxury-black">
                <Header />
                <main className="flex-grow flex items-center justify-center">
                    <div className="animate-spin h-8 w-8 border-4 border-gold-500 border-t-transparent rounded-full" />
                </main>
                <Footer />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex min-h-screen flex-col bg-luxury-black">
                <Header />
                <main className="flex-grow flex items-center justify-center">
                    <div className="text-center p-8">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full border border-gold-500/30 flex items-center justify-center">
                            <svg className="w-12 h-12 text-gold-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <h1 className="font-display text-3xl text-champagne-200 mb-4">Sign In Required</h1>
                        <p className="text-silver-500 mb-6">Please sign in to view your wishlist.</p>
                        <Link href="/login" className="btn-luxury">Sign In</Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="flex min-h-screen flex-col bg-luxury-black">
                <Header />
                <main className="flex-grow flex items-center justify-center">
                    <div className="text-center px-4">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full border border-gold-500/30 flex items-center justify-center">
                            <svg className="w-12 h-12 text-gold-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <h1 className="font-display text-3xl text-champagne-200 mb-2">Your Wishlist is Empty</h1>
                        <p className="text-silver-500 mb-8">Save your favorite pieces to view them later.</p>
                        <Link href="/products" className="btn-luxury">
                            Explore Collection
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col bg-luxury-black">
            <Header />
            <main className="flex-grow">
                <div className="container mx-auto px-4 py-12">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="font-display text-4xl text-champagne-200">Wishlist</h1>
                            <p className="text-silver-500 mt-1">{getItemCount()} saved items</p>
                        </div>
                        <button
                            onClick={clearWishlist}
                            className="text-sm text-silver-500 hover:text-red-500 transition-colors"
                        >
                            Clear All
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
