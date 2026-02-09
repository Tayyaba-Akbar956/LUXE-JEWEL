'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { getProductBySlug, products } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

export default function ProductDetailPage() {
    const params = useParams();
    const slug = params?.slug as string;
    const product = slug ? getProductBySlug(slug) : undefined;

    const { addItem, isInCart } = useCart();
    const { toggleItem, isInWishlist } = useWishlist();

    if (!product) {
        return (
            <div className="flex min-h-screen flex-col bg-luxury-black">
                <Header />
                <main className="flex-grow flex items-center justify-center">
                    <div className="text-center px-4">
                        <h1 className="font-display text-3xl text-champagne-200 mb-4">Product Not Found</h1>
                        <Link href="/products" className="btn-luxury">
                            Back to Shop
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const inCart = isInCart(product.id);
    const inWishlist = isInWishlist(product.id);

    // Get related products
    const relatedProducts = products
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 4);

    const discount = product.comparePrice
        ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
        : 0;

    return (
        <div className="flex min-h-screen flex-col bg-luxury-black">
            <Header />
            <main className="flex-grow">
                {/* Breadcrumb */}
                <div className="container mx-auto px-4 py-4">
                    <nav className="text-sm text-silver-500">
                        <Link href="/" className="hover:text-gold-500">Home</Link>
                        <span className="mx-2">/</span>
                        <Link href="/products" className="hover:text-gold-500">Shop</Link>
                        <span className="mx-2">/</span>
                        <Link href={`/${product.category}`} className="hover:text-gold-500 capitalize">{product.category}</Link>
                        <span className="mx-2">/</span>
                        <span className="text-champagne-200">{product.name}</span>
                    </nav>
                </div>

                {/* Product Section */}
                <section className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Images */}
                        <div className="space-y-4">
                            <div className="relative aspect-square rounded-lg overflow-hidden border border-gold-500/20">
                                <Image
                                    src={product.featuredImage}
                                    alt={product.name}
                                    fill
                                    priority
                                    className="object-cover"
                                />
                                {product.isNew && (
                                    <span className="absolute top-4 left-4 px-3 py-1 bg-gold-500 text-luxury-black text-xs font-heading uppercase tracking-wider">
                                        New
                                    </span>
                                )}
                                {product.isSale && discount > 0 && (
                                    <span className="absolute top-4 right-4 px-3 py-1 bg-red-600 text-white text-xs font-heading uppercase tracking-wider">
                                        -{discount}% Off
                                    </span>
                                )}
                            </div>
                            {product.images.length > 1 && (
                                <div className="grid grid-cols-4 gap-4">
                                    {product.images.map((img, i) => (
                                        <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-gold-500/20 hover:border-gold-500 transition-colors cursor-pointer">
                                            <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Details */}
                        <div>
                            <h1 className="font-display text-4xl text-champagne-200">{product.name}</h1>

                            {/* Rating */}
                            <div className="flex items-center gap-3 mt-4">
                                <div className="flex items-center gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <svg
                                            key={i}
                                            className={`h-5 w-5 ${i < Math.floor(product.ratingAverage) ? 'text-gold-500' : 'text-silver-700'}`}
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <span className="text-silver-500 text-sm">{product.ratingAverage} ({product.ratingCount} reviews)</span>
                            </div>

                            {/* Price */}
                            <div className="mt-6 flex items-baseline gap-3">
                                <span className="font-display text-4xl text-gold-500">${product.price.toLocaleString()}</span>
                                {product.comparePrice && product.comparePrice > product.price && (
                                    <span className="text-xl text-silver-600 line-through">${product.comparePrice.toLocaleString()}</span>
                                )}
                            </div>

                            {/* Description */}
                            <p className="mt-6 text-silver-400 leading-relaxed">{product.description}</p>

                            {/* Details */}
                            <div className="mt-8 space-y-3">
                                <div className="flex justify-between py-3 border-b border-gold-500/10">
                                    <span className="text-silver-500">Material</span>
                                    <span className="text-champagne-200">{product.material}</span>
                                </div>
                                {product.gemstone && (
                                    <div className="flex justify-between py-3 border-b border-gold-500/10">
                                        <span className="text-silver-500">Gemstone</span>
                                        <span className="text-champagne-200">{product.gemstone}</span>
                                    </div>
                                )}
                                <div className="flex justify-between py-3 border-b border-gold-500/10">
                                    <span className="text-silver-500">Weight</span>
                                    <span className="text-champagne-200">{product.weight}</span>
                                </div>
                                <div className="flex justify-between py-3 border-b border-gold-500/10">
                                    <span className="text-silver-500">Availability</span>
                                    <span className={product.inStock ? 'text-green-500' : 'text-red-500'}>
                                        {product.inStock ? `In Stock (${product.stockQuantity} left)` : 'Out of Stock'}
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-8 flex gap-4">
                                <button
                                    onClick={() => addItem(product.id)}
                                    disabled={inCart || !product.inStock}
                                    className={`flex-1 py-4 font-heading text-sm uppercase tracking-widest ${inCart
                                        ? 'bg-silver-700 text-silver-400 cursor-not-allowed'
                                        : !product.inStock
                                            ? 'bg-silver-800 text-silver-500 cursor-not-allowed'
                                            : 'btn-luxury'
                                        }`}
                                >
                                    {inCart ? 'In Cart' : !product.inStock ? 'Out of Stock' : 'Add to Cart'}
                                </button>
                                <button
                                    onClick={() => toggleItem(product.id)}
                                    className={`w-14 h-14 flex items-center justify-center border rounded ${inWishlist
                                        ? 'bg-gold-500 border-gold-500 text-luxury-black'
                                        : 'border-gold-500/30 text-silver-400 hover:border-gold-500 hover:text-gold-500'
                                        } transition-all`}
                                >
                                    <svg className="w-6 h-6" fill={inWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </button>
                            </div>

                            {/* Trust */}
                            <div className="mt-8 grid grid-cols-3 gap-4">
                                {[
                                    { icon: '🚚', text: 'Free Shipping' },
                                    { icon: '↩️', text: '30-Day Returns' },
                                    { icon: '💎', text: 'GIA Certified' },
                                ].map((item, i) => (
                                    <div key={i} className="text-center p-3 border border-gold-500/10 rounded">
                                        <span className="text-xl">{item.icon}</span>
                                        <p className="text-xs text-silver-500 mt-1">{item.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <section className="container mx-auto px-4 py-16 border-t border-gold-500/10">
                        <h2 className="font-display text-3xl text-champagne-200 mb-8">You May Also Like</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map(p => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </section>
                )}
            </main>
            <Footer />
        </div>
    );
}
