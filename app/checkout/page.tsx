'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { processMockPayment } from '@/lib/mockPayment';
import { supabase } from '@/lib/supabase';

export default function CheckoutPage() {
    const router = useRouter();
    const { items, getSubtotal, clearCart } = useCart();
    const { user: authUser, loading: authLoading } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);
    const [step, setStep] = useState<'shipping' | 'payment' | 'complete'>('shipping');
    const [userId, setUserId] = useState<string | null>(null);
    const [finalTotal, setFinalTotal] = useState(0);
    const [finalShipping, setFinalShipping] = useState(0);

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!authLoading && !authUser) {
            router.push('/login');
        }
    }, [authUser, authLoading, router]);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) setUserId(user.id);
        };
        checkUser();
    }, []);

    // Form states (simplified for brevity)
    const [shippingInfo, setShippingInfo] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        country: 'United States',
    });

    const [paymentInfo, setPaymentInfo] = useState({
        cardNumber: '',
        cardName: '',
        expiry: '',
        cvv: '',
    });

    const subtotal = getSubtotal();
    const shipping = subtotal > 500 ? 0 : 25;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    const handleShippingSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStep('payment');
    };

    const handlePaymentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        try {
            // 1. Process mock payment
            const paymentResult = await processMockPayment({
                amount: total,
                currency: 'usd',
                description: `LuxeJewel Order - ${items.length} items`,
                receipt_email: shippingInfo.email
            });

            if (paymentResult.status === 'succeeded') {
                // 2. Persist order to database via API
                const orderData = {
                    userId,
                    shippingAddress: shippingInfo,
                    billingAddress: shippingInfo,
                    items: items.map(item => ({
                        product_id: item.productId,
                        quantity: item.quantity,
                        price: item.product?.price || 0
                    })),
                    subtotal,
                    taxAmount: tax,
                    shippingAmount: shipping,
                    totalAmount: total,
                    paymentMethod: 'mock-card'
                };

                const response = await fetch('/api/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(orderData)
                });

                const result = await response.json();

                if (response.ok) {
                    setFinalTotal(total);
                    setFinalShipping(shipping);
                    setStep('complete');
                    clearCart();
                } else {
                    alert(`Order creation failed: ${result.error || 'Unknown error'}`);
                }
            } else {
                alert(`Payment failed: ${paymentResult.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Payment error:', error);
            alert('An error occurred during payment processing. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    useEffect(() => {
        if (items.length === 0 && step !== 'complete') {
            router.push('/cart');
        }
    }, [items, step, router]);

    if (items.length === 0 && step !== 'complete') {
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

    // Order Complete View
    if (step === 'complete') {
        return (
            <div className="flex min-h-screen flex-col bg-luxury-black">
                <Header />
                <main className="flex-grow flex items-center justify-center">
                    <div className="text-center px-4 max-w-lg">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center animate-scale-in">
                            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="font-display text-4xl text-champagne-200 mb-4">Order Confirmed!</h1>
                        <p className="text-silver-400 mb-2">Thank you for your purchase.</p>
                        <p className="text-silver-500 text-sm mb-8">
                            Order #LJ{Math.random().toString(36).substr(2, 9).toUpperCase()}<br />
                            A confirmation email has been sent to {shippingInfo.email || 'your email'}.
                        </p>
                        <div className="card-luxury p-6 mb-8">
                            <h2 className="font-heading text-sm uppercase tracking-wider text-gold-500 mb-4">Order Total</h2>
                            <p className="font-display text-3xl text-gold-500">${finalTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                            <p className="text-xs text-silver-500 mt-2">Shipping: {finalShipping === 0 ? 'Free' : `$${finalShipping.toFixed(2)}`}</p>
                            <p className="text-xs text-silver-500 mt-1">Shipping to: {shippingInfo.city}, {shippingInfo.state}</p>
                        </div>
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
            <main className="flex-grow py-12">
                <div className="container mx-auto px-4">
                    <h1 className="font-display text-4xl text-champagne-200 mb-8">Checkout</h1>

                    {/* Progress Steps */}
                    <div className="flex items-center justify-center mb-12">
                        <div className={`flex items-center gap-2 ${step === 'shipping' ? 'text-gold-500' : 'text-silver-500'}`}>
                            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${step === 'shipping' ? 'bg-gold-500 text-luxury-black' : 'bg-silver-700'}`}>1</span>
                            <span className="font-heading text-xs uppercase tracking-wider hidden sm:inline">Shipping</span>
                        </div>
                        <div className="w-16 h-px bg-gold-500/30 mx-4" />
                        <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-gold-500' : 'text-silver-500'}`}>
                            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${step === 'payment' ? 'bg-gold-500 text-luxury-black' : 'bg-silver-700'}`}>2</span>
                            <span className="font-heading text-xs uppercase tracking-wider hidden sm:inline">Payment</span>
                        </div>
                        <div className="w-16 h-px bg-gold-500/30 mx-4" />
                        <div className="flex items-center gap-2 text-silver-500">
                            <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm bg-silver-700">3</span>
                            <span className="font-heading text-xs uppercase tracking-wider hidden sm:inline">Complete</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Form Section */}
                        <div className="lg:col-span-2">
                            {step === 'shipping' && (
                                <form onSubmit={handleShippingSubmit} className="card-luxury p-8">
                                    <h2 className="font-heading text-lg uppercase tracking-wider text-gold-500 mb-6">Shipping Information</h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        <div>
                                            <label className="block text-silver-400 text-sm mb-2">First Name *</label>
                                            <input
                                                type="text"
                                                required
                                                value={shippingInfo.firstName}
                                                onChange={e => setShippingInfo({ ...shippingInfo, firstName: e.target.value })}
                                                className="input-luxury"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-silver-400 text-sm mb-2">Last Name *</label>
                                            <input
                                                type="text"
                                                required
                                                value={shippingInfo.lastName}
                                                onChange={e => setShippingInfo({ ...shippingInfo, lastName: e.target.value })}
                                                className="input-luxury"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        <div>
                                            <label className="block text-silver-400 text-sm mb-2">Email *</label>
                                            <input
                                                type="email"
                                                required
                                                value={shippingInfo.email}
                                                onChange={e => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                                                className="input-luxury"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-silver-400 text-sm mb-2">Phone *</label>
                                            <input
                                                type="tel"
                                                required
                                                value={shippingInfo.phone}
                                                onChange={e => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                                                className="input-luxury"
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <label className="block text-silver-400 text-sm mb-2">Address *</label>
                                        <input
                                            type="text"
                                            required
                                            value={shippingInfo.address}
                                            onChange={e => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                                            className="input-luxury"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                        <div className="col-span-2">
                                            <label className="block text-silver-400 text-sm mb-2">City *</label>
                                            <input
                                                type="text"
                                                required
                                                value={shippingInfo.city}
                                                onChange={e => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                                                className="input-luxury"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-silver-400 text-sm mb-2">State *</label>
                                            <input
                                                type="text"
                                                required
                                                value={shippingInfo.state}
                                                onChange={e => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                                                className="input-luxury"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-silver-400 text-sm mb-2">ZIP *</label>
                                            <input
                                                type="text"
                                                required
                                                value={shippingInfo.zip}
                                                onChange={e => setShippingInfo({ ...shippingInfo, zip: e.target.value })}
                                                className="input-luxury"
                                            />
                                        </div>
                                    </div>

                                    <button type="submit" className="btn-luxury w-full">
                                        Continue to Payment
                                    </button>
                                </form>
                            )}

                            {step === 'payment' && (
                                <form onSubmit={handlePaymentSubmit} className="card-luxury p-8">
                                    <h2 className="font-heading text-lg uppercase tracking-wider text-gold-500 mb-6">Payment Information</h2>

                                    {/* Mock Payment Notice */}
                                    <div className="bg-gold-500/10 border border-gold-500/30 rounded p-4 mb-6">
                                        <p className="text-gold-500 text-sm">🔒 This is a demo. No real payment will be processed.</p>
                                        <p className="text-silver-500 text-xs mt-1">Use any card number (e.g., 4242 4242 4242 4242)</p>
                                    </div>

                                    <div className="mb-6">
                                        <label className="block text-silver-400 text-sm mb-2">Card Number *</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="1234 5678 9012 3456"
                                            maxLength={19}
                                            value={paymentInfo.cardNumber}
                                            onChange={e => {
                                                const val = e.target.value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim();
                                                setPaymentInfo({ ...paymentInfo, cardNumber: val });
                                            }}
                                            className="input-luxury"
                                        />
                                    </div>

                                    <div className="mb-6">
                                        <label className="block text-silver-400 text-sm mb-2">Cardholder Name *</label>
                                        <input
                                            type="text"
                                            required
                                            value={paymentInfo.cardName}
                                            onChange={e => setPaymentInfo({ ...paymentInfo, cardName: e.target.value })}
                                            className="input-luxury"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div>
                                            <label className="block text-silver-400 text-sm mb-2">Expiry *</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="MM/YY"
                                                maxLength={5}
                                                value={paymentInfo.expiry}
                                                onChange={e => {
                                                    let val = e.target.value.replace(/\D/g, '');
                                                    if (val.length > 2) val = val.slice(0, 2) + '/' + val.slice(2);
                                                    setPaymentInfo({ ...paymentInfo, expiry: val });
                                                }}
                                                className="input-luxury"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-silver-400 text-sm mb-2">CVV *</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="123"
                                                maxLength={4}
                                                value={paymentInfo.cvv}
                                                onChange={e => setPaymentInfo({ ...paymentInfo, cvv: e.target.value.replace(/\D/g, '') })}
                                                className="input-luxury"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setStep('shipping')}
                                            className="btn-luxury-outline flex-1"
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isProcessing}
                                            className="btn-luxury flex-1 relative"
                                        >
                                            {isProcessing ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                    </svg>
                                                    Processing...
                                                </span>
                                            ) : (
                                                `Pay $${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                                            )}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="card-luxury p-6 sticky top-24">
                                <h2 className="font-heading text-lg uppercase tracking-wider text-gold-500 mb-6">Order Summary</h2>

                                {/* Cart Items */}
                                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                                    {items.map(item => (
                                        <div key={item.productId} className="flex gap-3">
                                            <div className="relative w-14 h-14 flex-shrink-0 rounded overflow-hidden">
                                                <Image
                                                    src={item.product?.featuredImage || ''}
                                                    alt={item.product?.name || ''}
                                                    fill
                                                    className="object-cover"
                                                />
                                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold-500 text-luxury-black text-xs flex items-center justify-center rounded-full">
                                                    {item.quantity}
                                                </span>
                                            </div>
                                            <div className="flex-grow">
                                                <p className="text-champagne-200 text-sm line-clamp-1">{item.product?.name}</p>
                                                <p className="text-gold-500 text-sm">${item.product?.price.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="divider-gold my-6" />

                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-silver-500">Subtotal</span>
                                        <span className="text-champagne-200">${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-silver-500">Shipping</span>
                                        <span className="text-champagne-200">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-silver-500">Tax</span>
                                        <span className="text-champagne-200">${tax.toFixed(2)}</span>
                                    </div>
                                    <div className="divider-gold my-4" />
                                    <div className="flex justify-between">
                                        <span className="font-heading uppercase tracking-wider text-champagne-200">Total</span>
                                        <span className="font-display text-xl text-gold-500">${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
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
