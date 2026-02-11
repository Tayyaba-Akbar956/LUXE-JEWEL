'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
  const { user, loading } = useAuth();
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
    // In a real implementation, we would update the user profile in Supabase
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
                  <h3 className="font-heading text-lg text-gold-500 mb-3">Account Actions</h3>
                  <div className="space-y-2">
                    <Link href="/orders" className="block btn-luxury-outline py-2 text-center">
                      My Orders
                    </Link>
                    <Link href="/wishlist" className="block btn-luxury-outline py-2 text-center">
                      My Wishlist
                    </Link>
                    <Link href="/settings" className="block btn-luxury-outline py-2 text-center">
                      Account Settings
                    </Link>
                  </div>
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

                    <div>
                      <h3 className="text-sm font-medium text-silver-400">Member Since</h3>
                      <p className="text-champagne-200">
                        {user && new Date(user.id).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Addresses Section */}
              <div className="card-luxury p-6 mt-6">
                <h2 className="font-heading text-xl text-champagne-200 mb-6">Addresses</h2>
                <div className="space-y-4">
                  <div className="border border-gold-500/30 rounded-lg p-4">
                    <h3 className="font-heading text-lg text-champagne-200">Default Shipping Address</h3>
                    <p className="text-silver-500 mt-2">
                      123 Luxury Avenue<br />
                      Beverly Hills, CA 90210<br />
                      United States
                    </p>
                    <button className="mt-3 text-gold-500 hover:text-gold-400 transition-colors text-sm">
                      Edit Address
                    </button>
                  </div>

                  <button className="w-full py-3 border border-dashed border-gold-500/30 rounded-lg text-gold-500 hover:bg-gold-500/10 transition-colors">
                    + Add New Address
                  </button>
                </div>
              </div>

              {/* Payment Methods Section */}
              <div className="card-luxury p-6 mt-6">
                <h2 className="font-heading text-xl text-champagne-200 mb-6">Payment Methods</h2>
                <div className="space-y-4">
                  <div className="border border-gold-500/30 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-heading text-lg text-champagne-200">Visa ending in 4242</h3>
                        <p className="text-silver-500">Expires 12/2025</p>
                      </div>
                      <div className="bg-gray-800 px-3 py-1 rounded text-sm">Default</div>
                    </div>
                    <button className="mt-3 text-gold-500 hover:text-gold-400 transition-colors text-sm">
                      Edit Payment Method
                    </button>
                  </div>

                  <button className="w-full py-3 border border-dashed border-gold-500/30 rounded-lg text-gold-500 hover:bg-gold-500/10 transition-colors">
                    + Add New Payment Method
                  </button>
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