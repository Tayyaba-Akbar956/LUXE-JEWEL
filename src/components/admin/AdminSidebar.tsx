'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/products', label: 'Products', icon: '🛍️' },
    { href: '/admin/orders', label: 'Orders', icon: '📦' },
    { href: '/admin/customers', label: 'Customers', icon: '👥' },
    { href: '/admin/analytics', label: 'Analytics', icon: '📈' },
    { href: '/admin/reviews', label: 'Reviews', icon: '⭐' },
    { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <aside className="w-64 bg-luxury-dark border-r border-gold-500/20 flex flex-col">
      <div className="p-6 border-b border-gold-500/20">
        <h1 className="font-display text-2xl text-gold-500">LuxeJewel Admin</h1>
        <p className="text-silver-500 text-sm">Management Panel</p>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm transition-colors ${
                  pathname === item.href
                    ? 'bg-gold-500/10 text-gold-500 border-r-2 border-gold-500'
                    : 'text-silver-400 hover:bg-silver-800/50 hover:text-champagne-200'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gold-500/20">
        <button className="w-full py-3 text-left text-red-500 hover:bg-red-900/20 rounded-lg transition-colors">
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}