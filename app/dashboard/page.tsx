'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-luxury-black">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-champagne-200">Loading...</div>
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
            <h1 className="font-display text-3xl text-champagne-200 mb-4">Access Denied</h1>
            <p className="text-silver-500 mb-6">Please sign in to access your dashboard.</p>
            <Link href="/login" className="btn-luxury">Sign In</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Mock data for dashboard
  const orderHistory = [
    { id: 'ORD-001', date: '2023-11-15', total: 249.99, status: 'Delivered' },
    { id: 'ORD-002', date: '2023-10-22', total: 129.50, status: 'Delivered' },
    { id: 'ORD-003', date: '2023-09-30', total: 399.99, status: 'Shipped' },
  ];

  const recentReviews = [
    { productId: 1, productName: 'Gilded Solitaire Crystal Ring', rating: 5, date: '2023-11-20' },
    { productId: 15, productName: 'Majestic Pearl Pendant', rating: 4, date: '2023-11-18' },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-luxury-black">
      <Header />
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="font-display text-4xl text-champagne-200 mb-8">Dashboard</h1>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="card-luxury p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gold-500/30">
                    <div className="w-full h-full bg-gradient-to-br from-gold-500/20 to-transparent flex items-center justify-center">
                      <span className="text-2xl text-gold-500">
                        {user.user_metadata?.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h2 className="font-heading text-lg text-champagne-200">
                      {user.user_metadata?.full_name || user.email?.split('@')[0]}
                    </h2>
                    <p className="text-silver-500 text-sm">Member since Nov 2023</p>
                  </div>
                </div>

                <nav className="space-y-2">
                  {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'orders', label: 'Order History' },
                    { id: 'reviews', label: 'My Reviews' },
                    { id: 'wishlist', label: 'Wishlist' },
                    { id: 'settings', label: 'Account Settings' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full text-left px-4 py-3 rounded transition-colors ${activeTab === tab.id
                          ? 'bg-gold-500/10 text-gold-500 border-r-2 border-gold-500'
                          : 'text-silver-500 hover:text-champagne-200 hover:bg-silver-800/50'
                        }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>

                <button
                  onClick={signOut}
                  className="w-full mt-6 px-4 py-3 text-red-500 hover:bg-red-900/20 rounded transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="card-luxury p-6">
                {activeTab === 'overview' && (
                  <div>
                    <h2 className="font-heading text-2xl text-champagne-200 mb-6">Account Overview</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div className="bg-luxury-dark p-6 rounded-lg border border-gold-500/20">
                        <p className="text-silver-500 text-sm">Total Orders</p>
                        <p className="font-display text-3xl text-gold-500 mt-2">12</p>
                      </div>

                      <div className="bg-luxury-dark p-6 rounded-lg border border-gold-500/20">
                        <p className="text-silver-500 text-sm">Spent</p>
                        <p className="font-display text-3xl text-gold-500 mt-2">$1,248</p>
                      </div>

                      <div className="bg-luxury-dark p-6 rounded-lg border border-gold-500/20">
                        <p className="text-silver-500 text-sm">Reviews</p>
                        <p className="font-display text-3xl text-gold-500 mt-2">5</p>
                      </div>
                    </div>

                    <div className="mb-8">
                      <h3 className="font-heading text-xl text-champagne-200 mb-4">Recent Orders</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gold-500/20">
                              <th className="pb-3 text-left text-silver-400">Order</th>
                              <th className="pb-3 text-left text-silver-400">Date</th>
                              <th className="pb-3 text-left text-silver-400">Total</th>
                              <th className="pb-3 text-left text-silver-400">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orderHistory.map((order) => (
                              <tr key={order.id} className="border-b border-gold-500/10">
                                <td className="py-4 text-champagne-200">{order.id}</td>
                                <td className="py-4 text-silver-500">{order.date}</td>
                                <td className="py-4 text-champagne-200">${order.total}</td>
                                <td className="py-4">
                                  <span className={`px-2 py-1 rounded text-xs ${order.status === 'Delivered'
                                      ? 'bg-green-900/30 text-green-400'
                                      : 'bg-yellow-900/30 text-yellow-400'
                                    }`}>
                                    {order.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-heading text-xl text-champagne-200 mb-4">Recent Reviews</h3>
                      <div className="space-y-4">
                        {recentReviews.map((review, index) => (
                          <div key={index} className="flex justify-between items-center border-b border-gold-500/10 pb-4 last:border-0 last:pb-0">
                            <div>
                              <p className="text-champagne-200">{review.productName}</p>
                              <div className="flex items-center gap-2 mt-1">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`h-4 w-4 ${i < review.rating ? 'text-gold-500' : 'text-silver-700'}`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                            </div>
                            <span className="text-silver-500 text-sm">{review.date}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'orders' && (
                  <div>
                    <h2 className="font-heading text-2xl text-champagne-200 mb-6">Order History</h2>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gold-500/20">
                            <th className="pb-3 text-left text-silver-400">Order</th>
                            <th className="pb-3 text-left text-silver-400">Date</th>
                            <th className="pb-3 text-left text-silver-400">Total</th>
                            <th className="pb-3 text-left text-silver-400">Status</th>
                            <th className="pb-3 text-left text-silver-400">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orderHistory.map((order) => (
                            <tr key={order.id} className="border-b border-gold-500/10">
                              <td className="py-4 text-champagne-200">{order.id}</td>
                              <td className="py-4 text-silver-500">{order.date}</td>
                              <td className="py-4 text-champagne-200">${order.total}</td>
                              <td className="py-4">
                                <span className={`px-2 py-1 rounded text-xs ${order.status === 'Delivered'
                                    ? 'bg-green-900/30 text-green-400'
                                    : order.status === 'Shipped'
                                      ? 'bg-blue-900/30 text-blue-400'
                                      : 'bg-yellow-900/30 text-yellow-400'
                                  }`}>
                                  {order.status}
                                </span>
                              </td>
                              <td className="py-4">
                                <Link href={`/orders/${order.id}`} className="text-gold-500 hover:text-gold-400 text-sm">
                                  View Details
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div>
                    <h2 className="font-heading text-2xl text-champagne-200 mb-6">My Reviews</h2>
                    <div className="space-y-6">
                      {recentReviews.map((review, index) => (
                        <div key={index} className="border-b border-gold-500/10 pb-6 last:border-0 last:pb-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-heading text-lg text-champagne-200">{review.productName}</h3>
                              <div className="flex items-center gap-2 mt-2">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`h-5 w-5 ${i < review.rating ? 'text-gold-500' : 'text-silver-700'}`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                            </div>
                            <span className="text-silver-500 text-sm">{review.date}</span>
                          </div>
                          <p className="text-silver-400 mt-3">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                          </p>
                          <div className="flex gap-3 mt-4">
                            <button className="text-sm text-gold-500 hover:text-gold-400">Edit</button>
                            <button className="text-sm text-red-500 hover:text-red-400">Delete</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'wishlist' && (
                  <div>
                    <h2 className="font-heading text-2xl text-champagne-200 mb-6">My Wishlist</h2>
                    <p className="text-silver-500">Your wishlist is currently empty.</p>
                    <Link href="/products" className="btn-luxury mt-4">Browse Products</Link>
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div>
                    <h2 className="font-heading text-2xl text-champagne-200 mb-6">Account Settings</h2>
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-heading text-lg text-champagne-200 mb-4">Personal Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-silver-400 text-sm mb-2">First Name</label>
                            <input
                              type="text"
                              defaultValue={user.user_metadata?.full_name?.split(' ')[0] || ''}
                              className="w-full px-4 py-3 bg-luxury-dark border border-gold-500/30 rounded-lg text-champagne-200 focus:outline-none focus:ring-2 focus:ring-gold-500"
                            />
                          </div>
                          <div>
                            <label className="block text-silver-400 text-sm mb-2">Last Name</label>
                            <input
                              type="text"
                              defaultValue={user.user_metadata?.full_name?.split(' ')[1] || ''}
                              className="w-full px-4 py-3 bg-luxury-dark border border-gold-500/30 rounded-lg text-champagne-200 focus:outline-none focus:ring-2 focus:ring-gold-500"
                            />
                          </div>
                        </div>
                        <div className="mt-4">
                          <label className="block text-silver-400 text-sm mb-2">Email</label>
                          <input
                            type="email"
                            defaultValue={user.email || ''}
                            className="w-full px-4 py-3 bg-luxury-dark border border-gold-500/30 rounded-lg text-champagne-200 focus:outline-none focus:ring-2 focus:ring-gold-500"
                          />
                        </div>
                        <button className="btn-luxury mt-4">Update Information</button>
                      </div>

                      <div>
                        <h3 className="font-heading text-lg text-champagne-200 mb-4">Password</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-silver-400 text-sm mb-2">Current Password</label>
                            <input
                              type="password"
                              className="w-full px-4 py-3 bg-luxury-dark border border-gold-500/30 rounded-lg text-champagne-200 focus:outline-none focus:ring-2 focus:ring-gold-500"
                            />
                          </div>
                          <div>
                            <label className="block text-silver-400 text-sm mb-2">New Password</label>
                            <input
                              type="password"
                              className="w-full px-4 py-3 bg-luxury-dark border border-gold-500/30 rounded-lg text-champagne-200 focus:outline-none focus:ring-2 focus:ring-gold-500"
                            />
                          </div>
                        </div>
                        <button className="btn-luxury mt-4">Change Password</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}