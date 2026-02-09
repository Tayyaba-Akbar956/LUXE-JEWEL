'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { getProductsByCategory, Product } from '@/data/products';

export default function RingsPage() {
    const products = getProductsByCategory('rings');
    const [sortBy, setSortBy] = useState('featured');

    const sortedProducts = [...products].sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'rating':
                return b.ratingAverage - a.ratingAverage;
            case 'newest':
                return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
            default:
                return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
        }
    });

    return (
        <div className="flex min-h-screen flex-col bg-luxury-black">
            <Header />
            <main className="flex-grow">
                {/* Hero Banner */}
                <section className="relative h-64 flex items-center justify-center overflow-hidden">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1920&q=80)' }}
                    />
                    <div className="absolute inset-0 bg-luxury-black/70" />
                    <div className="relative text-center">
                        <h1 className="font-display text-5xl text-champagne-200">Rings</h1>
                        <p className="font-heading text-sm uppercase tracking-[0.2em] text-gold-500 mt-2">
                            {products.length} Exquisite Pieces
                        </p>
                    </div>
                </section>

                {/* Products */}
                <section className="py-12">
                    <div className="container mx-auto px-4">
                        {/* Sort Controls */}
                        <div className="flex justify-between items-center mb-8 pb-6 border-b border-gold-500/20">
                            <p className="text-silver-500 text-sm">
                                Showing {sortedProducts.length} products
                            </p>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="input-luxury text-sm w-48"
                            >
                                <option value="featured">Featured</option>
                                <option value="newest">Newest</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="rating">Highest Rated</option>
                            </select>
                        </div>

                        {/* Product Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {sortedProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
