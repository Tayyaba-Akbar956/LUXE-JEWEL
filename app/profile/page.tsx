'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
  const { user, loading, signOut } = useAuth();
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    avatarUrl: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: '',
    email: ''
  });

  useEffect(() => {
    if (user) {
      setProfile({
        fullName: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
        email: user.email || '',
        avatarUrl: user.user_metadata?.avatar_url || ''
      });
      setEditForm({
        fullName: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setEditForm({
        fullName: profile.fullName,
        email: profile.email
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile({
      ...profile,
      fullName: editForm.fullName,
      email: editForm.email
    });
    setIsEditing(false);
  };

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
            <p className="text-silver-500 mb-6">Please sign in to view your profile.</p>
            <Link href="/login" className="btn-luxury">Sign In</Link>
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
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="font-display text-4xl text-champagne-200 mb-8">My Profile</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Profile Picture Section */}
            <div className="md:col-span-1">
              <div className="card-luxury p-6 text-center">
                <div className="relative mx-auto w-32 h-32 rounded-full overflow-hidden border-2 border-gold-500/30 mb-4">
                  {profile.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gold-500/20 to-transparent flex items-center justify-center">
                      <span className="text-4xl text-gold-500">
                        {profile.fullName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <h2 className="font-heading text-xl text-champagne-200">{profile.fullName}</h2>
                <p className="text-silver-500 text-sm">{profile.email}</p>

                <div className="mt-6 pt-6 border-t border-gold-500/20">
                  <h3 className="font-heading text-lg text-gold-500 mb-3">Quick Links</h3>
                  <div className="space-y-2">
                    <Link href="/dashboard" className="block btn-luxury-outline py-2 text-center">
                      My Dashboard
                    </Link>
                    <Link href="/wishlist" className="block btn-luxury-outline py-2 text-center">
                      My Wishlist
                    </Link>
                    <Link href="/cart" className="block btn-luxury-outline py-2 text-center">
                      My Cart
                    </Link>
                  </div>
                </div>

                {/* Sign Out Button */}
                <div className="mt-6 pt-6 border-t border-gold-500/20">
                  <button
                    onClick={signOut}
                    className="w-full px-4 py-3 text-red-500 hover:bg-red-900/20 rounded-lg transition-colors border border-red-500/30"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>

            {/* Profile Details Section */}
            <div className="md:col-span-2">
              <div className="card-luxury p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-heading text-xl text-champagne-200">Personal Information</h2>
                  <button
                    onClick={handleEditToggle}
                    className="text-gold-500 hover:text-gold-400 transition-colors"
                  >
                    {isEditing ? 'Cancel' : 'Edit'}
                  </button>
                </div>

                {isEditing ? (
                  <form onSubmit={handleSave} className="space-y-6">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-silver-400 mb-2">
                        Full Name
                      </label>
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        value={editForm.fullName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-luxury-dark border border-gold-500/30 rounded-lg text-champagne-200 focus:outline-none focus:ring-2 focus:ring-gold-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-silver-400 mb-2">
                        Email Address
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={editForm.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-luxury-dark border border-gold-500/30 rounded-lg text-champagne-200 focus:outline-none focus:ring-2 focus:ring-gold-500"
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={handleEditToggle}
                        className="btn-luxury-outline flex-1"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn-luxury flex-1"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-silver-400">Full Name</h3>
                      <p className="text-champagne-200">{profile.fullName}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-silver-400">Email Address</h3>
                      <p className="text-champagne-200">{profile.email}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Addresses Section — Empty State */}
              <div className="card-luxury p-6 mt-6">
                <h2 className="font-heading text-xl text-champagne-200 mb-6">Addresses</h2>
                <div className="space-y-4">
                  <div className="text-center py-8">
                    <svg className="w-12 h-12 mx-auto text-silver-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-silver-500 text-sm">No addresses saved yet.</p>
                    <p className="text-silver-600 text-xs mt-1">Your shipping address will be saved when you place an order.</p>
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