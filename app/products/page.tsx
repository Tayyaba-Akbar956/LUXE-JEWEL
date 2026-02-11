'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { supabase } from '@/lib/supabase';

export default function ProductsPage() {
    const [sortBy, setSortBy] = useState('featured');
    const [filterCategory, setFilterCategory] = useState('all');
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            // Fetch categories
            const { data: catData } = await supabase.from('categories').select('*');
            if (catData) setCategories(catData);

            // Fetch products
            let query = supabase.from('products').select('*').eq('is_active', true);

            if (filterCategory !== 'all') {
                const category = catData?.find(c => c.slug === filterCategory);
                if (category) {
                    query = query.eq('category_id', category.id);
                }
            }

            // Apply sorting
            switch (sortBy) {
                case 'price-low': query = query.order('price', { ascending: true }); break;
                case 'price-high': query = query.order('price', { ascending: false }); break;
                case 'rating': query = query.order('rating_average', { ascending: false }); break;
                case 'newest': query = query.order('created_at', { ascending: false }); break;
                default: query = query.order('is_featured', { ascending: false });
            }

            const { data: prodData } = await query;
            if (prodData) setProducts(prodData);

            setLoading(false);
        };

        fetchData();
    }, [filterCategory, sortBy]);

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
                                <button
                                    onClick={() => setFilterCategory('all')}
                                    className={`px-4 py-2 font-heading text-xs uppercase tracking-wider rounded-sm transition-all ${filterCategory === 'all'
                                        ? 'bg-gold-500 text-luxury-black'
                                        : 'border border-gold-500/30 text-silver-400 hover:border-gold-500 hover:text-gold-500'
                                        }`}
                                >
                                    All
                                </button>
                                {categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setFilterCategory(cat.slug)}
                                        className={`px-4 py-2 font-heading text-xs uppercase tracking-wider rounded-sm transition-all ${filterCategory === cat.slug
                                            ? 'bg-gold-500 text-luxury-black'
                                            : 'border border-gold-500/30 text-silver-400 hover:border-gold-500 hover:text-gold-500'
                                            }`}
                                    >
                                        {cat.name}
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

                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                    <div key={i} className="aspect-[4/5] bg-luxury-dark/50 animate-pulse rounded-lg border border-gold-500/10" />
                                ))}
                            </div>
                        ) : (
                            <>
                                <p className="text-silver-500 text-sm mb-6">
                                    Showing {products.length} products
                                </p>

                                {/* Product Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {products.map(product => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
