'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../src/components/ui/card';

export default function AdminAnalyticsPage() {
  // Mock data for analytics
  const revenueData = [
    { month: 'Jan', revenue: 12500 },
    { month: 'Feb', revenue: 18900 },
    { month: 'Mar', revenue: 14200 },
    { month: 'Apr', revenue: 17800 },
    { month: 'May', revenue: 21000 },
    { month: 'Jun', revenue: 24500 },
    { month: 'Jul', revenue: 19800 },
    { month: 'Aug', revenue: 22100 },
    { month: 'Sep', revenue: 25600 },
    { month: 'Oct', revenue: 28900 },
    { month: 'Nov', revenue: 32400 },
    { month: 'Dec', revenue: 38700 },
  ];

  const topProducts = [
    { name: 'Gilded Solitaire Crystal Ring', sales: 124, revenue: 3100 },
    { name: 'Crystal Shimmer Necklace', sales: 98, revenue: 3430 },
    { name: 'Dazzling Bar Studs', sales: 87, revenue: 1131 },
    { name: 'Golden Link Bracelet', sales: 76, revenue: 1748 },
    { name: 'Sapphire Halo Ring', sales: 54, revenue: 32396 },
  ];

  const customerStats = [
    { title: 'New Customers', value: '1,248', change: '+12.5%' },
    { title: 'Returning Customers', value: '892', change: '+8.2%' },
    { title: 'Avg. Order Value', value: '$124.99', change: '+5.3%' },
    { title: 'Conversion Rate', value: '4.7%', change: '+1.2%' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-champagne-200">Analytics Dashboard</h1>
        <p className="text-silver-500">Track your store's performance and insights</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {customerStats.map((stat: any, index: number) => (
          <Card key={index} className="bg-luxury-dark border-gold-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-silver-400">{stat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-champagne-200">{stat.value}</div>
              <p className="text-xs text-green-500 mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="bg-luxury-dark border-gold-500/20">
          <CardHeader>
            <CardTitle className="text-champagne-200">Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <div className="flex items-end h-64 gap-2 mt-8 px-4">
                {revenueData.map((data: any, index: number) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div
                      className="w-full bg-gradient-to-t from-gold-500 to-gold-400 rounded-t hover:opacity-90 transition-opacity"
                      style={{ height: `${(data.revenue / 40000) * 100}%` }}
                    ></div>
                    <span className="text-xs text-silver-500 mt-2">{data.month}</span>
                  </div>
                ))}
              </div>
              <div className="text-center mt-4 text-silver-500">
                Revenue by Month (Last 12 Months)
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="bg-luxury-dark border-gold-500/20">
          <CardHeader>
            <CardTitle className="text-champagne-200">Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product: any, index: number) => (
                <div key={index} className="flex justify-between items-center pb-4 border-b border-gold-500/10 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium text-champagne-200">{product.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-champagne-200">{product.sales} sales</p>
                    <p className="text-xs text-silver-500">${product.revenue.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Traffic Sources */}
        <Card className="bg-luxury-dark border-gold-500/20">
          <CardHeader>
            <CardTitle className="text-champagne-200">Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl mb-2">🌐</div>
                <p className="text-silver-500">Traffic sources visualization</p>
                <p className="text-silver-500 text-sm mt-1">Direct, Social, Referral, etc.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conversion Funnels */}
        <Card className="bg-luxury-dark border-gold-500/20">
          <CardHeader>
            <CardTitle className="text-champagne-200">Conversion Funnels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl mb-2">📊</div>
                <p className="text-silver-500">Conversion funnel visualization</p>
                <p className="text-silver-500 text-sm mt-1">Views → Carts → Purchases</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Demographics */}
        <Card className="bg-luxury-dark border-gold-500/20">
          <CardHeader>
            <CardTitle className="text-champagne-200">Customer Demographics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl mb-2">👤</div>
                <p className="text-silver-500">Customer demographics visualization</p>
                <p className="text-silver-500 text-sm mt-1">Age, Location, Gender</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}