'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signIn(email, password);
      router.push('/dashboard'); // Redirect to dashboard after login
      router.refresh(); // Refresh to update UI
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="flex min-h-screen flex-col bg-luxury-black">
      <Header />
      <main className="flex-grow flex items-center justify-center py-12">
        <div className="card-luxury w-full max-w-md p-8">
          <h1 className="font-display text-3xl text-champagne-200 mb-6 text-center">Welcome Back</h1>

          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-silver-400 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-luxury-dark border border-gold-500/30 rounded-lg text-champagne-200 focus:outline-none focus:ring-2 focus:ring-gold-500"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-silver-400">
                  Password
                </label>
                <Link href="/forgot-password" className="text-sm text-gold-500 hover:text-gold-400 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-luxury-dark border border-gold-500/30 rounded-lg text-champagne-200 focus:outline-none focus:ring-2 focus:ring-gold-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-luxury w-full py-3"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>



          <div className="mt-6 text-center">
            <p className="text-silver-500">
              Don't have an account?{' '}
              <Link href="/register" className="text-gold-500 hover:text-gold-400 transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}