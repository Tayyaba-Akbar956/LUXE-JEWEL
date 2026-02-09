'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem, isInCart } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();

  const {
    id,
    name,
    slug,
    price,
    comparePrice,
    featuredImage,
    ratingAverage,
    ratingCount,
    shortDescription,
    isNew,
    isSale,
  } = product;

  const inCart = isInCart(id);
  const inWishlist = isInWishlist(id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(id);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(id);
  };

  const discount = comparePrice ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0;

  return (
    <article className="group card-luxury overflow-hidden hover-lift">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-luxury-black-100">
        <Link href={`/products/${slug}`} className="block">
          <Image
            src={featuredImage}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isNew && (
            <span className="px-3 py-1 bg-gold-500 text-luxury-black text-xs font-heading uppercase tracking-wider">
              New
            </span>
          )}
          {isSale && discount > 0 && (
            <span className="px-3 py-1 bg-red-600 text-white text-xs font-heading uppercase tracking-wider">
              -{discount}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 ${inWishlist
              ? 'bg-gold-500 text-luxury-black'
              : 'bg-luxury-black/50 text-white hover:bg-gold-500 hover:text-luxury-black'
            }`}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <svg
            className="h-5 w-5"
            fill={inWishlist ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>

        {/* Quick Add Button */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full p-4 transition-transform duration-300 group-hover:translate-y-0">
          <button
            onClick={handleAddToCart}
            disabled={inCart}
            className={`w-full py-3 font-heading text-xs uppercase tracking-widest transition-all duration-300 ${inCart
                ? 'bg-silver-700 text-silver-400 cursor-not-allowed'
                : 'btn-luxury'
              }`}
          >
            {inCart ? 'In Cart' : 'Add to Cart'}
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <Link href={`/products/${slug}`} className="block group/title">
          <h3 className="font-heading text-lg text-champagne-200 line-clamp-1 group-hover/title:text-gold-500 transition-colors">
            {name}
          </h3>
        </Link>

        <p className="mt-1 text-xs text-silver-500 line-clamp-1">{shortDescription}</p>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`h-3.5 w-3.5 ${i < Math.floor(ratingAverage) ? 'text-gold-500' : 'text-silver-700'
                  }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-silver-600">({ratingCount})</span>
        </div>

        {/* Price */}
        <div className="mt-3 flex items-center gap-2">
          <span className="font-display text-xl text-gold-500">${price.toLocaleString()}</span>
          {comparePrice && comparePrice > price && (
            <span className="text-sm text-silver-600 line-through">${comparePrice.toLocaleString()}</span>
          )}
        </div>
      </div>
    </article>
  );
};

export default ProductCard;