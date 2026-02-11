'use client';

import React, { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { products } from '@/data/products';

interface AIRecommendationsProps {
  productId?: number; // For product-specific recommendations
  userId?: string;    // For personalized recommendations
  title?: string;     // Custom title for the section
  count?: number;     // Number of recommendations to show
}

export default function AIRecommendations({
  productId,
  userId,
  title = 'Recommended For You',
  count = 4
}: AIRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<any[]>([]);

  useEffect(() => {
    // In a real implementation, this would call an AI service
    // to get personalized recommendations based on user behavior
    // and product similarity

    // For demo purposes, we'll return related products or random products
    let recs: any[] = [];

    if (productId) {
      // Get products in the same category as the specified product
      const currentProduct = products.find(p => p.id === productId);
      if (currentProduct) {
        recs = products
          .filter(p => p.category === currentProduct.category && p.id !== productId)
          .sort(() => 0.5 - Math.random())
          .slice(0, count);
      }
    } else if (userId) {
      // In a real app, we would use the user ID to get personalized recommendations
      // For demo, we'll just return random products
      recs = products
        .sort(() => 0.5 - Math.random())
        .slice(0, count);
    } else {
      // Just return random products
      recs = products
        .sort(() => 0.5 - Math.random())
        .slice(0, count);
    }

    setRecommendations(recs);
  }, [productId, userId, count]);

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="font-display text-3xl text-champagne-200 mb-8 text-center">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendations.map(product => (
            <ProductCard key={`rec-${product.id}`} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}