'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';

interface Order {
  id: number;
  order_number: string;
  created_at: string;
  total_amount: number;
  status: string;
}

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Fetch real orders from the API
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const response = await fetch(`/api/orders?userId=${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setOrders(data || []);
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setOrdersLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

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
            <h1 className="font-display text-3xl text-champagne-200 mb-4">Access Denied</h1>
            <p className="text-silver-500 mb-6">Please sign in to access your dashboard.</p>
            <Link href="/login" className="btn-luxury">Sign In</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Compute stats from real orders
  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, order) => sum + parseFloat(String(order.total_amount || 0)), 0);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

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
                    <p className="text-silver-500 text-sm">{user.email}</p>
                  </div>
                </div>

                <nav className="space-y-2">
                  {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'orders', label: 'Order History' },
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

                <div className="mt-4 space-y-2">
                  <Link href="/wishlist" className="block w-full text-left px-4 py-3 rounded text-silver-500 hover:text-champagne-200 hover:bg-silver-800/50 transition-colors">
                    My Wishlist
                  </Link>
                  <Link href="/profile" className="block w-full text-left px-4 py-3 rounded text-silver-500 hover:text-champagne-200 hover:bg-silver-800/50 transition-colors">
                    My Profile
                  </Link>
                </div>

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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div className="bg-luxury-dark p-6 rounded-lg border border-gold-500/20">
                        <p className="text-silver-500 text-sm">Total Orders</p>
                        <p className="font-display text-3xl text-gold-500 mt-2">
                          {ordersLoading ? '...' : totalOrders}
                        </p>
                      </div>

                      <div className="bg-luxury-dark p-6 rounded-lg border border-gold-500/20">
                        <p className="text-silver-500 text-sm">Total Spent</p>
                        <p className="font-display text-3xl text-gold-500 mt-2">
                          {ordersLoading ? '...' : `$${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-heading text-xl text-champagne-200 mb-4">Recent Orders</h3>
                      {ordersLoading ? (
                        <div className="flex justify-center py-8">
                          <div className="animate-spin h-6 w-6 border-4 border-gold-500 border-t-transparent rounded-full" />
                        </div>
                      ) : orders.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-silver-500">No orders yet.</p>
                          <Link href="/products" className="text-gold-500 hover:text-gold-400 text-sm mt-2 inline-block">
                            Start Shopping →
                          </Link>
                        </div>
                      ) : (
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
                              {orders.slice(0, 5).map((order) => (
                                <tr key={order.id} className="border-b border-gold-500/10">
                                  <td className="py-4 text-champagne-200">{order.order_number}</td>
                                  <td className="py-4 text-silver-500">{formatDate(order.created_at)}</td>
                                  <td className="py-4 text-champagne-200">${parseFloat(String(order.total_amount)).toFixed(2)}</td>
                                  <td className="py-4">
                                    <span className={`px-2 py-1 rounded text-xs ${order.status === 'delivered'
                                      ? 'bg-green-900/30 text-green-400'
                                      : order.status === 'shipped'
                                        ? 'bg-blue-900/30 text-blue-400'
                                        : 'bg-yellow-900/30 text-yellow-400'
                                      }`}>
                                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'orders' && (
                  <div>
                    <h2 className="font-heading text-2xl text-champagne-200 mb-6">Order History</h2>
                    {ordersLoading ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin h-6 w-6 border-4 border-gold-500 border-t-transparent rounded-full" />
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="text-center py-12">
                        <svg className="w-16 h-16 mx-auto text-silver-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <p className="text-silver-500 mb-4">You haven&apos;t placed any orders yet.</p>
                        <Link href="/products" className="btn-luxury">Browse Products</Link>
                      </div>
                    ) : (
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
                            {orders.map((order) => (
                              <tr key={order.id} className="border-b border-gold-500/10">
                                <td className="py-4 text-champagne-200">{order.order_number}</td>
                                <td className="py-4 text-silver-500">{formatDate(order.created_at)}</td>
                                <td className="py-4 text-champagne-200">${parseFloat(String(order.total_amount)).toFixed(2)}</td>
                                <td className="py-4">
                                  <span className={`px-2 py-1 rounded text-xs ${order.status === 'delivered'
                                    ? 'bg-green-900/30 text-green-400'
                                    : order.status === 'shipped'
                                      ? 'bg-blue-900/30 text-blue-400'
                                      : 'bg-yellow-900/30 text-yellow-400'
                                    }`}>
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
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
                              className="input-luxury rounded-lg"
                            />
                          </div>
                          <div>
                            <label className="block text-silver-400 text-sm mb-2">Last Name</label>
                            <input
                              type="text"
                              defaultValue={user.user_metadata?.full_name?.split(' ')[1] || ''}
                              className="input-luxury rounded-lg"
                            />
                          </div>
                        </div>
                        <div className="mt-4">
                          <label className="block text-silver-400 text-sm mb-2">Email</label>
                          <input
                            type="email"
                            defaultValue={user.email || ''}
                            className="input-luxury rounded-lg"
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
                              className="input-luxury rounded-lg"
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