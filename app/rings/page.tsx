'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { supabase } from '@/lib/supabase';

export default function RingsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [sortBy, setSortBy] = useState('featured');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRings = async () => {
            setLoading(true);

            // First get the rings category ID
            const { data: catData } = await supabase.from('categories').select('id').eq('slug', 'rings').single();

            if (catData) {
                let query = supabase.from('products').select('*').eq('category_id', catData.id).eq('is_active', true);

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
            }
            setLoading(false);
        };

        fetchRings();
    }, [sortBy]);

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
                        <h1 className="font-display text-5xl text-champagne-200">Rings Collection</h1>
                        <p className="font-heading text-sm uppercase tracking-[0.2em] text-gold-500 mt-2">
                            {loading ? '...' : products.length} Exquisite Pieces
                        </p>
                    </div>
                </section>

                {/* Products */}
                <section className="py-12">
                    <div className="container mx-auto px-4">
                        {/* Sort Controls */}
                        <div className="flex justify-between items-center mb-8 pb-6 border-b border-gold-500/20">
                            <p className="text-silver-500 text-sm">
                                {loading ? 'Loading products...' : `Showing ${products.length} products`}
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
                            {loading ? (
                                [1, 2, 3, 4].map(i => (
                                    <div key={i} className="aspect-[4/5] bg-luxury-dark/50 animate-pulse rounded-lg border border-gold-500/10" />
                                ))
                            ) : products.length === 0 ? (
                                <div className="col-span-full text-center py-20 text-silver-500">No rings found in this collection.</div>
                            ) : products.map(product => (
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
