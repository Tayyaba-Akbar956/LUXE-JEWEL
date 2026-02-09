'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
    const { items, removeItem, updateQuantity, getSubtotal, clearCart, getItemCount } = useCart();

    const subtotal = getSubtotal();
    const shipping = subtotal > 500 ? 0 : 25;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    if (items.length === 0) {
        return (
            <div className="flex min-h-screen flex-col bg-luxury-black">
                <Header />
                <main className="flex-grow flex items-center justify-center">
                    <div className="text-center px-4">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full border border-gold-500/30 flex items-center justify-center">
                            <svg className="w-12 h-12 text-gold-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <h1 className="font-display text-3xl text-champagne-200 mb-2">Your Cart is Empty</h1>
                        <p className="text-silver-500 mb-8">Discover our exquisite collection and find your perfect piece.</p>
                        <Link href="/products" className="btn-luxury">
                            Continue Shopping
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
                    <h1 className="font-display text-4xl text-champagne-200 mb-2">Shopping Cart</h1>
                    <p className="text-silver-500 mb-8">{getItemCount()} items in your cart</p>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-6">
                            {items.map(item => (
                                <div key={item.productId} className="card-luxury p-6 flex gap-6">
                                    {/* Product Image */}
                                    <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                                        <Image
                                            src={item.product?.featuredImage || ''}
                                            alt={item.product?.name || ''}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    {/* Product Details */}
                                    <div className="flex-grow">
                                        <Link
                                            href={`/products/${item.product?.slug}`}
                                            className="font-heading text-lg text-champagne-200 hover:text-gold-500 transition-colors"
                                        >
                                            {item.product?.name}
                                        </Link>
                                        <p className="text-xs text-silver-500 mt-1">{item.product?.material}</p>
                                        <p className="text-gold-500 font-display text-lg mt-2">
                                            ${item.product?.price.toLocaleString()}
                                        </p>
                                    </div>

                                    {/* Quantity Controls */}
                                    <div className="flex flex-col items-end justify-between">
                                        <button
                                            onClick={() => removeItem(item.productId)}
                                            className="text-silver-500 hover:text-red-500 transition-colors"
                                            aria-label="Remove item"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                        <div className="flex items-center border border-gold-500/30 rounded">
                                            <button
                                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                                className="w-8 h-8 flex items-center justify-center text-silver-400 hover:text-gold-500 transition-colors"
                                            >
                                                −
                                            </button>
                                            <span className="w-10 text-center text-champagne-200">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                className="w-8 h-8 flex items-center justify-center text-silver-400 hover:text-gold-500 transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Clear Cart Button */}
                            <button
                                onClick={clearCart}
                                className="text-sm text-silver-500 hover:text-red-500 transition-colors"
                            >
                                Clear Cart
                            </button>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="card-luxury p-6 sticky top-24">
                                <h2 className="font-heading text-lg uppercase tracking-wider text-gold-500 mb-6">Order Summary</h2>

                                <div className="space-y-4 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-silver-500">Subtotal</span>
                                        <span className="text-champagne-200">${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-silver-500">Shipping</span>
                                        <span className="text-champagne-200">
                                            {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-silver-500">Tax (8%)</span>
                                        <span className="text-champagne-200">${tax.toFixed(2)}</span>
                                    </div>
                                    <div className="divider-gold my-4" />
                                    <div className="flex justify-between">
                                        <span className="font-heading uppercase tracking-wider text-champagne-200">Total</span>
                                        <span className="font-display text-xl text-gold-500">${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                    </div>
                                </div>

                                {shipping === 0 && (
                                    <p className="text-xs text-green-500 mt-4 text-center">
                                        ✓ You qualify for free shipping!
                                    </p>
                                )}

                                <Link href="/checkout" className="btn-luxury w-full mt-6 text-center block">
                                    Proceed to Checkout
                                </Link>

                                <Link href="/products" className="btn-luxury-outline w-full mt-3 text-center block text-xs">
                                    Continue Shopping
                                </Link>

                                {/* Trust Badges */}
                                <div className="mt-6 pt-6 border-t border-gold-500/20">
                                    <div className="flex justify-center gap-4 text-silver-600 text-xs">
                                        <span className="flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                            Secure
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                            Insured
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
