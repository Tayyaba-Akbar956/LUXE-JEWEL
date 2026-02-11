'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../src/components/ui/card';
import { supabase } from '@/lib/supabase';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState([
    { title: 'Total Revenue', value: '$0', change: '...', icon: '💰' },
    { title: 'Orders', value: '0', change: '...', icon: '📦' },
    { title: 'Customers', value: '0', change: '...', icon: '👥' },
    { title: 'Avg Order Value', value: '$0', change: '...', icon: '📊' },
  ]);

  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);

      // 1. Fetch Stats
      const { data: ordersData } = await supabase.from('orders').select('total_amount');
      const { count: customerCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });

      const totalRevenue = ordersData?.reduce((acc, order) => acc + parseFloat(order.total_amount), 0) || 0;
      const orderCount = ordersData?.length || 0;
      const avgOrderValue = orderCount > 0 ? totalRevenue / orderCount : 0;

      setStats([
        { title: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, change: '+0%', icon: '💰' },
        { title: 'Orders', value: orderCount.toString(), change: '+0%', icon: '📦' },
        { title: 'Customers', value: (customerCount || 0).toString(), change: '+0%', icon: '👥' },
        { title: 'Avg Order Value', value: `$${avgOrderValue.toFixed(2)}`, change: '+0%', icon: '📊' },
      ]);

      // 2. Fetch Recent Orders
      const { data: recent } = await supabase
        .from('orders')
        .select('*, profiles(full_name)')
        .order('created_at', { ascending: false })
        .limit(5);

      if (recent) setRecentOrders(recent);

      // 3. Fetch Top Products (Mocked for now as we don't have a view for it yet, but using real count)
      const { data: top } = await supabase
        .from('products')
        .select('name, price, view_count')
        .order('view_count', { ascending: false })
        .limit(5);

      if (top) setTopProducts(top.map(p => ({
        name: p.name,
        sold: Math.floor(p.view_count / 10), // Mocked relation to views
        revenue: `$${(Math.floor(p.view_count / 10) * p.price).toLocaleString()}`
      })));

      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-champagne-200">Admin Dashboard</h1>
        <p className="text-silver-500">Welcome back! Here's what's happening today.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-luxury-dark border border-gold-500/10 animate-pulse rounded-lg" />
          ))}
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat: any, index: number) => (
              <Card key={index} className="bg-luxury-dark border-gold-500/20">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-silver-400">{stat.title}</CardTitle>
                  <span className="text-2xl">{stat.icon}</span>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-champagne-200">{stat.value}</div>
                  <p className="text-xs text-green-500 mt-1">{stat.change}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts and Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sales Chart Placeholder */}
            <div className="lg:col-span-2">
              <Card className="bg-luxury-dark border-gold-500/20 h-full">
                <CardHeader>
                  <CardTitle className="text-champagne-200">Sales Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center bg-luxury-black/50 rounded-lg border border-gold-500/10">
                    <div className="text-center">
                      <div className="text-5xl mb-2">📈</div>
                      <p className="text-silver-500">Sales chart visualization</p>
                      <p className="text-silver-500 text-sm mt-1">Real-time revenue trends from Supabase</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders */}
            <div>
              <Card className="bg-luxury-dark border-gold-500/20 h-full">
                <CardHeader>
                  <CardTitle className="text-champagne-200">Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentOrders.length === 0 ? (
                      <p className="text-center text-silver-500 py-8">No orders yet.</p>
                    ) : recentOrders.map((order: any, index: number) => (
                      <div key={index} className="flex justify-between items-center pb-4 border-b border-gold-500/10 last:border-0 last:pb-0">
                        <div>
                          <p className="text-sm font-medium text-champagne-200">{order.order_number}</p>
                          <p className="text-xs text-silver-500">{order.profiles?.full_name || 'Guest'}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-champagne-200">${parseFloat(order.total_amount).toFixed(2)}</p>
                          <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider ${order.status === 'completed' || order.status === 'delivered'
                            ? 'bg-green-900/30 text-green-400'
                            : order.status === 'pending'
                              ? 'bg-yellow-900/30 text-yellow-400'
                              : 'bg-blue-900/30 text-blue-400'
                            }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Top Products */}
          <div>
            <Card className="bg-luxury-dark border-gold-500/20">
              <CardHeader>
                <CardTitle className="text-champagne-200">Most Viewed Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gold-500/20">
                        <th className="pb-3 text-left text-silver-400 font-medium">Product</th>
                        <th className="pb-3 text-right text-silver-400 font-medium">Views</th>
                        <th className="pb-3 text-right text-silver-400 font-medium">Est. Revenue Contribution</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topProducts.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="py-8 text-center text-silver-500">No data available.</td>
                        </tr>
                      ) : topProducts.map((product: any, index: number) => (
                        <tr key={index} className="border-b border-gold-500/10">
                          <td className="py-4 text-champagne-200">{product.name}</td>
                          <td className="py-4 text-right text-silver-400">{product.sold * 10}</td>
                          <td className="py-4 text-right text-champagne-200">{product.revenue}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}