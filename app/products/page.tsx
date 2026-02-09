'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { products } from '@/data/products';

export default function ProductsPage() {
    const [sortBy, setSortBy] = useState('featured');
    const [filterCategory, setFilterCategory] = useState('all');

    const filteredProducts = products.filter(p =>
        filterCategory === 'all' || p.category === filterCategory
    );

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortBy) {
            case 'price-low': return a.price - b.price;
            case 'price-high': return b.price - a.price;
            case 'rating': return b.ratingAverage - a.ratingAverage;
            case 'newest': return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
            default: return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
        }
    });

    return (
        <div className="flex min-h-screen flex-col bg-luxury-black">
            <Header />
            <main className="flex-grow">
                {/* Hero */}
                <section className="relative h-64 flex items-center justify-center overflow-hidden">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1920&q=80)' }}
                    />
                    <div className="absolute inset-0 bg-luxury-black/70" />
                    <div className="relative text-center">
                        <h1 className="font-display text-5xl text-champagne-200">All Jewelry</h1>
                        <p className="font-heading text-sm uppercase tracking-[0.2em] text-gold-500 mt-2">
                            {products.length} Exquisite Pieces
                        </p>
                    </div>
                </section>

                {/* Products */}
                <section className="py-12">
                    <div className="container mx-auto px-4">
                        {/* Filters & Sort */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-gold-500/20">
                            {/* Category Filter */}
                            <div className="flex flex-wrap gap-2">
                                {['all', 'rings', 'necklaces', 'earrings', 'bracelets'].map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setFilterCategory(cat)}
                                        className={`px-4 py-2 font-heading text-xs uppercase tracking-wider rounded-sm transition-all ${filterCategory === cat
                                                ? 'bg-gold-500 text-luxury-black'
                                                : 'border border-gold-500/30 text-silver-400 hover:border-gold-500 hover:text-gold-500'
                                            }`}
                                    >
                                        {cat === 'all' ? 'All' : cat}
                                    </button>
                                ))}
                            </div>

                            {/* Sort */}
                            <div className="flex items-center gap-3">
                                <span className="text-silver-500 text-sm">Sort:</span>
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
                        </div>

                        <p className="text-silver-500 text-sm mb-6">
                            Showing {sortedProducts.length} products
                        </p>

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
